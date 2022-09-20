// add indexes for characteristics and characteristic reviews for efficient merging in subsequent steps

db.characteristic_reviews_transformed.drop();
db.characteristics_transformed.drop();

// db.characteristic_reviews_transformed.getIndexes()
// db.characteristics_transformed.getIndexes()

// Replace auto generated _id with id in characteristics
db.characteristics.aggregate([
  {
    $addFields: {
      _id: "$id"
    }
  },

  {
    $out: "characteristics"
  }

]);


db.characteristic_reviews.createIndex( { review_id: 1} );
db.characteristic_reviews.createIndex( { characteristic_id: 1} );

db.characteristic_reviews.aggregate(
  [
    {
      $project: {
        _id: "$id",
        characteristic_id: 1,
        review_id: 1,
        value: 1
      }
    },

    {
      $out: "characteristic_reviews_transformed"
    }
  ]
);

db.characteristic_reviews_transformed.createIndex( { characteristic_id: 1} );
db.characteristic_reviews_transformed.getIndexes();

db.characteristics.aggregate(
  [
    {
      $project: {
        _id: "$id",
        product_id: 1,
        name: 1
      }
    },

    {
      $out: "characteristics_transformed"
    }
  ]
);


// merge characteristics with characteristics reviews
db.characteristic_reviews_transformed.aggregate(
  [
    {
      $lookup:
      {
        from: "characteristics_transformed",
        localField: "characteristic_id",
        foreignField: "_id",
        as: "characteristics"
      }
    },

    {
      $out: "characteristic_reviews_transformed"
    }
  ]);


// unwind characteristics array and select fields with project operator
db.characteristic_reviews_transformed.aggregate(
  [
    {$unwind: '$characteristics'},

    {
      $project: {
        _id: 1,
        review_id: 1,
        product_id: "$characteristics.product_id",
        characteristic_id: 1,
        name: "$characteristics.name",
        value: 1
      }
    },

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
              id: "$characteristic_id", // originally: "$_id"
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

// add indexes for product_id
db.characteristic_reviews_transformed.createIndex( { product_id: 1} );

// test
// check size of dataset == # of distinct review_id
db.characteristic_reviews.find().size();
db.characteristic_reviews_transformed.find().size();
// db.characteristic_reviews_transformed.distinct("_id").length;