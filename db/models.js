const db = require('./index.js');
const mongoose = require('mongoose');

const getReviews = async (product_id, sort, page = 1, count = 5) => {
  //for now, do a simple mongo sort. Can come back alter and make more performant
  let docs;
  if (sort === 'newest') {
    docs = await db.Review.find({product_id: product_id, reported: false}).sort({date: 'desc'}).limit(page * count);
  } else if (sort === 'helpful') {
    docs = await db.Review.find({product_id: product_id, reported: false}).sort({helpfulness: 'desc'}).limit(page * count);
  } else {
    docs = await db.Review.find({product_id: product_id, reported: false}).limit(page * count);
  }
  if (page > 1) {
    docs = docs.slice(count * (page - 1));
  }
  let result = docs.map((doc) => {
    return doc.toObject();
  });
  result.forEach((res) => {
    delete res._id;
    delete res.__v;
    delete res.product_id;
    res.date = res.date.toString();
  });
  return result;
};

const getMetadata = async (product_id) => {
  let res = {
    product_id: product_id,
    ratings: {},
    recommended: {},
    characteristics: {}
  };
  let docs = await Promise.all([
    db.RatingsMeta.findOne({product_id: product_id}, '1 2 3 4 5'),
    db.RecMeta.findOne({product_id: product_id}, '0 1'),
    db.Fit.findOne({product_id: product_id}),
    db.Length.findOne({product_id: product_id}),
    db.Comfort.findOne({product_id: product_id}),
    db.Quality.findOne({product_id: product_id}),
    db.Size.findOne({product_id: product_id}),
    db.Width.findOne({product_id: product_id}),
  ]);
  let obj;
  let value;
  for (var i = 0; i < docs.length; i++) {
    if (docs[i]) {
      obj = docs[i].toObject();
      delete obj._id;
      //ratings
      if (i === 0) {
        res.ratings = obj;
      } else if (i === 1) {
        //recommended
        res.recommended = obj;
      } else {
        //characteristics
        value = (obj.totalScore / obj.numReviews).toFixed(4);
        if (i === 2) {
          res.characteristics.Fit = {id: obj.id, value: value};
        } else if (i === 3) {
          res.characteristics.Length = {id: obj.id, value: value};
        } else if (i === 4) {
          res.characteristics.Comfort = {id: obj.id, value: value};
        } else if (i === 5) {
          res.characteristics.Quality = {id: obj.id, value: value};
        } else if (i === 6) {
          res.characteristics.Size = {id: obj.id, value: value};
        } else {
          res.characteristics.Width = {id: obj.id, value: value};
        }
      }
    } else {
      //if no ratings or reviews return null bc the product_id does not exist
      if (i <= 1) {
        return null;
      }
    }
  }
  return res;
};

//review param is an object with field corresponding to the info in the post request
const addReview = async (review) => {
  //get next review id and increment document
  //create new review with review_id, product_id
  //other fieldsss equal to the input or empty string (except recomend)
  //set fields respone, reviewer_name to empty string
  //set date = new date now
  //set helpfulness to 0
  //set reported to false
  //set photos to input or empty array if there is no input
  //update ratings with the given rating
    //create a new doc if product hasn't been rated before
  //update recommend with the given data
    //create a new doc if product hasn't been rated before
  //for each characteristic
    //use idtoCHar schema to get which characteristic is being rated
    //update that characteristic schema/product with the given data
    //create a new doc if not found
};

const markHelpful = async (review_id) => {
  let res = await db.Review.findOneAndUpdate({review_id: review_id}, {$inc: {helpfulness: 1}}, {new: true});
  return res;
}

const report = async (review_id) => {
  let res = await db.Review.findOneAndUpdate({review_id: review_id}, {reported: true}, {new: true});
  return res;
};

module.exports.getReviews = getReviews;
module.exports.getMetadata = getMetadata;
module.exports.addReview = addReview;
module.exports.markHelpful = markHelpful;
module.exports.report = report;
