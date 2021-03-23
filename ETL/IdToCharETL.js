const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var count = 0;
var savePromises = [];

const processFile = async () => {
  const parser = fs.createReadStream('../dataFiles/characteristics.csv').pipe(csv());
  for await (const characteristic of parser) {
    count++;
    savePromises.push(parseCharateristic(characteristic));
    if (count % 100000 === 0 || count === 3347478) {
      await Promise.all(savePromises);
      console.log('saved');
      savePromises = [];
    }
  }
  return true;
}

(async () => {
  const finished = await processFile();
  console.log('finished: ', finished);
})()

const parseCharateristic = (data) => {
  data.id = Number.parseInt(data.id.trim());
  data.name = data.name.toLowerCase().trim();
  delete data.product_id;
  var doc = new db.IdToChar(data);;
  return doc.save();
}