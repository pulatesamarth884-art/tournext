const AppError = require('../utils/appError.js');
const Review = require('./../models/reviewModel.js');
const catchAsync = require('./../utils/catchAsync.js');

exports.getAll = Model => catchAsync(async(req, res) => {
    try {
        filter = {}
        if(req.params.tourId) {
            filter = {tour: req.params.tourId};
        }
        const review = await Model.find(filter);
    
        res.status(200).json({
            status: 'sucess',
            review
        });
    }catch(err){  
        res.status(400).json({
            status: 'fail',
            err
        });
    };
});

exports.getOne = (populate ,Model) => catchAsync(async(req, res) => {
    try {
        const review = await Model.findById(req.params.id).populate(); // populate through review schema
    
        res.status(200).json({
            status: 'sucess',
            review
        });
    } catch(err){
        res.status(400).json({
            status: 'fail',
            err
        });
    };
});

exports.createOne = Model => catchAsync(async(req, res) => {
    try {
        const review = await Model.create(req.body);
    
        res.status(201).json({
            status: 'sucess',
            review
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            err
        });
    };
});

exports.updateOne = Model => catchAsync(async(req, res) => {
    try {
        const review = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
    
        res.status(201).json({
            status: 'sucess',
            review
        });
    } catch(err){
        res.status(400).json({
            status: 'fail',
            err
        });
    };
});

exports.deleteOne = Model =>  catchAsync(async(req, res) => {
    const review = await Model.findByIdAndDelete(req.params.id);

    if(!review) {
        return next(new AppError('Review not found with this id', 404))
    }
    
    res.status(204).json({
        status: 'sucess',
        message: null
    });
});