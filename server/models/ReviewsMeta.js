// // Load mongoose library
const mongoose = require('mongoose');
// import mongoose from 'mongoose';

// // Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviews');


// Create Reviews Schema and Model
const metaSchema = new mongoose.Schema(
  {
    _id: Number,
    ratings: {'1': String, '2': String, '3': String, '4': String, '5': String},
    recommendations: {'true': String, 'false': String},
    characteristics: {
      Fit: {
        id: Number, value: Number
      },
      Length: {
        id: Number, value: Number
      },
      Comfort: {
        id: Number, value: Number
      },
      Quality: {
        id: Number, value: Number
      }
    }
  },
  {collection: 'reviews_meta'}
);


const ReviewsMeta = mongoose.model('ReviewsMeta', metaSchema);

// Create Database functions
let getReviewsMeta = (queryParams) => {
  const { product_id } = queryParams;
  return ReviewsMeta.find({_id: product_id});
}

module.exports = { getReviewsMeta };
