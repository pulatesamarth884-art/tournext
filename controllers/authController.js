const {promisify} = require('util');
const crypto = require('crypto');
const User = require("./../models/userModel.js");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const appError = require("./../utils/appError.js");
const catchAsync = require("../utils/catchAsync.js");
const sendEmail = require("../utils/email.js");
dotenv.config({path: './config.env'});

const signupToken = id => {
    return jwt.sign({id: id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
};

const createSendToken = (user, statusCode, res) => {
    const token = signupToken(user._id);

    const cookiesOption = {
        expires: new Date(Date.now() + process.env.COOKIES_EXPIRE_IN * 24 * 60 * 10 * 1000),
        httpOnly: true
    };

    if(process.env.NODE_DEV == 'production') {
        cookiesOption.secure = true;
    };

    res.cookie("jwt", token, cookiesOption);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        },
    });
};

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create(req.body);
    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    // check email and password exist
    if(!email || !password) {
        return next(new appError('Please provide email and password', 400));
    }
    
    // check user exist and password is correct
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError("Please enter vaild password & email", 401));
    }
    
    //sent token if everything is ok
    createSendToken(user, 200, res);
});


exports.protect = catchAsync(async(req, res, next) => {
    //Getting token and checking it is their
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }else if(req.cookies.jwt) {
        token = req.cookies.jwt;
    }
    
    // check token exist
    if(!token) {
        return next(new appError("Your not login! please login to get access", 401))
    };
    
    //verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //check fresh user exsit or not
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
    return next(new AppError('The user belonging to this token does no longer exist.',401))
    };
    
    if(currentUser.changePasswordAfter(decoded.iat)) {
        return next(new appError('User changed password recently please try again later...', 401));
    }
    req.user = currentUser;
    next();

});


exports.isLogin = catchAsync(async(req, res, next) => {
    try {
        if(req.cookies.jwt) {
            //verification token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            //check fresh user exsit or not
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            };
    
            if(currentUser.changePasswordAfter(decoded.iat)) {
                return next();
            };

            res.locals.user = currentUser;
            return next();
        }
    } catch(err) {
        return next();
    }
    
    next();
});

exports.isLogout = async(req, res) => {
    await res.cookie('jwt', 'Logging out...', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success'});
}

exports.forgetPassword = catchAsync(async(req, res, next) => {
    //find user by email
    const user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new appError('User does not exist', 401));
    }

    //sent a random token
    const resetToken = user.createPasswordResetToken();
    await user.save({validateBeforeSave: false});
    

    //sent reset token to user via email or msg
    const resetUrl = `${req.protocol}://${req.get('host')}/user/resetPassword/${resetToken}`

    const message = `Hello, We received a request to reset the password for your account. You can reset your password by clicking the link below ${resetUrl}. If you didn't request a password reset, you can safely ignore this email — your password will remain unchanged. `
    
    try {
        await sendEmail({
            email: user.email,
            subject: 'Password reset token(vaild for 10min)',
            message, 
        });

        res.status(200).json({
            status: 'success',
            message: 'The token sent to email!'
        });
    } catch(err) {
        user.passwordResetToken = undefined;
        user.passwordExpiresAt = undefined;
        await user.save({validateBeforeSave: false});

        return next(new appError('Error to sent email! please try again later.'));
    }
    
});

exports.resetPassword = catchAsync(async(req, res, next) => {
    // find user by token also hash the token befoe search and change the filds 
    const tokenhashed = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')
    
    
    const user = await User.findOne({ passwordResetToken: tokenhashed, passwordExpiresAt: { $gt: Date.now() } });

    if(!user) {
        return next(new appError('Token is invalid or has expires', 400))
    };

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordExpiresAt = undefined;
    await user.save();

    //everything ok sent token
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async(req, res, next) => {

    //user find: findByIdUpdate not work here
    const user = await User.findById(req.user.id).select('+password');

    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new appError('Your current password is not correct', 401))
    }
    
    //update user pass in mongoodb
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //every thing ok sent token
    createSendToken(user, 200, res);
});
