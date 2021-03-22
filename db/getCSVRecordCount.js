const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');
var count = 0;

fs.createReadStream('../dataFiles/reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    count++;
  })
  .on('end', () => {
    console.log('end: ', count);
  });
