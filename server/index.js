const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const port = 3000

// middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// respond with "hello world" when a GET request is made to the homepage
app.get('/reviews', (req, res) => {
  // console.log(req.params);
  // res.send('hello world');
  // res.send(req.params);
  let queryParams = req.query;
  res.send(req.query);

})

app.listen(port, () => {
  console.log(`Atelier Reviews API listening on port ${port}`)
})