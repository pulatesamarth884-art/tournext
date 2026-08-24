const factory = require('./handlerFactory.js');
const Review = require('./../models/reviewModel.js');

// to merage two url 
exports.setTourUserIds = (req, res, next) => {
    // for automatic fill user and tour ids in review
    if(!req.body.user) req.body.user = req.user.id;
    if(!req.body.tour) req.body.tour = req.params.tourId;

    next();
}

exports.getAllReview = factory.getAll(Review);
exports.getOneReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
