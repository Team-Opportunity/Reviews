const csv = require('csv-parser');
const db = require('../db/index.js');
const fs = require('fs');

// //find largest productIDs
// const getLastId = async () => {
//   var res = [];
//   let docs = await db.RecMeta.find().sort({product_id: 'desc'}).limit(100);
//   for (var i = 0; i < docs.length; i++) {
//     res.push(docs[i].product_id);
//   }
//   return res;
// }
// (async () => {
//   const finished = await getLastId();
//   console.log('ids: ', finished);
// })();

// //find largest reviewIDs
// const getLastRevId = async () => {
//   var res = [];
//   let docs = await db.Review.find().sort({review_id: 'desc'}).limit(10);
//   for (var i = 0; i < docs.length; i++) {
//     res.push(docs[i].review_id);
//   }
//   return res;
// }
// (async () => {
//   const finished = await getLastRevId();
//   console.log('ids: ', finished);
// })();

//get characteristics for particular id
let ids = [];
fs.createReadStream('../dataFiles/characteristics.csv')
  .pipe(csv())
  .on('data', (data) => {
    if (data.product_id.trim() === '999945'){
      ids.push(data.id)
    }
  })
  .on('end', () => {
    console.log(ids);
  });

// //check date formats
// let dates = [];
// fs.createReadStream('../dataFiles/reviews.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     let date = data.date.trim();
//     if (Number.parseInt(date.substring(0, 4)) === NaN ||
//       Number.parseInt(date.substring(5, 7)) === NaN ||
//       Number.parseInt(date.substring(8, 10)) === NaN ||
//       date.length > 10) {
//         dates.push(date);
//       }
//   })
//   .on('end', () => {
//     console.log(dates);
//   });


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