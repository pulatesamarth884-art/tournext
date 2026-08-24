const mongoose = require('mongoose');
const { validate } = require('./userModel');
const { mongoosePopulatedDocumentMarker } = require('mongoose');
const slugify = require("slugify");

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        trim: true,
        maxlength: [40, 'Maxmium charater in the tour is 40'],
        minlength: [10, 'Minmium charater in the tour is 10']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'the tour must have duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'the tour must have group']
    },
    diffculty: {
        type: String,
        required: [true, 'the tour must have diffculty'],
        enum: {
            values: ['easy', 'medium','hard',],
            message: 'the tour have the diffculty: easy , medium, hard'
        }
    },
    ratingQuntity: {
        type: Number,
        default: 0
    }, 
    ratingAverage: {
        type:Number,
        default: 4.5,
        min: [1, 'rating should be above 1'],
        max: [5, 'rating should be below 5']
    },
    price: {
        type: Number,
        required: [true, 'tour must have the price']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator : function(val) {
                return val < this.price;
            }
        },
        message: 'discount price {val}, should be below regular price'
    },
    summary: {
        type: String,
        required: [true, 'tour must have summary']
    },
    description: {
        type: String,
        required: [true, 'tour must have description']
    },
    imageCover: {
        type: String,
        required: [true, 'tour must have image cover']
    },
    images: {
        type: [String],
        required: [true, 'tour must have image']
    },
    totalStops: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now(), 
        select: false
    },
    startDate: {
        type: [Date]
    },
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'point',
            enum: ['point'] ,
        },
        coordinate: ['Number'],
        description: String,
        address: String,
    },
    location: {
        type: {
            type: String,
            default: 'point',
            enum: ['point'] ,
        },
        coordinate: ['Number'],
        description: String,
        address: String,
        day: String
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.pre('validate', function() {
    if(this.name && !this.slug ) {
        this.slug = slugify(this.name, {lower: true, strict: true});
    };
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour