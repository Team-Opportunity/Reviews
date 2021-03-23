const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var count = 0;

fs.createReadStream('../dataFiles/characteristic_reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    count++;
  })
  .on('end', () => {
    console.log('end: ', count);
  });
