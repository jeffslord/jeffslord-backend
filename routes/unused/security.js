// const express = require('express');

// const router = express.Router();
// const MongoClient = require('mongodb').MongoClient;
// const config = require('../config/db.config');

// /* GET home page. */

// router.get('/', (req, res) => {});
// router.get('/cameras', (req, res) => {
//   MongoClient.connect(
//     `mongodb://${config.db.host}:${config.db.port}/home-server`,
//     (err, client) => {
//       if (err) throw err;
//       const db = client.db('home-server');
//       db.collection('cameras')
//         .find()
//         .toArray((err2, result) => {
//           if (err2) throw err2;
//           console.log(result);
//           res.send(result);
//         });
//     },
//   );
// });

// module.exports = router;
