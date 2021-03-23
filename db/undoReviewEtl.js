const csv = require('csv-parser');
const db = require('./index.js');

// db.Review.deleteMany({recommend: true})
//   .then((results) => {
//     return db.Review.deleteMany({recommend: false});
//   })
//   .then((results) => {
//     return db.Review.countDocuments({recommend: true});
//   })
//   .then((results) => {
//     console.log('remaining true records: ', results);
//     return db.Review.countDocuments({recommend: false});
//   })
//   .then((results) => {
//     console.log('remaining false records: ', results);
//   })

// db.Review.find({review_id: 5})
// .then((result) => {
//   console.log(result[0].toObject());
// })

// db.Review.updateMany({recommend: true}, {photos: []})
//   .then((results) => {
//     return db.Review.updateMany({recommend: false}, {photos: []});
//   })
//   .then((results) => {
//     return db.Review.countDocuments({recommend: true});
//   })
//   .then((results) => {
//     return db.Review.find({review_id: 5});
//   })
//   .then((results) => {
//     console.log(results);
//   })
