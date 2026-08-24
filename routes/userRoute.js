const express = require("express");
const router = express.Router();

const authController = require("./../controllers/authController.js");
const userController = require("./../controllers/userController.js");

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.isLogout);

router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updateMyPassword', authController.protect, authController.updatePassword);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);


router
    .route('/')
    .get(authController.protect, userController.allUser);
    

// router
//     .route('/:id')

module.exports = router;