// // Load mongoose library
const mongoose = require('mongoose');
// import mongoose from 'mongoose';

// // Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviews');


// Create Reviews Schema and Model
const reviewSchema = new mongoose.Schema(
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


const Review = mongoose.model('Review', reviewSchema);

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

let report = (review_id) => {
  return Reviews.findById({_id: review_id})
    .then((review) => {
      const report = { 'reported': review.reported === false ? true : false };
      return Reviews.findOneAndUpdate({_id: review_id}, report);
    })
    .catch((error) => {
      console.log(error)
    })
}

let addNewReview = (bodyParams) => {

  // add new fields to bodyParams object
  bodyParams['reviewer_name'] = bodyParams.name;
  bodyParams['reviewer_email'] = bodyParams.email;
  bodyParams['helpfulness'] = 0;
  bodyParams['reported'] = false;
  bodyParams['response'] = null;

  // delete extraneous columns
  delete bodyParams.name;
  delete bodyParams.email;

  // create new Review object for save
  const newReview = new Review(bodyParams);
  console.log(newReview);

  // save the new Review and return response
  return newReview.save();

}

module.exports = { getReviews, markHelpful, report, addNewReview };
