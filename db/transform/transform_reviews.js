// require('dotenv').config();
// console.log(process.env);

// // Open MongoDB shell
// mongosh "mongodb://localhost:27017" + DB_NAME

// select fields
// modify id, date, and response fields


db.reviews.aggregate(
  [
    {
      $project: {
        _id: "$id",
        review_id: "$id",
        product_id: 1,
        rating: 1,
        date: {$convert: {input: {$toDate: "$date"}, to: "string"}},
        summary: 1,
        body: 1,
        recommend: {
          $cond: {
            if: { $eq: ["$recommend", "true"]},
            then: true,
            else: false
          }
        },
        reported: {
          $cond: {
            if: { $eq: ["$reported", "true"]},
            then: true,
            else: false
          }
        },
         reviewer_name: 1,
         reviewer_email: 1,
         response: {
          $cond: {
            if: { $eq: ["$response", "null"]},
            then: null,
            else: "$response"
          }
        },
         helpfulness: 1
      }
    },

    {
      $out: "reviews_transformed"
    }
  ]
);

// Add indexes for review_id and product_id
db.reviews_transformed.createIndex( { review_id: 1} );
db.reviews_transformed.createIndex( { product_id: 1} );

// join with reviews_photos_transformed to add photos
db.reviews_transformed.aggregate(
  [
    {
      $lookup:
      {
        from: "reviews_photos_transformed",
        localField: "_id",
        foreignField: "_id",
        as: "photos"
      }
    },

    {
      $addFields: {
        photos: { $arrayElemAt: [ "$photos", 0 ] }
      }
    },

    {
      $addFields: {
        photos: "$photos.photos"
      }
    },

    {
      $out: "reviews_transformed"
    }
  ]);

