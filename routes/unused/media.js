const express = require('express');

const router = express.Router();

// const host = "http://173.49.201.100";
const data = {
  host: 'http://173.49.201.100',
  sonarr: 8989,
  radarr: 7878,
  jackett: 9117,
  deluge: 8112,
  plexpy: 8181,
};

router.get('/', (req, res) => {
  // res.write("Please select valid media destination");
  const dests = Object.keys(data);
  dests.shift();
  res.send(dests);
});

router.get('/:destination', (req, res) => {
  console.log(req.params);
  const key = req.params.destination;
  if (!data.hasOwnProperty(key)) {
    res.send('Invalid destination');
    res.end();
  }
  console.log(data[req.params.destination]);
  res.redirect(`${data.host}:${data[req.params.destination]}`);
});

// router.get("/sonarr", function(req, res, next) {
//   //   res.send("http://173.49.201.100:8989/");
//   res.redirect(data.host + ":" + data.sonarr);
// });
// router.get("/radarr", function(req, res, next) {
//   res.redirect(data.host + ":" + data.radarr);
// });
// router.get("/jackett", function(req, res, next) {
//   res.redirect(data.host + ":" + data.jackett);
// });
// router.get("/deluge", function(req, res, next) {
//   res.redirect(data.host + ":" + data.deluge);
// });
// router.get("/plexpy", function(req, res, next) {
//   res.redirect(data.host + ":" + data.plexpy);
// });

module.exports = router;
