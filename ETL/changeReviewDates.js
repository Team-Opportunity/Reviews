const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var count = 0;
var updatePromises = [];

const processFile = async () => {
  const parser = fs.createReadStream('../dataFiles/reviews.csv').pipe(csv());
  for await (const review of parser) {
    count++;
    let review_id = Number.parseInt(review.id.trim());
    let dateStr = review.date.trim();
    let date = parseDate(dateStr);
    updatePromises.push(db.Review.findOneAndUpdate({review_id: review_id}, {date: date}))
    if (count % 100000 === 0 || count === 2742832) {
      await Promise.all(updatePromises);
      console.log('saved');
      updatePromises = [];
    }
  }
  return true;
}

(async () => {
  const finished = await processFile();
  console.log('finished: ', finished);
})()

const parseDate = (datestr) => {
  let month = Number.parseInt(datestr.substring(5, 7));
  let day = datestr.substring(8, 10);
  let year = datestr.substring(0, 4);
  if (month === 1) {
    month = 'January';
  } else if (month === 2) {
    month = 'February';
  } else if (month === 3) {
    month = 'March';
  } else if (month === 4) {
    month = 'April';
  } else if (month === 5) {
    month = 'May';
  } else if (month === 6) {
    month = 'June';
  } else if (month === 7) {
    month = 'July';
  } else if (month === 8) {
    month = 'August';
  } else if (month === 9) {
    month = 'September';
  } else if (month === 10) {
    month = 'October';
  } else if (month === 11) {
    month = 'November';
  } else if (month === 12) {
    month = 'December';
  } else {
    throw `invalid month ${month}`;
  }
  let res = `${month} ${day}, ${year}`;
  return new Date(res);
}