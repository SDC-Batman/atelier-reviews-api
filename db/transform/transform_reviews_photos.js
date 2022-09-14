// const fs = require('fs');
// const path = require('path');
// const csv = require('fast-csv');

// console.log(__dirname);
// // console.log(path.resolve(__dirname, '../../data', 'reviews_photos_test.csv'));

// // Parse the test data
// fs.createReadStream(path.resolve(__dirname, '../../data', 'reviews_photos_test.csv'))
//     .pipe(csv.parse({ headers: true }))
//     .on('error', error => console.error(error))
//     .on('data', row => console.log(row))
//     .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));



  // Put id and url fields instead photos object
  db.reviews_photos_test.aggregate(
    [
      {
        $addFields:
          {"photo":
            {
              id: "$id",
              url: "$url"
            }
          }
      },

      {
        $out: "reviews_photos_test_transformed"
      }
    ]
  );

  // Remove unnecessary fields
  db.reviews_photos_test_transformed.updateMany(
    {},
    {
      "$unset": {"id": 1, "url": 1}
    }

  );

  // convert photos object to array of review id
  // Set review_id as _id

  db.reviews_photos_test_transformed.aggregate(
    [
      {
        $group:
          {
            _id: "$review_id",
            photos: {
              $push: "$photo"
            }
          }
      },

      {
        $out: "reviews_photos_test_transformed"
      }
    ]
  );



// Does not work with MongoDB 3.6, but should work with MongoDB 6.0
  // db.reviews_photos_test_transformed.aggregate(
  //   [
  //     {
  //       $group:
  //         {
  //           _id: "$review_id",
  //           photos: {
  //             $push: {
  //               photo: {
  //                 $each: [],
  //                 $sort: {id: 1}
  //               }
  //             }
  //           }
  //         }
  //     },

  //     {
  //       $out: "reviews_photos_test_transformed"
  //     }
  //   ]
  // );

  db.reviews_photos_test_transformed.find({_id: 5});