const db = require('../db/index.js');

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

//Characteristics
db.Fit.countDocuments({numReviews: {$gt: 0}})
.then((results) => {
  console.log('fit: ', results)
  return db.Length.countDocuments({numReviews: {$gt: 0}});
})
.then((res) => {
  console.log('length: ', res);
  return db.Comfort.countDocuments({numReviews: {$gt: 0}});
})
.then((res) => {
  console.log('comfort: ', res);
  return db.Quality.countDocuments({numReviews: {$gt: 0}});
})
.then((res) => {
  console.log('quality: ', res);
  return db.Size.countDocuments({numReviews: {$gt: 0}});
})
.then((res) => {
  console.log('size: ', res);
  return db.Width.countDocuments({numReviews: {$gt: 0}});
})
.then((res) => {
  console.log('width: ', res);
})

// //IdToChar
// db.IdToChar.countDocuments({id: {$gte: 0}})
// .then((res) => {
//   console.log('reult: ', res);
// });