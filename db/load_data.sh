cd data

# Import characteristics.csv into characteristics collection
mongoimport -d reviews --collection="characteristics" --type=csv --headerline --drop --file=characteristics.csv

# Import characteristics_reviews.csv into characteristics_reviews collection
mongoimport -d reviews --collection="characteristic_reviews" --type=csv --headerline --drop --file=characteristic_reviews.csv

# Import reviews_photos.csv into reviews_photos collection
mongoimport -d reviews --collection="reviews_photos" --type=csv --headerline --drop --file=reviews_photos.csv

# Import reviews.csv into reviews collection
mongoimport -d reviews --collection="reviews" --type=csv --headerline --drop --file=reviews.csv
