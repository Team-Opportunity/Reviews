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
  let nextId = await db.ReviewId.findOneAndUpdate({nextId: {$gte: 0}}, {$inc: {nextId: 1}}, {new: false, lean: true});
  let newReview = {
    review_id: nextId.nextId,
    product_id: review.product_id,
    rating: review.rating,
    summary: review.summary,
    recommend: review.recommend,
    response: '',
    body: review.body,
    date: new Date(),
    reviewer_name: '',
    helpfulness: 0,
    reported: false,
    photos: review.photos
  };
  let newReviewDoc = new db.Review(newReview);
  let modelChanges = [newReviewDoc.save()];
  let ratingUpdate = {};
  ratingUpdate[review.rating] = 1;
  let recommendUpdate = {};
  recommendUpdate[review.recommend] = 1;
  //determine whether product has been reviewed before, so we know if updates are needed or whole new documents
  let alreadyReviewed = await db.Review.findOne({product_id: review.product_id});
  if (alreadyReviewed) {
    //updates only
    //ratings
    modelChanges.push(db.RatingsMeta.findOneAndUpdate({product_Id: review.product_id}, {$inc: ratingUpdate}));
    //recommend
    modelChanges.push(db.RecMeta.findOneAndUpdate({product_Id: review.product_id}, {$inc: ratingUpdate}));
  } else {
    //ratings
    for (var i = 1; i <= 5; i++) {
      if (!ratingUpdate[i]) {
        ratingUpdate[i] = 0;
      }
    }
    let newRating = new db.RatingsMeta(ratingUpdates);
    modelChanges.push(newRating.save());
    //recommend
    for (i = 0; i <= 1; i++) {
      if (!recommendUpdate[i]) {
        recommendUpdate[i] = 0
      }
    }
    let newRec = new db.RecMeta(recommendUpdates);
    modelChanges.push(newRec.save());
  }
  //characteristic ids all already exist when a product is created, and we are not dealing with product generation in this project
  //if we were, we would need to generate those upon product creation and create docs for all the characteristic schemas, and one for the idToChar schema
  //all this to say, whether or not a product has been reviewed before, it's characteristic documents will already exist
  for (var k in review.characteristics) {
    let doc = await db.IdToChar.findOne({id: k});
    if (doc.name === 'fit') {
      modelChanges.push(db.Fit.findOneAndUpdate({id: k}, {$inc: {totalScore: review.characteristics[k], numReview: 1}}));
    } else if (doc.name === 'length') {
      modelChanges.push(db.Length.findOneAndUpdate({id: k}, {$inc: {totalScore: review.characteristics[k], numReview: 1}}));
    } else if (doc.name === 'comfort') {
      modelChanges.push(db.Comfort.findOneAndUpdate({id: k}, {$inc: {totalScore: review.characteristics[k], numReview: 1}}));
    } else if (doc.name === 'quality') {
      modelChanges.push(db.Quality.findOneAndUpdate({id: k}, {$inc: {totalScore: review.characteristics[k], numReview: 1}}));
    } else if (doc.name === 'size') {
      modelChanges.push(db.Size.findOneAndUpdate({id: k}, {$inc: {totalScore: review.characteristics[k], numReview: 1}}));
    } else {
      modelChanges.push(db.Width.findOneAndUpdate({id: k}, {$inc: {totalScore: review.characteristics[k], numReview: 1}}));
    }
  }
  await Promise.all(modelChanges);
  return;
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
