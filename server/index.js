const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db/index.js');
const models = require('../db/models');
let app = express();

//middleware
//app.use(express.static(__dirname + '<location of index.htmlfile>'));
app.use(bodyParser.json());

//routes
app.get('/reviews/', async (req, res) => {
  //TODO
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
  //TODO
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
  //TODO
});

let port = 3029;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});