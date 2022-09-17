// aggregate ratings
db.reviews_transformed.aggregate(
  [

    {
      $group: {
        _id: {
          product_id: "$product_id",
          rating: "$rating"
        },
        count: {
          "$sum": 1
        }
      }
    },

    {
      $group: {
        _id: "$_id.product_id",
        ratings: {
          $push: {
            k: {$convert: {input: "$_id.rating", to: "string"}},
            v: {$convert: {input: "$count", to: "string"}}
          }
        }

      }
    },

    {
      $project: {
        _id: 1,
        ratings: { $arrayToObject: "$ratings" }
      }
    },

    {
      $out: "reviews_meta_ratings"
    }
  ]
);

// aggregate recommendations
db.reviews_transformed.aggregate(
  [

    {
      $group: {
        _id: {
          product_id: "$product_id",
          recommend: "$recommend"
        },
        count: {
          "$sum": 1
        }
      }
    },

    {
      $group: {
        _id: "$_id.product_id",
        recommendations: {
          $push: {
            k: {$convert: {input: "$_id.recommend", to: "string"}},
            v: {$convert: {input: "$count", to: "string"}}
          }
        }

      }
    },

    {
      $project: {
        _id: 1,
        ratings: { $arrayToObject: "$recommendations" }
      }
    },

    {
      $out: "reviews_meta_recommendations"
    }
  ]
);


// aggregate characteristics
// db.characteristic_reviews_transformed.aggregate(
//   [

//     {
//       $group: {
//         _id: {
//           product_id: "$product_id",
//           recommend: "$recommend"
//         },
//         count: {
//           "$sum": 1
//         }
//       }
//     },

//     {
//       $group: {
//         _id: "$_id.product_id",
//         recommendations: {
//           $push: {
//             k: {$convert: {input: "$_id.recommend", to: "string"}},
//             v: {$convert: {input: "$count", to: "string"}}
//           }
//         }

//       }
//     },

//     {
//       $project: {
//         _id: 1,
//         ratings: { $arrayToObject: "$recommendations" }
//       }
//     },

//     {
//       $out: "reviews_meta_characteristics"
//     }
//   ]
// );


db.characteristic_reviews_transformed.aggregate(
  [
    {
      $group: {
        _id: "$product_id",
        averageSize: { $avg: "$characteristics.Size.value" },
        averageWidth: { $avg: "$characteristics.Width.value" },
        averageFit: { $avg: "$characteristics.Fit.value" },
        averageLength: { $avg: "$characteristics.Length.value" },
        averageComfort: { $avg: "$characteristics.Comfort.value" },
        averageQuality: { $avg: "$characteristics.Quality.value" },
      }
    },

    {

    },

    {
      $out: "reviews_meta_characteristics"
    }
  ]
);