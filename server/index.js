require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import models
const Review = require('./models/Review.js');
const ReviewMeta = require('./models/ReviewMeta.js');
// import express from 'express';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';

// Serve app
const app = express();
const port = process.env.PORT | 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get all reviews for a given product_id
app.get('/reviews', (req, res) => {

  // get query params and set defaults
  const queryParams = req.query;
  queryParams.count = queryParams.count !== undefined ? queryParams.count : 5;
  queryParams.page = queryParams.page !== undefined ? queryParams.page : 1;
  const { count, page } = queryParams;

  Review.getReviews(queryParams)
    .then((response) => {
      const results = response.slice((page-1)*count, page*count);
      res.json(results);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})

// Get reviews metadata for a given product_id
app.get('/reviews/meta', (req, res) => {
  ReviewMeta.getReviewMeta(req.query)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})

// mark a review as helpful
app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;
  Review.markHelpful(review_id)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})

// report a review
app.put('/reviews/:review_id/report', (req, res) => {
  const review_id = req.params.review_id;
  Review.report(review_id)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})

// add a new review
app.post('/reviews', (req, res) => {
  Review.addNewReview(req.body)
    .then((response) => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})

app.listen(port, () => {
  console.log(`Atelier Reviews API listening on port ${port}`)
})