const csv = require('csv-parser');
const fs = require('fs');
const db = require('../db/index.js');
var count = 0;
var review;

fs.createReadStream('../dataFiles/reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    count++;
    review = createReview(data);
    if (count % 500000 === 0) {
      review.save()
      .then(() => {
        console.log('500000 saved');
      })
      .catch((err) => {
        console.log('error saving: ', err);
        console.log('erroring record: ', review);
      })
    } else {
      review.save()
      .catch((err) => {
        console.log('error saving: ', err);
        console.log('erroring record: ', review);
      })
    }
  })
  .on('end', () => {
    console.log('ended');
  });

const createReview = (data) => {
  for (var k in data) {
    data[k] = data[k].trim();
  }

  data.review_id = Number.parseInt(data.id);
  data.product_id = Number.parseInt(data.product_id);
  data.rating = Number.parseInt(data.rating);
  data.recommend = data.recommend === '1' || data.recommend.toLowerCase() === 'true' || data.recommend.toLowerCase() === 'yes';
  data.date = Date.parse(data.date);
  data.helpfulness = Number.parseInt(data.helpfulness.trim());
  data.reported = data.reported.trim() === '1' || data.reported.toLowerCase().trim() === 'true' || data.reported.toLowerCase().trim() === 'yes';
  delete data.id;
  review = new db.Review(data);
  return review;
};