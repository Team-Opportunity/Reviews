const db = require('./index.js');
const mongoose = require('mongoose');

const getReviews = () => {

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
}

module.exports.getMetadata = getMetadata;
