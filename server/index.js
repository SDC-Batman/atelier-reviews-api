// const express = require('express');
// const bodyParser = require('body-parser')
// const mongoose = require('mongoose');
import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

// Serve app
const app = express();
const port = 3000

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/reviews');

// Import Models
import { Reviews } from './models/Reviews.js'

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// respond with "hello world" when a GET request is made to the homepage
app.get('/reviews', (req, res) => {
  Reviews.find({_id: req.query.product_id})
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