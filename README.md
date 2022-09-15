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

- [ ] Import CSV data into MongoDB from command line.
  ```
  mongoimport --collection="characteristics" --type=csv --headerline --file=characteristics.csv
  ```

  ```
  mongoimport --collection="characteristic_reviews" --type=csv --headerline --file=characteristic_reviews.csv
  ```

  ```
  mongoimport --collection="reviews" --type=csv --headerline --file=reviews.csv
  ```

  ```
  mongoimport --collection="reviews_photos" --type=csv --headerline --file=reviews_photos.csv
  ```

  ```
  mongoimport --collection="reviews_photos_test" --type=csv --headerline --file=reviews_photos_test.csv
  ```

- [ ] Transform data via aggregation pipelines:

  ```
    db.reviews_photos_test.aggregate([{$addFields: {"photos": {id: "$id", "url": "$url"} } }])
  ```

  This will automatically store data in database `test`.

