 // merge characteristics with characteristics reviews
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
      $out: "characteristic_reviews_test_transformed"
    }
  ]);



//   db.characteristic_reviews_test_transformed.aggregate(
//     [
//        {
//           $project: {
//              _id: 1,
//              review_id: 1,
//              product_id: 1,
//              id: 1,
//              name: 1,
//              characteristic_id: 1,
//              value: 1
//           }
//        },

//       {
//           $out: "characteristic_reviews_test_transformed_v2"
//       }
//     ]
//  );

// add characteristics field
db.characteristic_reviews_test_transformed.aggregate(
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
      $out: "characteristic_reviews_test_transformed_v2"
    }
  ]
);


// group characteristics for each review into an object
db.characteristic_reviews_test_transformed_v2.aggregate(
  [
    {
      $group:
        {
          _id: "$review_id",
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
      $out: "characteristic_reviews_test_transformed_v3"
    }
  ]
);


db.characteristic_reviews_test_transformed_v3.aggregate(
  [
    {
      $zip:
        {
          inputs: ["$names", "$characteristics"]
        }
    },

    {
      $out: "characteristic_reviews_test_transformed_v4"
    }
  ]
);