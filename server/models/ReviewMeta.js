// Load mongoose library
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/' + process.env.DB_NAME);

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


const ReviewMeta = mongoose.model('ReviewMeta', metaSchema);

// Create Database functions
let getReviewMeta = (queryParams) => {
  const { product_id } = queryParams;
  return ReviewMeta.find({_id: product_id}).select({_id: 0});
}

module.exports = { getReviewMeta };
