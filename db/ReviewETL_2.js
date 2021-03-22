const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');
var review;
var findPhotoPromises;
var reviewSavePromises;
var photoArrays;
var count = 0;

const processFile = async () => {
  var reviews = [];
  const parser = fs.createReadStream('../dataFiles/reviews.csv').pipe(csv());
  for await (const data of parser) {
    count++;
    review = createReview(data);
    reviews.push(review);
    findPhotoPromises = [];
    reviewSavePromises = [];
    photoArrays = [];
    if (reviews.length >= 50000 || count === 5777922) {
      findPhotoPromises = reviews.map((review) => {
        return db.Photo.find({review_id: review.review_id});
      });
      console.log('before find');
      photoArrays = await Promise.all(findPhotoPromises)
      console.log('finihed find');
      for (var i = 0; i < photoArrays.length; i++) {
        reviews[i].photos = photoArrays[i];
        reviewSavePromises.push(reviews[i].save());
      }
      conosle.log('before save');
      await Promise.all(reviewSavePromises);
      console.log('saved');
      reviews = [];
    }
  }
  return true;
}

(async () => {
  const finished = await processFile();
  console.log('complete: ', finished);
})()

const createReview = (data) => {
  //parse values that aren't meant to be strings
  data.rating = Number.parseInt(data.rating.trim());
  data.recommend = data.recommend.trim() === '1' || data.recommend.toLowerCase().trim() === 'true' || data.recommend.toLowerCase().trim() === 'yes';
  data.date = Date.parse(data.date.trim());
  data.helpfulness = Number.parseInt(data.helpfulness.trim());
  data.reported = data.reported.trim() === '1' || data.reported.toLowerCase().trim() === 'true' || data.reported.toLowerCase().trim() === 'yes';

  //for now assume all rows have a unique id. After all rows are loaded and we're trying to attach data, account for the fact that maybe some review_ids are not unique
  data.review_id = data.id.trim();
  delete data.id;
  review = new db.Review(data);
  return review;
};
