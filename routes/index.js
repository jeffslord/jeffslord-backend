const express = require('express');
// const router = express.Router();
var gamesRoute = require('./games.route');
var calcviewRoute = require('./calcview.route');

// /* GET home page. */
// router.get('/', (req, res) => {
//   res.render('index', { title: 'Jeff API' });
// });



module.exports = function (app) {
  app.use("/api/calcview", calcviewRoute);
  app.use("/api/games", gamesRoute);
}
