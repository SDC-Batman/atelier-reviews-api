
db.reviews.aggregate(
  [
    {
      $match: {product_id: 2}
    },
    {
      $out: "reviews_product"
    }
  ]
);