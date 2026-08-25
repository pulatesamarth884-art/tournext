const appError = require("./../utils/appError.js");
const Tour = require('../models/tourModel.js');
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("./../utils/appError.js");

exports.createTour = async(req,res) => {
    const createTour = await Tour.create(req.body);

    if(!createTour) {
        return next(new AppError('fail to create tour...', 404));
    }

    res.status(201).json({
        status: 'sucesss',
        tour: createTour
    });
};

exports.getTour = catchAsync(async(req, res, next) => {
    const tour = await Tour.findById(req.params.id);

    if(!tour) {
        return next(new AppError('Tour not found...', 404));
    }

    res.status(200).json({
        status: 'success',
        tour: tour
    });
});

exports.getAllTour = async(req, res) => {
        const allTour = await Tour.find(req.body);

        if(!allTour) {
            return next(new AppError('All tour not found...', 404));
        }

        res.status(201).json({
            status: 'success',
            tour: allTour
        });
};

exports.deleteTour = catchAsync(async(req, res) => {
        const deleteTour = await Tour.findByIdAndDelete(req.params.id)

        if(!deleteTour) {
            return next(new appError('Tour not found...', 404));
        }

        res.status(204).json({
            status: 'success',
            message: 'tour sucessfully deleted'
        });
});

exports.updateTour = (req, res) => {
    const updateTour = Tour.findByIdAndDelete(req.params.id);

    if(!updateTourour) {
        return next(new AppError('Fail to update tour...', 404));
    }
    res.status(201).json({
        status: 'success',
        tour: deleteTour
    });
};