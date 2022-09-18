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

// create test data for a specific product
db.characteristic_reviews_transformed.aggregate(
  [
    {
      $project: {
        _id: 1,
        product_id: 1,
        characteristics: 1
      }

    },

    {
      $match: {
        product_id: 4
      }

    },

    {
      $out: "characteristics_reviews_transformed_product"
    }
  ]
);


db.characteristics_reviews_transformed_product.aggregate(
  [
    {
      $group: {
        _id: "$product_id",
        numReviews: { $count: {}},
        averageSize: { $avg: "$characteristics.Size.value" },
        averageWidth: { $avg: "$characteristics.Width.value" },
        averageFit: { $avg: "$characteristics.Fit.value" },
        averageLength: { $avg: "$characteristics.Length.value" },
        averageComfort: { $avg: "$characteristics.Comfort.value" },
        averageQuality: { $avg: "$characteristics.Quality.value" },

      }
    },

    {
      $project: {
        _id: 1,
        numReviews: 1,
        averageSize: {
          $cond: {
            if: {
              $ne: ['$averageSize', null],
            },
            then: '$averageSize',
            else: '$$REMOVE',
          },
        },
        averageWidth: {
          $cond: {
            if: {
              $ne: ['$averageWidth', null],
            },
            then: '$averageWidth',
            else: '$$REMOVE',
          },
        },
        averageFit: {
          $cond: {
            if: {
              $ne: ['$averageFit', null],
            },
            then: '$averageFit',
            else: '$$REMOVE',
          },
        },
        averageLength: {
          $cond: {
            if: {
              $ne: ['$averageLength', null],
            },
            then: '$averageLength',
            else: '$$REMOVE',
          },
        },
        averageComfort: {
          $cond: {
            if: {
              $ne: ['$averageComfort', null],
            },
            then: '$averageComfort',
            else: '$$REMOVE',
          },
        },
        averageQuality: {
          $cond: {
            if: {
              $ne: ['$averageQuality', null],
            },
            then: '$averageQuality',
            else: '$$REMOVE',
          },
        }

      }
    },

    {
      $out: "reviews_meta_characteristics"
    }
  ]
);


    // {
    //   $project: {
    //     _id: 1,
    //     numReviews: 1,
    //     characteristics: {
    //       Size: {
    //         value: "$averageSize"
    //       },
    //       Width: {
    //         value: "$averageWidth"
    //       },
    //       Fit: {
    //         value: "$averageFit"
    //       },
    //       Length: {
    //         value: "$averageLength"
    //       },
    //       Comfort: {
    //         value: "$averageComfort"
    //       },
    //       Quality: {
    //         value: "$averageQuality"
    //       }
    //     }
    //   }
    // },