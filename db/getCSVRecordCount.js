const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');
var count = 0;

fs.createReadStream('../dataFiles/reviews_photos.csv')
  .pipe(csv())
  .on('data', (data) => {
    count++;
  })
  .on('end', () => {
    console.log('ended: ', count);
  });