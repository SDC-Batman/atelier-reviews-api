// Load mongoose library
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/' + process.env.DB_NAME);

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
  const { product_id, sort } = queryParams;

  if (sort === 'helpful') {
    return Review.find({product_id: product_id}).sort({helpfulness: -1});

  } else if (sort === 'newest') {
    return Review.find({product_id: product_id}).sort({date: -1});
  }
  // default sort is relevance
  else {
    return Review.find({product_id: product_id}).sort({helpfulness: -1, date: -1});
  }

}

let markHelpful = (review_id) => {
  return Review.findById({_id: review_id})
    .then((review) => {
      const helpfulness = { 'helpfulness': review.helpfulness + 1 };
      return Review.findOneAndUpdate({_id: review_id}, helpfulness);
    })
    .catch((error) => {
      console.log(error)
    })
}

let report = (review_id) => {
  return Review.findById({_id: review_id})
    .then((review) => {
      const report = { 'reported': review.reported === false ? true : false };
      return Review.findOneAndUpdate({_id: review_id}, report);
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
