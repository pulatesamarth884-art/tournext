const express = require('express');
const router = express.Router();

const viewController = require('./../controllers/viewController.js');
const authController = require('./../controllers/authController.js');

router.use(authController.isLogin)

router.get('/', authController.isLogin, viewController.tourOverview)
router.get('/tour/:slug', authController.isLogin, viewController.getTour)
router.get('/login',authController.isLogin, viewController.getLoginPage) 
router.get('/signup',authController.isLogin, viewController.getSignUpPage) 
router.get('/me', authController.protect, viewController.accountPage)

module.exports = router;