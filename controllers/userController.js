const catchAsync = require("../utils/catchAsync.js");
const User = require("./../models/userModel.js");
const appError = require("./../utils/appError.js");

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if(allowedFields.includes(el)) {
            newObj[el] = obj[el];
        };
    });
    return newObj;
};

exports.allUser = catchAsync(async(req, res, next) => {
    const allUser = await User.find();

    res.status(200).json({
        status: 'success',
        data: {
            user: allUser,
        },
    });
});

exports.updateMe = catchAsync(async(req, res, next) => {
    if(req.body.password || req.body.passwordConfirm) {
        return next(new appError('This route is not for password use /updateMyPassword', 400));
    }

    const filterBody = filterObj(req.body, 'name', 'email');
    const userUpdated = await User.findByIdAndUpdate(req.user.id, filterBody, {
        returnDocument: 'after',
        runValidators: true
    });
    

    res.status(200).json({
        status:'success',
        user: userUpdated
    });
});

exports.deleteMe = catchAsync( async(req, res) => {
    await User.findByIdAndUpdate(req.user.id, {deafult: false})
    
    res.status(204).json({
        status: 'sucess',
        data: null
    });
});