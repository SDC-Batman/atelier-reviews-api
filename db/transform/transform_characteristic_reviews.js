 // merge characteristics with characteristics reviews
 // TO-DO:
 // - more efficient join with indexes on each
 // - join on both product_id and characteristic_id
 // - benchmarking: time to complete!

 db.characteristic_reviews_test.aggregate(
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
      $out: "characteristic_reviews_transformed_test"
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