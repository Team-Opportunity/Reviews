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


