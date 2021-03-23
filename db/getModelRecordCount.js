const db = require('./index.js');

// //Reviews
// db.Review.countDocuments({recommend: true})
// .then((results) => {
//   console.log('review true records: ', results);
//   return db.Review.countDocuments({recommend: false});
// })
// .then((results) => {
//   console.log('review false records: ', results);
// });

// //Photos
// db.Photo.countDocuments({url: /^http/})
// .then((results) => {
//   console.log('photo records: ', results);
// })

// //Ratings
// db.RatingsMeta.countDocuments({product_id: {$gte: 0}})
// .then((results) => {
//   console.log('ratings records: ', results);
// })

// //Rec
// db.RecMeta.countDocuments({product_id: {$gte: 0}})
// .then((results) => {
//   console.log('rec records: ', results)
// })
