const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Import models
const Reviews = require('./models/Reviews.js');
// import express from 'express';
// import bodyParser from 'body-parser';
// import mongoose from 'mongoose';

// Serve app
const app = express();
const port = 3000;

// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get all reviews for a given product_id
app.get('/reviews', (req, res) => {
  Reviews.getReviews(req.query)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})


// Get all reviews for a given product_id
app.put('/reviews/:review_id/helpful', (req, res) => {
  const review_id = req.params.review_id;
  Reviews.markHelpful(review_id)
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