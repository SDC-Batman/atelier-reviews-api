# Transform reviews_characteristics collection
echo "Transform reviews_characteristics collection"
mongosh reviews ./db/transform/transform_characteristic_reviews.js

# Transform reviews_photos collection
echo "Transform reviews_photos collection"
mongosh reviews --file ./db/transform/transform_reviews_photos.js

# Transform reviews collection
echo "Transform reviews collection"
mongosh reviews ./db/transform/transform_reviews.js

# Build reviews_meta collection
echo "Transform reviews_meta collection"
mongosh reviews ./db/transform/create_reviews_meta.js
