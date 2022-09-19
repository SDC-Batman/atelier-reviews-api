// Load mongoose library
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/' + process.env.DB_NAME);

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
    photos: [{ id: Number, url: String }]
  },
  {collection: 'reviews_transformed'}
);

// Create Review Photos Schema
const photoSchema = new mongoose.Schema(
  {
    _id: Number,
    id: Number,
    review_id: Number,
    url: String
  },
  {collection: 'reviews_photos'}
);

// Create models
const Review = mongoose.model('Review', reviewSchema);
const ReviewPhoto = mongoose.model('ReviewPhoto', photoSchema);

// Create Database functions
let getReviews = (queryParams) => {
  const { product_id, sort } = queryParams;

  if (sort === 'helpful') {
    return Review.find({product_id: product_id}).sort({helpfulness: -1}).select({_id: 0});

  } else if (sort === 'newest') {
    return Review.find({product_id: product_id}).sort({date: -1}).select({_id: 0});
  }
  // default sort is relevance
  else {
    return Review.find({product_id: product_id}).sort({helpfulness: -1, date: -1}).select({_id: 0});
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

  // delete extraneous fields
  delete bodyParams.name;
  delete bodyParams.email;

  // get total number of reviews to construct new review_id
  return Review.find({}).sort({review_id: -1}).limit(1)
    .then((review) => {
      // create new review_id
      const review_id = Number(review[0]['review_id']) + 1;
      bodyParams['review_id'] = review_id;
      bodyParams['_id'] = review_id;

      return ReviewPhoto.find({}).sort({id: -1}).limit(1)
    })
    .then((reviewPhoto) => {
      // create new review photos ids
      let review_photo_id = reviewPhoto[0]['id'];
      const photos = bodyParams.photos.map((photo, index) => {
        const new_review_photo_id = review_photo_id + index + 1;
        return new ReviewPhoto({
            _id: new_review_photo_id,
            id: new_review_photo_id,
            review_id: bodyParams['review_id'],
            url: photo
          });
      });
      bodyParams['photos'] = photos.map((photo) => {
        return {
          id: photo._id,
          url: photo.url
        };
      });
      console.log(bodyParams);
      // save photos into the database
      return ReviewPhoto.insertMany(photos)
    })
    .then(() => {
      // save new review into database
      const newReview = new Review(bodyParams);
      return newReview.save();
    })
    .catch((error) => {
      return error;
    });

}

module.exports = { getReviews, markHelpful, report, addNewReview };
