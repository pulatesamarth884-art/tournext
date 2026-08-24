const AppError = require('../utils/appError.js');
const catchAsync = require('../utils/catchAsync.js');
const Tour = require('./../models/tourModel.js');


exports.tourOverview = async (req, res) => {
    try {
        const tours = await Tour.find();

        res.status(200).render('overview', {
            status: "All tour",
            tours
        });
    }catch(err) {
       res.status(500).json({
            status: "fail",
            message: err
        });
    };
};

exports.getTour = catchAsync(async(req, res, next)=> {
    const tour = await Tour.findOne({slug: req.params.slug}).populate({
        path: 'reviews',
        select: 'review user rating'
    }); //slug is a URL-friendly version in our case slug is a tour's name.
    
    if(!tour) {
        return next(new AppError("Their is no tour with that name", 404));
    }
        
    res.status(200).render('tour', {
        status: 'sucess',
        tour
    });
});

exports.getLoginPage = async(req, res) => {
    res.status(200).render('login', {
        status: 'sucess'
    });
};

exports.getSignUpPage = async(req, res) => {
    res.status(200).render('signup', {
        status: 'sucess'
    });
};

exports.accountPage = async(req, res) => {
    const user = 
    res.status(200).render('account', {
        status: 'success',
        user: req.user
    });
};

