const express = require('express');

const reviewController = require("./../controllers/reviewController.js");
const authController = require("./../controllers/authController.js");
const router = express.Router({mergeParams: true});

router
    .route('/')
    .get(authController.protect, reviewController.getAllReview)
    .post(authController.protect, reviewController.setTourUserIds, reviewController.createReview)

router
    .route('/:id')
    .get(authController.protect, reviewController.getOneReview)
    .patch(authController.protect, reviewController.updateReview)
    .delete(authController.protect, reviewController.deleteReview)

module.exports = router;
    
