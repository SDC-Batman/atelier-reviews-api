// select fields
// modify id, date, and response fields
db.reviews.aggregate(
  [
    {
      $project: {
         _id: "$id",
         product_id: 1,
         rating: 1,
         date: {$convert: {input: {$toDate: "$date"}, to: "string"}},
         summary: 1,
         body: 1,
         recommend: {$toBool: "$recommend"},
         reported: {$toBool: "$reported"},
         reviewer_name: 1,
         reviewer_email: 1,
         response: 1,
         helpfulness: 1
      }
    },

    {
      $out: "reviews_transformed"
    }
  ]
);


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
      $out: "reviews_transformed"
    }
  ]);


// add index for product_id
db.reviews_transformed.createIndex( { product_id: 1} );