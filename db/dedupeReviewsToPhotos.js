const csv = require('csv-parser');
const fs = require('fs');
const db = require('./index.js');

// 1 - load all reviews in ETL file
// 2 - create read stream from Photo model
// 3 - for each photo, find if 0 or >1 reviewd return. If either, make a note
// 4 - go in and re-generate review_id for the review and delete the photo document

