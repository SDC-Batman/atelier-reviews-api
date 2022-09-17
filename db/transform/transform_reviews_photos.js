  // Put id and url fields instead photos object
  db.reviews_photos.aggregate(
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
        $out: "reviews_photos_transformed"
      }
    ]
  );

  // Remove unnecessary fields
  db.reviews_photos_transformed.aggregate(
    [
      {
        $project: {
          _id: 1,
          review_id: 1,
          photo: 1
        }
      },

      {
        $out: "reviews_photos_transformed"
      }
    ]
  );


  // convert photos object to array of review id
  // Set review_id as _id
  db.reviews_photos_transformed.aggregate(
    [
      {
        $group:
          {
            _id: "$review_id",
            photos: {
              $push: "$photo",
            }
          }
      },

      {
        $out: "reviews_photos_transformed"
      }
    ]
  );


  // db.reviews_photos_transformed.find({_id: 5});