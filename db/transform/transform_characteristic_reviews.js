 // merge characteristics with characteristics reviews
  db.characteristic_reviews.aggregate(
  [
    {
      $lookup:
      {
        from: "characteristics_test",
        localField: "characteristic_id",
        foreignField: "id",
        as: "characteristics"
      }
    },

    {
      $replaceRoot:
      { newRoot:
        {
          $mergeObjects: [ {
            $arrayElemAt: [ "$characteristics", 0 ] },
            "$$ROOT"
          ]
        }
      }
    },

    { $project: { characteristics: 0 } },

    {
      $out: "characteristic_reviews_transformed"
    }
  ]);

// add characteristics field
db.characteristic_reviews_transformed.aggregate(
  [
    {
      $addFields:
        {"characteristic":
          {
              id: "$id",
              value: "$value"
          }
        }
    },

    {
      $out: "characteristic_reviews_transformed"
    }
  ]
);


// group characteristics for each review into an object
db.characteristic_reviews_transformed.aggregate(
  [
    {
      $group:
        {
          _id: {review_id: "$review_id", product_id: "$product_id"},
          // product_id: "$product_id"
          names: {
            $push: "$name"
          },
          characteristics: {
            $push: "$characteristic"
          }
        }
    },

    {
      $out: "characteristic_reviews_transformed"
    }
  ]
);


db.characteristic_reviews_transformed.aggregate(
  [
    {
      $project: {
        _id: 1,
        characteristics: {
          $zip:
            {
              inputs: ["$names", "$characteristics"]
            }
        }
      }
    },

    {
      $project: {
         _id: "$_id.review_id",
         product_id: "$_id.product_id",
         characteristics: { $arrayToObject: "$characteristics" }
      }
    },

    {
      $out: "characteristic_reviews_transformed"
    }
  ]
);

// add index for product_id
db.characteristic_reviews_transformed.createIndex( { product_id: 1} );