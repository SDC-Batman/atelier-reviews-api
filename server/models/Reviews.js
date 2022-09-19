// // Load mongoose library
const mongoose = require('mongoose');
// import mongoose from 'mongoose';


// // Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviews');

// const photosSchema = new mongoose.Schema({
//   _id: Number,
//   photos: [{ id: Number, url: String }]
// }, {collection: 'reviews_photos_transformed'});

// // Create Reviews Model
// const ReviewPhotosModel = mongoose.model('ReviewPhotos', photosSchema);

// // Query Reviews
// ReviewPhotosModel.find({_id: 5});



const reviewsSchema = new mongoose.Schema(
  {
    _id: Number,
    product_id: Number,
    rating: Number,
    summary: String,
    body: String,
    reviewer_name: String,
    reviewer_email: String,
    helpfulness: Number,
    date: Date,
    recommend: Boolean,
    reported: Boolean,
    response: String,
    photos: [{ id: Number, url: String }]
  },
  {collection: 'reviews_transformed'}
);

// Create Reviews Model
const Reviews = mongoose.model('Reviews', reviewsSchema);

let getReviews = (queryParams) => {
  const { product_id, count, page, sort } = queryParams;
  // return Reviews.find({_id: req.query.product_id});
  return Reviews.find({_id: product_id});
}

// module.exports = { Reviews };
module.exports = { getReviews };
// export { Reviews };