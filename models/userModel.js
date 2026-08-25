const crypto = require('crypto');
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcrypt');
const { resetPassword } = require('../controllers/authController');

//name, email, photo, password, confirmpassword 
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter your name"],
    },
    email: {
        type: String, 
        required: [true, "please enter your email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "please enter vaild email"],
    },
    photo: String,
    role: {
        type: String,
        enum: ['admin', 'user', 'guide', 'lead-guide'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "please enter your email"],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, "please confirm your email"],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Passwords are not same!"
        }
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordExpiresAt: Date,
    active: {
        type: Boolean,
        default: true
    }
});

userSchema.pre('save', async function() {
    if(!this.isModified('password')) {
        return;
    };
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
});

userSchema.pre('save', function() {
    if(!this.isModified('password')) {
        return;
    }
    this.passwordExpiresAt = Date.now() - 1000;
});

userSchema.methods.correctPassword = function(candidatePassword, realPassword) {
    return bcrypt.compare(candidatePassword, realPassword);
};

userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.passwordExpiresAt = Date.now() + 10 * 60 * 1000

    return resetToken;
}

userSchema.methods.changePasswordAfter = function(JwtTimeStamp) {
    if(this.passwordChangedAt) {
        const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
        return JwtTimeStamp < changedTimeStamp;
    }
    return false;
}
const User = mongoose.model("User", userSchema);
module.exports = User;