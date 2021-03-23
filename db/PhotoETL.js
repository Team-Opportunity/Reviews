const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');
var count = 0;
var photosByReview = {};
var updatePromises = [];
var review_id;

const processFile = async () => {
  const parser = fs.createReadStream('../dataFiles/reviews_photos.csv').pipe(csv());
  for await (const photo of parser) {
    count++;
    review_id = photo.review_id;
    if (!photosByReview[review_id]) {
      photosByReview[review_id] = [await parsePhoto(photo)];
    } else {
      photosByReview[review_id].push(await parsePhoto(photo));
    }
    if (count % 100000 === 0 || count === 2742832) {
      for (var k in photosByReview) {
        updatePromises.push(db.Review.update({review_id: k}, {photos: photosByReview[k]}));
      }
      await Promise.all(updatePromises);
      console.log('saved');
      photosByReview = {};
      updatePromises = [];
    }
  }
  return true;
}

(async () => {
  const finished = await processFile();
  console.log('finished: ', finished);
})()



// fs.createReadStream('../dataFiles/reviews_photos.csv')
//   .pipe(csv())
//   .on('data', (data) => {
//     count++;
//     let newPhoto = (parsePhoto(data));
//     //only save photos with valid urls
//     if (newPhoto) {
//       let photo = new db.Photo(newPhoto);
//       photo.save()
//         .then(() => {
//           if (count % 500000 === 0) {
//             console.log('500000 saved');
//           } else if (count === 2742832) {
//             console.log('last record');
//           }
//         })
//         .catch((err) => {
//           console.log('error saving: ', err);
//           console.log('erroring record: ', photo);
//         })
//     }
//   })
//   .on('end', () => {
//     console.log('ended');
//   });


const parsePhoto = async (data) => {
  delete data.id;
  delete data.review_id;
  data.url = data.url.trim();
  //basic URL validation
  var urlSections = data.url.split('/');
  if (urlSections.length < 3) {
    return null;
  }
  if (urlSections[0] !== 'https:' && urlSections[0] !== 'http:') {
    return null;
  }
  if (urlSections[1] !== '') {
    return null;
  }
  var hostSections = urlSections[2].split('.');
  if (hostSections.length < 2) {
    return null;
  }
  for (i = 0; i < hostSections.length; i++) {
    if (! alphabet[hostSections[i].charAt(0)]) {
      return null;
    }
  }
  var photo = new db.Photo(data);
  return photo.save();
};

const alphabet = {
  'a': 1,
  'b': 1,
  'c': 1,
  'd': 1,
  'e': 1,
  'f': 1,
  'g': 1,
  'h': 1,
  'i': 1,
  'j': 1,
  'k': 1,
  'l': 1,
  'm': 1,
  'n': 1,
  'o': 1,
  'p': 1,
  'q': 1,
  'r': 1,
  's': 1,
  't': 1,
  'u': 1,
  'v': 1,
  'w': 1,
  'x': 1,
  'y': 1,
  'z': 1,
  1: 1,
  2: 1,
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 1,
  8: 1,
  9: 1,
  0: 1
};