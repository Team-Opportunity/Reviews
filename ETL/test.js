const csv = require('csv-parser');
const db = require('../db/index.js');
const fs = require('fs');

//check date formats
let dates = [];
fs.createReadStream('../dataFiles/reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    let date = data.date.trim();
    if (Number.parseInt(date.substring(0, 4)) === NaN ||
      Number.parseInt(date.substring(5, 7)) === NaN ||
      Number.parseInt(date.substring(8, 10)) === NaN ||
      date.length > 10) {
        dates.push(date);
      }
  })
  .on('end', () => {
    console.log(dates);
  });


// //Characteristics
// db.Fit.countDocuments({numReviews: 0})
// .then((results) => {
//   console.log('fit: ', results)
//   return db.Length.countDocuments({numReviews: 0});
// })
// .then((res) => {
//   console.log('length: ', res);
//   return db.Comfort.countDocuments({numReviews: 0});
// })
// .then((res) => {
//   console.log('comfort: ', res);
//   return db.Quality.countDocuments({numReviews: 0});
// })
// .then((res) => {
//   console.log('quality: ', res);
//   return db.Size.countDocuments({numReviews: 0});
// })
// .then((res) => {
//   console.log('size: ', res);
//   return db.Width.countDocuments({numReviews: 0});
// })
// .then((res) => {
//   console.log('width: ', res);
// })

// db.Fit.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0})
// .then((results) => {
//   console.log('fit: ', results)
//   return db.Length.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0});
// })
// .then((res) => {
//   console.log('length: ', res);
//   return db.Comfort.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0});
// })
// .then((res) => {
//   console.log('comfort: ', res);
//   return db.Quality.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0});
// })
// .then((res) => {
//   console.log('quality1: ', res);
//   return db.Quality.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0});
// })
// .then((res) => {
//   console.log('quality2: ', res);
//   return db.Size.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0});
// })
// .then((res) => {
//   console.log('size: ', res);
//   return db.Width.findOneAndUpdate({numReviews: {$gt: 0}}, {numReviews: 0, totalScore: 0});
// })
// .then((res) => {
//   console.log('width: ', res);
// })