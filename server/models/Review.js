/* eslint-disable import/extensions */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
/* eslint-disable camelcase */
/* eslint-disable object-shorthand */

// Load mongoose library
const mongoose = require('mongoose');

// Import modules
const ReviewMeta = require('./ReviewMeta.js');

// Connect to MongoDB
const options = {
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
};
// mongoose.connect(process.env.DB_URI_STRING + process.env.DB_NAME);
mongoose.connect(process.env.REMOTE_DB_URI_STRING, options);

// Create Reviews Schema
const reviewSchema = new mongoose.Schema(
  {
    _id: Number,
    review_id: Number,
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
    photos: [{ _id: false, id: Number, url: String }],
  },
  {
    collection: 'reviews_transformed',
  },
);

// Create Review Photos Schema
const photoSchema = new mongoose.Schema(
  {
    _id: Number,
    id: Number,
    review_id: Number,
    url: String,
  },
  {
    collection: 'reviews_photos',
  },
);

// Create Characteristic Schema
const characteristicSchema = new mongoose.Schema(
  {
    _id: Number,
    product_id: Number,
    name: String,
  },
  {
    collection: 'characteristics_transformed',
  },
);

// Create models
const Review = mongoose.model('Review', reviewSchema);
const ReviewPhoto = mongoose.model('ReviewPhoto', photoSchema);
const Characteristic = mongoose.model('Characteristic', characteristicSchema);

// Create Database functions
const getReviews = (queryParams) => {
  const { product_id, sort } = queryParams;

  if (sort === 'helpful') {
    return Review.find({ product_id: product_id, reported: false })
      .sort({ helpfulness: -1 })
      .select({ _id: 0 });
  } if (sort === 'newest') {
    return Review.find({ product_id: product_id, reported: false })
      .sort({ date: -1 })
      .select({ _id: 0 });
  }
  return Review.find({ product_id: product_id, reported: false })
    .sort({ helpfulness: -1, date: -1 })
    .select({ _id: 0 });
};

const markHelpful = (review_id) => Review.findById({ _id: review_id })
  .then((review) => {
    const helpfulness = { helpfulness: review.helpfulness + 1 };
    return Review.findOneAndUpdate({ _id: review_id }, helpfulness);
  })
  .catch((error) => {
    console.log(error);
  });

const report = (review_id) => Review.findById({ _id: review_id })
  .then((review) => {
    const reported = { reported: review.reported === false };
    return Review.findOneAndUpdate({ _id: review_id }, reported);
  })
  .catch((error) => {
    console.log(error);
  });

const addNewReview = (bodyParams) => {
  // add new fields to bodyParams object
  bodyParams.reviewer_name = bodyParams.name;
  bodyParams.reviewer_email = bodyParams.email;
  bodyParams.helpfulness = 0;
  bodyParams.reported = false;
  bodyParams.response = null;

  // delete extraneous fields
  delete bodyParams.name;
  delete bodyParams.email;

  // get total number of reviews to construct new review_id
  return Review.find({}).sort({ review_id: -1 }).limit(1)
    .then((review) => {
      const review_id = Number(review[0].review_id) + 1;
      bodyParams.review_id = review_id;
      bodyParams._id = review_id;

      return ReviewPhoto.find({}).sort({id: -1}).limit(1)
    })

    // save review photos into the database
    .then((reviewPhoto) => {
      const review_photo_id = reviewPhoto[0].id;
      const photos = bodyParams.photos.map((photo, index) => {
        const new_review_photo_id = review_photo_id + index + 1;
        return new ReviewPhoto({
          _id: new_review_photo_id,
          id: new_review_photo_id,
          review_id: bodyParams.review_id,
          url: photo,
        });
      });
      bodyParams.photos = photos.map((photo) => ({
        id: photo._id,
        url: photo.url,
      }));
      return ReviewPhoto.insertMany(photos);
    })

    // update reviews metadata
    .then(() => {
      const { product_id } = bodyParams;
      return ReviewMeta.getReviewMeta({ product_id: product_id })
        .then((reviewMetadata) => {
          const result = reviewMetadata[0];

          let oldRating = Number(result.ratings[String(bodyParams.rating)]);
          let oldRecommend = Number(result.recommended[String(bodyParams.recommend)]);
          oldRating = Number.isNaN(oldRating) ? 0 : oldRating;
          oldRecommend = Number.isNaN(oldRecommend) ? 0 : oldRecommend;

          result.ratings[String(bodyParams.rating)] = String(oldRating + 1);
          result.recommended[String(bodyParams.recommend)] = String(oldRecommend + 1);

          const numReviews = Number(result.recommended.true) + Number(result.recommended.false);

          // Update characteristics
          Object.keys(bodyParams.characteristics).forEach((characteristic_id) => {
            const characteristicValue = bodyParams.characteristics[characteristic_id];

            Characteristic.find({ _id: characteristic_id }).select({ name: 1 })
              .then((characteristic_record) => {
                const { name } = characteristic_record[0];

                const newValue = ((result.characteristics[name].value * numReviews) + characteristicValue) / (numReviews + 1);
                result.characteristics[name].value = newValue;
              })
              .then(() => {
                const newReviewMetadata = new ReviewMeta.ReviewMeta(result);
                return ReviewMeta.ReviewMeta.replaceOne({ _id: product_id }, newReviewMetadata);
              });
          });
        });
    })

    // save new review into database
    .then(() => {
      delete bodyParams.characteristics;
      const newReview = new Review(bodyParams);
      return newReview.save();
    })

    .catch((error) => error);
};

module.exports = {
  getReviews, markHelpful, report, addNewReview,
};
