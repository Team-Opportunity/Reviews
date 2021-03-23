const db = require('../db/index.js');

const ratingsAndRec = async () => {
  var ratings = {};
  var newRating;
  var rec = {};
  var newRec;
  var products = await db.Review.find().distinct('product_id');
  for (var i = 0; i < products.length; i++) {
    for (var j = 1; j <= 5; j++) {
      ratings[j] = await db.Review.countDocuments({product_id: products[i], rating: j});
    }
    rec[0] = await db.Review.countDocuments({product_id: products[i], recommend: false});
    rec[1] = await db.Review.countDocuments({product_id: products[i], recommend: true});
    ratings.product_id = products[i];
    rec.product_id = products[i];
    newRating = new db.RatingsMeta(ratings);
    newRec = new db.RecMeta(rec);
    await Promise.all([newRating.save(), newRec.save()]);
    if (i % 1000 === 0) {
      console.log('1000 saved');
    }
    ratings = {};
    rec = {};
  }
  return true;
};

(async () => {
  const finished = await ratingsAndRec();
  console.log('finished: ', finished);
})();