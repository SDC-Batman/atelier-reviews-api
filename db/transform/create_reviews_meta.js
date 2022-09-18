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
        recommendations: { $arrayToObject: "$recommendations" }
      }
    },

    {
      $out: "reviews_meta_recommendations"
    }
  ]
);


// merge characteristics with characteristics reviews
db.reviews_meta_ratings.aggregate(
  [
    {
      $lookup:
      {
        from: "reviews_meta_recommendations",
        localField: "_id",
        foreignField: "_id",
        as: "recommendations"
      }
    },

    {
      $project: {
        _id: 1,
        ratings: 1,
        recommendations: { $arrayElemAt: [ "$recommendations", 0 ] }
      }
    },

    {
      $project: {
        _id: 1,
        ratings: 1,
        recommendations: "$recommendations.recommendations"
      }
    },

    {
      $out: "reviews_meta"
    }
  ]);



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
        // characteristics: {
        //   Size: {id: "$characteristics.Size.id", value: { $avg: "$characteristics.Size.value" }},
        //   Width: {id: "$characteristics.Width.id", value: { $avg: "$characteristics.Width.value" }),
        //   Fit: {id: "$characteristics.Fit.id", value: { $avg: "$characteristics.Fit.value" }},
        //   Length: {id: "$characteristics.Length.id", value: { $avg: "$characteristics.Length.value" }},
        //   Comfort: {id: "$characteristics.Comfort.id", value: { $avg: "$characteristics.Comfort.value" }},
        //   Quality: {id: "$characteristics.Quality.id", value: { $avg: "$characteristics.Quality.value" }}
        // }
        characteristics: {
          averageSize: { $avg: "$characteristics.Size.value" },
          averageWidth: { $avg: "$characteristics.Width.value" },
          averageFit: { $avg: "$characteristics.Fit.value" },
          averageLength: { $avg: "$characteristics.Length.value" },
          averageComfort: { $avg: "$characteristics.Comfort.value" },
          averageQuality: { $avg: "$characteristics.Quality.value" }
        }
        // averageSize: { $avg: "$characteristics.Size.value" },
        // averageWidth: { $avg: "$characteristics.Width.value" },
        // averageFit: { $avg: "$characteristics.Fit.value" },
        // averageLength: { $avg: "$characteristics.Length.value" },
        // averageComfort: { $avg: "$characteristics.Comfort.value" },
        // averageQuality: { $avg: "$characteristics.Quality.value" },

    },

    {
      $project: {

      }
    },

    {
      $out: "reviews_meta_characteristics"
    }
  ]
);