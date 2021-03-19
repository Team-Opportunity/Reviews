const db = require('./index.js');

db.<MODELNAME>.countDocuments({recommend: true})
.then((results) => {
  console.log('true records: ', results);
  return db.<MODELNAME>.countDocuments({recommend: false});
})
.then((results) => {
  console.log('false records: ', results);
});