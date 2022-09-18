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



// get ids and averages for characteristics by product
db.characteristic_reviews_transformed.aggregate(
  [
    {
      $group: {
        _id: "$product_id",
        numReviews: { $count: {}},
        idSize: {$first: "$characteristics.Size.id"},
        idWidth: {$first: "$characteristics.Width.id"},
        idFit: {$first: "$characteristics.Fit.id"},
        idLength: {$first: "$characteristics.Length.id"},
        idComfort: {$first: "$characteristics.Comfort.id"},
        idQuality: {$first: "$characteristics.Quality.id"},
        averageSize: { $avg: "$characteristics.Size.value" },
        averageWidth: { $avg: "$characteristics.Width.value" },
        averageFit: { $avg: "$characteristics.Fit.value" },
        averageLength: { $avg: "$characteristics.Length.value" },
        averageComfort: { $avg: "$characteristics.Comfort.value" },
        averageQuality: { $avg: "$characteristics.Quality.value" },

      }
    },

    {
      $out: "reviews_meta_characteristics"
    }
  ]
);

db.reviews_meta_characteristics.aggregate(
  [
    {
      $project: {
        _id: 1,
        numReviews: 1,
        characteristics: {
          Size: {
            $cond: {
              if: {
                $ne: ['$averageSize', null],
              },
              then: {id: "$idSize", value: '$averageSize'},
              else: '$$REMOVE',
            },
          },
          Width: {
            $cond: {
              if: {
                $ne: ['$averageWidth', null],
              },
              then: {id: "$idWidth", value: '$averageWidth'},
              else: '$$REMOVE',
            },
          },
          Fit: {
            $cond: {
              if: {
                $ne: ['$averageFit', null],
              },
              then: {id: "$idFit", value: '$averageFit'},
              else: '$$REMOVE',
            },
          },
          Length: {
            $cond: {
              if: {
                $ne: ['$averageLength', null],
              },
              then: {id: "$idLength", value: '$averageLength'},
              else: '$$REMOVE',
            },
          },
          Comfort: {
            $cond: {
              if: {
                $ne: ['$averageComfort', null],
              },
              then: {id: "$idComfort", value: '$averageComfort'},
              else: '$$REMOVE',
            },
          },
          Quality: {
            $cond: {
              if: {
                $ne: ['$averageQuality', null],
              },
              then: {id: "$idQuality", value: '$averageQuality'},
              else: '$$REMOVE',
            },
          }
        }

      }
    },

    {
      $out: "reviews_meta_characteristics"
    }
  ]
);

// merge characteristics with meta data
db.reviews_meta.aggregate(
  [
    {
      $lookup:
      {
        from: "reviews_meta_characteristics",
        localField: "_id",
        foreignField: "_id",
        as: "characteristics"
      }
    },

    {
      $project: {
        _id: 1,
        ratings: 1,
        recommendations: 1,
        characteristics: { $arrayElemAt: [ "$characteristics", 0 ] }
      }
    },

    {
      $project: {
        _id: 1,
        ratings: 1,
        recommendations: 1,
        characteristics: "$characteristics.characteristics"
      }
    },

    {
      $out: "reviews_meta"
    }
  ]);