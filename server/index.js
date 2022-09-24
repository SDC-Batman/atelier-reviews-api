/* eslint-disable import/extensions */
/* eslint-disable no-bitwise */
/* eslint-disable camelcase */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Import models
const Review = require('./models/Review.js');
const ReviewMeta = require('./models/ReviewMeta.js');

// Serve app
const app = express();
const port = process.env.PORT | 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// Allow CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Get all reviews for a given product_id
app.get('/reviews', (req, res) => {
  // get query params and set defaults
  const queryParams = req.query;
  queryParams.count = queryParams.count !== undefined ? queryParams.count : 5;
  queryParams.page = queryParams.page !== undefined ? queryParams.page : 1;
  const { count, page } = queryParams;

  Review.getReviews(queryParams)
    .then((response) => {
      const results = {
        product: String(queryParams.product_id),
        page: queryParams.page,
        count: queryParams.count,
        results: response.slice((page - 1) * count, page * count),
      };
      res.json(results);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// Get reviews metadata for a given product_id
app.get('/reviews/meta', (req, res) => {
  ReviewMeta.getReviewMeta(req.query)
    .then((response) => {
      const results = { product_id: String(req.query.product_id), ...response[0]._doc };
      res.json(results);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// mark a review as helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  const { review_id } = req.params;
  Review.markHelpful(review_id)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// report a review
app.put('/reviews/:review_id/report', (req, res) => {
  const { review_id } = req.params;
  Review.report(review_id)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// add a new review
app.post('/reviews', (req, res) => {
  Review.addNewReview(req.body)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
});

// add loader.io for stress testing
app.get(`/${process.env.LOADER_TOKEN}.txt`, (req, res) => {
  res.send(process.env.LOADER_TOKEN);
});

app.listen(port, () => {
  console.log(`Atelier Reviews API listening on port ${port}`);
});
