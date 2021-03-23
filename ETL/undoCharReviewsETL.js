const db = require('../db/index.js');

db.Width.deleteMany({id: {$gte: 0}})
  .then((res) => {
     console.log(res);
   })