const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');
var count = 0;
var photo;

fs.createReadStream('../dataFiles/reviews_photos.csv')
  .pipe(csv())
  .on('data', (data) => {
    count++;
    newPhoto = (parsePhoto(data));
    if (!newPhoto) {
      return; //createPhoto returned null bc of bad url
    }
    db.Review.find({review_id: newPhoto.review_id})
    .then((reviews) => {
      //only care to do anything with photos that actually reference reviews that exist
      //if a photo's review_id does not exist, do not import it
      if (reviews.length) {
        if (reviews.length === 1) {
          //if a photo with that id already exists, replace the id
          reviews[0].photos.foreach((photo) => {
            if (photo.id = newPhoto.id) {
              newPhoto.id = mongoose.Types.ObjectId().toString();
            }
          });
          //update the review records to have the new photo in it's photo's array
          if (count % 500000 === 0) {
            reviews[0].updateOne({photos: reviews[0].photos.push(newPhoto)})
            .then(() => {
              console.log('500000 done');
            })
            .catch((err) => {
              console.log('error: ', err);
              console.log('record: ', newPhoto);
            });
          }
          else {
            reviews[0].updateOne({photos: reviews[0].photos.push(newPhoto)})
            .catch((err) => {
              console.log('error: ', err);
              console.log('record: ', newPhoto);
            });
          }
        }
        else if (review.length > 1) {
          //don't attach the photo to any of the duplicate id reviews. Instead make a note of the duplicate review id for later clean up

        }
      }
    })
  })
  .on('end', () => {
    console.log('ended');
  });


const parsePhoto = (data) => {

};