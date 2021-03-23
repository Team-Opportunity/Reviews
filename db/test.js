const csv = require('csv-parser');
const db = require('./index.js');

db.Review.find().distinct('product_id')
.then((results) => {
  console.log(results.length);
  console.log(results[0]);
})

