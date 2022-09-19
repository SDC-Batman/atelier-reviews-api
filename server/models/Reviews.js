// // Load mongoose library
const mongoose = require('mongoose');
// import mongoose from 'mongoose';

// // Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviews');


// Create Reviews Schema and Model
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


const Reviews = mongoose.model('Reviews', reviewsSchema);

// Create Database functions
let getReviews = (queryParams) => {
  const { product_id, count, page, sort } = queryParams;
  return Reviews.find({product_id: product_id});
}

let markHelpful = (review_id) => {
  return Reviews.findById({_id: review_id})
    .then((review) => {
      const helpfulness = { 'helpfulness': review.helpfulness + 1 };
      return Reviews.findOneAndUpdate({_id: review_id}, helpfulness);
    })
    .catch((error) => {
      console.log(error)
    })
}

let report = (queryParams) => {
  const { review_id } = queryParams;
  return Reviews.updateOne({_id: review_id});
}

module.exports = { getReviews, markHelpful, report };
