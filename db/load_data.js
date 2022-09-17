// import reviews_photos.csv
mongoimport -d reviews --collection="reviews_photos_test" --type=csv --headerline --drop --file=reviews_photos_test.csv

// import characteristic_reviews.csv
mongoimport -d reviews --collection="characteristic_reviews_test" --type=csv --headerline --columnsHaveTypes --fieldFile=reviews_field_file_with_types.txt --drop --file=characteristic_reviews_test.csv

// import characteristics.csv
mongoimport -d reviews --collection="characteristics_test" --type=csv --headerline --drop --file=characteristics_test.csv

// import reviews_test.csv
mongoimport -d reviews --collection="reviews_test" --type=csv --headerline --drop --file=reviews_test.csv

