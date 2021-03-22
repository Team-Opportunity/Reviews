const db = require('./index.js');

// Thing.
//   find({ name: /^hello/ }).
//   cursor().
//   on('data', function(doc) { console.log(doc); }).
//   on('end', function() { console.log('Done!'); });

/**
 * create a read stream from review
 * for each record check if a ratingsMeta document for that product id exists
 *  if yes, update that records corresponding ratings property ++
 *  if not, create a new document and initialize it to have 0 for all ratings except the one corresponding to the current review
 *
 * for each record also check if a RecMeta document for that product exists
 *  if yes, update true/false ++ depending on what the review has
 *  if not, create a new one, and initialize prop values accordingly
 */

db.Review.find().
cursor().
on('data', (reviewDoc) => {
  db.RatingsMeta.find({product_id: reviewDoc.product_id})
  .then((ratingMetaDoc) => {
    if (ratingMetaDoc) {
      return updateRatingMeta(reviewDoc, ratingMetaDoc)
    } else {
      let newRatingMeta = {
        product_id: reviewDoc.product_id,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };
      newRatingMeta[reviewDoc.rating] = 1;
      newRatingMeta = new db.RatingsMeta(review);
      return newRatingMeta.save()
    }
  })
  .then(() => {
    console.log('rating complete');
    return db.RecMeta.find({product_id: reviewDoc.product_id})
  })
  .then((recMetaDoc) => {
    if (recMetaDoc) {
      if (reviewDoc.recommend) {
        let newRecVal = recMetaDoc.1 + 1;
        return recMetaDoc.updateOne({1: newRecVal})
      } else {
        let newRecVal = recMetaDoc.0 + 1;
        return recMetaDoc.updateOne({0: newRecVal})
      }
    } else {
      let newRecMeta = {
        product_id: reviewDoc.product_id,
        0: 0,
        1: 0
      };
      if (reviewDoc.recommend) {
        newRecMeta.1 = 1;
      } else {
        newRecMeta.0 = 1;
      }
      newRecMeta = new db.RecMeta(newRecMeta);
      return newRecMeta.save()
    }
  })
  .then(() => {
    console.log('rec complete');
  })
  .catch((err) => {
    console.log('error: ', err);
    console.log('record: ', reviewDoc);
  })
}).
on('end', () =>{
  console.log('Done!');
});

const updateRatingMeta = (reviewDoc, metaDoc) => {
  if (reviewDoc.rating === 1) {
    let newVal = metaDoc.1 + 1;
    return metaDoc.updateOne({1: newVal});
  } else if (reviewDoc.rating === 2) {
    let newVal = metaDoc.2 + 1;
    return metaDoc.updateOne({2: newVal});
  } else if (reviewDoc.rating === 3) {
    let newVal = metaDoc.3 + 1;
    return metaDoc.updateOne({3: newVal});
  } else if (reviewDoc.rating === 4) {
    let newVal = metaDoc.4 + 1;
    return metaDoc.updateOne({4: newVal});
  } else {
    let newVal = metaDoc.5 + 1;
    return metaDoc.updateOne({5: newVal});
  }
};