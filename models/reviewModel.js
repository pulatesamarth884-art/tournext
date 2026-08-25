const mongoose = require('mongoose');
const Tour = require('./tourModel');
const AppError = require('../utils/appError.js');

const reviewSchema = mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'The tour must require...']
    },  
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'The user must require...']
    },
    review: {
        type: String,
        required: [true, 'review can not be empty!'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
});

reviewSchema.statics.calcAvgRatings = async function(tourId) {
    const stats = await this.aggregate([
        {
            $match: {tour: tourId}
        },
        {   
            $group: {
                _id: '$tour',
                nRating: {$sum: 1},
                calsAvg: {$avg:'$rating'}
            }    
        }
    ]);
     
    if(stats.length > 0) {
        await Tour.findByIdAndUpdate(tourId, {
            ratingQuntity: stats[0].nRating,
            ratingAverage: stats[0].calsAvg
        });
    } else {
        await Tour.findByIdAndUpdate(tourId, {
            ratingQuntity: 0,
            ratingAverage: 0
        });
    };
};

// review doublication

reviewSchema.pre('save', async function(next) {
    const reviewExist = await this.constructor.findOne({
        tour: this.tour,
        user: this.user
    })

    if(reviewExist) {
        return next(new AppError('You all ready review this tour 😊',400));
    }

    next;
})

reviewSchema.post('save', function(next) {
    this.constructor.calcAvgRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
    this.r = await this.clone().findOne();
    next;
});

reviewSchema.post(/^findOneAnd/, function() {
    this.r.constructor.calcAvgRatings(this.r.tour)
});


const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;