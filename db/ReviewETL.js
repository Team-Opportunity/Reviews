const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');
var count = 0;
var review;

fs.createReadStream('../dataFiles/reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    count++;
    review = (createReview(data));
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
  //parse values that aren't meant to be strings
  data.rating = Number.parseInt(data.rating.trim());
  data.recommend = data.recommend.trim() === '1' || data.recommend.toLowerCase().trim() === 'true' || data.recommend.toLowerCase().trim() === 'yes';
  data.date = Date.parse(data.date.trim());
  data.helpfulness = Number.parseInt(data.helpfulness.trim());
  data.reported = data.reported.trim() === '1' || data.reported.toLowerCase().trim() === 'true' || data.reported.toLowerCase().trim() === 'yes';

  //for now assume all rows have a unique id. After all rows are loaded are we're trying to attach data, account for the fact that maybe some review_ids are not unique
  data.review_id = data.id.trim();
  delete data.id;

  let review = new db.Review(data);
  return review;
};
