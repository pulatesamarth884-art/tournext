const express = require('express');
const router = express.Router();

const tourController = require('../controllers/tourController.js');
const authController = require("./../controllers/authController.js");
const reviewRoute = require('./reviewRoute.js');

router.use('/:tourId/reviews', reviewRoute)

router
    .route('/')
    .get(authController.protect, tourController.getAllTour)
    .post(authController.protect, tourController.createTour)

router
    .route('/:id')
    .get(tourController.getTour)
    .delete(tourController.deleteTour)
    .patch(tourController.updateTour)

module.exports = router;
    