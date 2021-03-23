const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var count = 0;
var savePromises = [];
var charsByProduct = {};

const processFile = async () => {
  const parser = fs.createReadStream('../dataFiles/characteristics.csv').pipe(csv());
  for await (const characteristic of parser) {
    count++;
    //redo to grab just widths
    let p = parseCharateristic(characteristic);
    if (p) {
      savePromises.push(p);
    }
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
  data.product_id = Number.parseInt(data.product_id.trim());
  data.totalScore = 0;
  data.numReviews = 0;
  data.name = data.name.toLowerCase().trim();
  var doc;
  //redo to get only widths
  if (data.name === 'width') {
    delete data.name;
    doc = new db.Width(data);
    return doc.save();
  }
  return null;
  // if (data.name === 'fit') {
  //   delete data.name;
  //   doc = new db.Fit(data);
  // } else if (data.name === 'length') {
  //   delete data.name;
  //   doc = new db.Length(data);
  // } else if (data.name === 'comfort') {
  //   delete data.name;
  //   doc = new db.Comfort(data);
  // } else if (data.name === 'quality') {
  //   delete data.name;
  //   doc = new db.Quality(data);
  // } else if (data.name === 'size') {
  //   delete data.name;
  //   doc = new db.Size(data);
  // } else if (data.name === 'width') {
  //   delete data.name;
  //   doc = new db.Width(data);
  // }else {
  //   throw `Unknown characteristic: ${data.name}`;
  // }
  //return doc.save();
}