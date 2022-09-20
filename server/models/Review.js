// Load mongoose library
const mongoose = require('mongoose');

// Import modules
const ReviewMeta = require('./ReviewMeta.js');

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


// // Create Characteristic Reviews Schema
// const characteristicReviewSchema = new mongoose.Schema(
//   {
//     _id: Number,
//     id: Number,
//     characteristic_id: Number,
//     value: Number
//   },
//   {collection: 'characteristic_reviews'}
// );


// Create Characteristic Schema
const characteristicSchema = new mongoose.Schema(
  {
    _id: Number,
    product_id: Number,
    name: String
  },
  {collection: 'characteristics_transformed'}
);

// Create models
const Review = mongoose.model('Review', reviewSchema);
const ReviewPhoto = mongoose.model('ReviewPhoto', photoSchema);
// const CharacteristicReview = mongoose.model('CharacteristicReview', characteristicReviewSchema);
const Characteristic = mongoose.model('Characteristic', characteristicSchema);

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
      const review_id = Number(review[0]['review_id']) + 1;
      bodyParams['review_id'] = review_id;
      bodyParams['_id'] = review_id;

      return ReviewPhoto.find({}).sort({id: -1}).limit(1)
    })

    // save review photos into the database
    .then((reviewPhoto) => {
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
      console.log("New Review Body Parameters: ");
      console.log(bodyParams);

      return ReviewPhoto.insertMany(photos)
    })

    // save review characteristics object into database
    // .then(() => {
    //   return CharacteristicReview.find({}).sort({id: -1}).limit(1)
    //     .then((characteristicReview) => {
    //       let characteristic_review_id = characteristicReview[0]['id'];
    //       const characteristicsArray = Object.keys(bodyParams.characteristics).map((characteristic_id, index) => {
    //         let new_characteristic_review_id = characteristic_review_id + index + 1;
    //         return {
    //           _id: new_characteristic_review_id,
    //           id: new_characteristic_review_id,
    //           characteristic_id: Number(characteristic_id),
    //           review_id: bodyParams.review_id,
    //           value: bodyParams.characteristics[characteristic_id]
    //         };
    //       });
    //       console.log("Review Characteristics");
    //       console.log(characteristicsArray);
    //       return CharacteristicReview.insertMany(characteristicsArray);
    //     })
    // })

    // update reviews metadata
    .then(() => {
      // console.log("update review metadata here!");
      const product_id = bodyParams.product_id;
      return ReviewMeta.getReviewMeta({product_id: product_id})
        .then((reviewMetadata) => {
          // Update ratings and recommendations
          // console.log("Old Metadata:");
          let result = reviewMetadata[0];
          // console.log(result);

          let oldRating = Number(result['ratings'][String(bodyParams.rating)]);
          let oldRecommend = Number(result['recommendations'][String(bodyParams.recommend)]);
          oldRating = isNaN(oldRating) ? 0 : oldRating;
          oldRecommend = isNaN(oldRecommend) ? 0 : oldRecommend;

          result.ratings[String(bodyParams.rating)] = String(oldRating + 1);
          result.recommendations[String(bodyParams.recommend)] = String(oldRecommend + 1);

          const numReviews = Number(result.recommendations["true"]) + Number(result.recommendations["false"]);
          // console.log("NumReviews: ", numReviews);

          // Update characteristics
          Object.keys(bodyParams.characteristics).forEach((characteristic_id) => {
            const characteristicValue = bodyParams.characteristics[characteristic_id];
            Characteristic.find({_id: characteristic_id}).select({name: 1})
              .then((characteristic_record) => {
                // console.log(characteristic_record[0]);
                const name = characteristic_record[0].name;
                // console.log("Product Name: ", name);
                const newValue = ((result.characteristics[name].value * numReviews) + characteristicValue) / (numReviews + 1);
                // console.log("New Average Value: ", newValue);
                result.characteristics[name].value = newValue;
                // console.log(result.characteristics[name]);
              })
              .then(() => {
                // console.log("New Metadata:");
                // console.log(result);
                const newReviewMetadata = new ReviewMeta.ReviewMeta(result);
                // return newReview.save();
                return ReviewMeta.ReviewMeta.replaceOne({_id: product_id}, newReviewMetadata);
              });
          });
        });
    })

    // save new review into database
    .then(() => {
      delete bodyParams.characteristics;
      // console.log("Body Params without characteristics:");
      // console.log(bodyParams);
      const newReview = new Review(bodyParams);
      return newReview.save();
    })

    .catch((error) => {
      return error;
    });

}

module.exports = { getReviews, markHelpful, report, addNewReview };
