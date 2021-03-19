const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db/index.js');
let app = express();

//middleware

//routes

let port = 1129;

app.listen(port, function() {
  console.log(`listening on port ${port}`);
});