const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var largestId = -Infinity;

fs.createReadStream('../dataFiles/reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    let id = Number.parseInt(data.id.trim());
    if (id > largestId) {
      largestId = id;
    }
  })
  .on('end', () => {
    let nextId = new db.ReviewId({nextId: largestId + 1});
    nextId.save()
    .then((result) => {
      console.log('nextId: ', result);
    })
  })