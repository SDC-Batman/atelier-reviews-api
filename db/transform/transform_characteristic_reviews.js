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



  db.characteristic_reviews_test_transformed.aggregate(
    [
       {
          $project: {
             _id: "$review_id",
             name: 1,

          }
       },

      {
          $out: "characteristic_reviews_test_transformed_v2"
      }
    ]
 )