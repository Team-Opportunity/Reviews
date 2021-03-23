const db = require('../db/index.js');

db.Fit.deleteMany({product_id: {$gte: 0}})
.then((results) => {
  console.log('fit: ', results)
  return db.Length.deleteMany({product_id: {$gte: 0}});
})
.then((res) => {
  console.log('length: ', res);
  return db.Comfort.deleteMany({product_id: {$gte: 0}});
})
.then((res) => {
  console.log('comfort: ', res);
  return db.Quality.deleteMany({product_id: {$gte: 0}});
})
.then((res) => {
  console.log('quality: ', res);
  return db.Size.deleteMany({product_id: {$gte: 0}});
})
.then((res) => {
  console.log('size: ', res);
  return db.Width.deleteMany({product_id: {$gte: 0}});
})
.then((res) => {
  console.log('width: ', res);
})