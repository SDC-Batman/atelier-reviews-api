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
  // Reviews.find({ _id: req.query.product_id })
  Reviews.getReviews(req.query)
    .then((response) => {
      res.json(response);
    })
    .catch((error) => {
      res.sendStatus(400);
    });
})

app.listen(port, () => {
  console.log(`Atelier Reviews API listening on port ${port}`)
})