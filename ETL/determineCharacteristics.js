const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var chars = {};

fs.createReadStream('../dataFiles/characteristics.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (!chars[data.name.toLowerCase().trim()]) {
      chars[data.name.toLowerCase().trim()] = 1;
    }
  })
  .on('end', () => {
    console.log('chars: ', Object.keys(chars));
  });