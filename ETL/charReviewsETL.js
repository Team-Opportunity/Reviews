const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var count = 0;
var countByRevId = {};
var findUpdatePromises = [];

const processFile = async () => {
  const parser = fs.createReadStream('../dataFiles/characteristic_reviews.csv').pipe(csv());
  for await (const review of parser) {
    count++;
    let id = Number.parseInt(review.characteristic_id.trim());
    let value = Number.parseInt(review.value.trim());
    if (!countByRevId[id]) {
      countByRevId[id] = {numReviews: 1, totalScore: value};
    } else {
      countByRevId[id].numReviews++;
      countByRevId[id].totalScore += value;
    }
    if (count % 100000 === 0 || count === 19337415) {
      for (var k in countByRevId) {
        findUpdatePromises.push(determineChar(k, countByRevId[k]));
      }
      await Promise.all(findUpdatePromises);
      console.log('saved');
      findUpdatePromises = [];
      countByRevId = {};
    }
  }
  return true;
}

(async () => {
  const finished = await processFile();
  console.log('finished: ', finished);
})()

const determineChar = async (k, data) => {
  //use IdToChar to determine type of model to find and update on
  //return find and update promise incrmenting the values in th Char schema
  let doc = await db.IdToChar.findOne({id: k});
  let type = doc.name;
  if (type === 'fit') {
    return db.Fit.findOneAndUpdate({id: k}, {$inc: data});
  } else if (type === 'length') {
    return db.Length.findOneAndUpdate({id: k}, {$inc: data});
  } else if (type === 'comfort') {
    return db.Comfort.findOneAndUpdate({id: k}, {$inc: data});
  } else if (type === 'quality') {
    return db.Quality.findOneAndUpdate({id: k}, {$inc: data});
  } else if (type === 'size') {
    return db.Size.findOneAndUpdate({id: k}, {$inc: data});
  } else if (type === 'width') {
    return db.Width.findOneAndUpdate({id: k}, {$inc: data});
  } else {
    throw 'invalid type!';
  }
};