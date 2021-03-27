const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db/index.js');
const models = require('../db/models');
let app = express();

//middleware
//app.use(express.static(__dirname + '<location of index.htmlfile>'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());

//routes
app.get('/reviews', async (req, res) => {
  let result = await models.getReviews(req.body.product_id, req.body.sort, req.body.page, req.body.count);
  res.status(200).send({
    product: req.body.product_id,
    page: req.body.page,
    count: req.body.count,
    results: result
  });
});

app.get('/reviews/meta', async (req, res) => {
  let result = await models.getMetadata(req.body.product_id);
  if (result) {
    res.status(200).send(result);
  } else {
    res.sendStatus(400);
  }
});

app.post('/reviews', async (req, res) => {
  if (!req.body.photos) {
    req.body.photos = [];
  }
  await models.addReview(req.body);
  res.sendStatus(201);
});

app.put('/reviews/:review_id/helpful', async (req, res) => {
  let result = await models.markHelpful(req.params.review_id);
  if (result) {
    res.sendStatus(204);
  } else {
    res.sendStatus(400);
  }
});

app.put('/reviews/:review_id/report', async (req, res) => {
  let result = await models.report(req.params.review_id);
  if (result) {
    res.sendStatus(204);
  } else {
    res.sendStatus(400);
  }
});

let port = 3029;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});