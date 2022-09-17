# Atlier Reviews API

### Create Database

- [ ] Initialize npm to create `package.json`.
  ```
    npm init
  ```

- [ ] Install mongoose DBMS.
  ```
    npm install mongoose --save
  ```

- [ ] Connect to Mongo DB.


- [ ] Download data and add to `/data` folder.


- [ ] Import test CSV data into MongoDB from command line.

  ```
  mongoimport -d reviews --collection="reviews_test" --type=json --jsonArray --file=reviews_test_handmade.json
  ```

  ```
  mongoimport -d reviews --collection="reviews_photos_test" --type=csv --headerline --file=reviews_photos_test.csv
  ```

  ```
  mongoimport -d reviews --collection="characteristic_reviews_test" --type=csv --headerline --columnsHaveTypes --fieldFile=reviews_field_file_with_types.txt --file=characteristic_reviews_test.csv
  ```

  ```
  mongoimport -d reviews --collection="characteristics_test" --type=csv --headerline --file=characteristics_test.csv
  ```

  ```
  mongoimport -d reviews --collection="reviews_test" --type=csv --headerline --file=reviews_test.csv
  ```


- [ ] Import production CSV data into MongoDB from command line.

  ```
  mongoimport -d reviews --collection="characteristics" --type=csv --headerline --file=characteristics.csv
  ```

  ```
  mongoimport -d reviews --collection="characteristic_reviews" --type=csv --headerline --file=characteristic_reviews.csv
  ```

  ```
  mongoimport -d reviews --collection="reviews" --type=csv --headerline --file=reviews.csv
  ```

  ```
  mongoimport -d reviews --collection="reviews_photos" --type=csv --headerline --file=reviews_photos.csv
  ```


- [ ] Transform data via aggregation pipelines:

  ```
    db.reviews_photos_test.aggregate([{$addFields: {"photos": {id: "$id", "url": "$url"} } }])
  ```

  This will automatically store data in database `test`.

