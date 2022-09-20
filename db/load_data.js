// import reviews_photos.csv
mongoimport -d reviews --collection="reviews_photos" --type=csv --headerline --drop --file=reviews_photos.csv

// import characteristic_reviews.csv
mongoimport -d reviews --collection="characteristic_reviews" --type=csv --headerline --drop --file=characteristic_reviews.csv

// import characteristics.csv
mongoimport -d reviews --collection="characteristics" --type=csv --headerline --drop --file=characteristics.csv

// import reviews_test.csv
mongoimport -d reviews --collection="reviews" --type=csv --headerline --drop --file=reviews.csv

