const express = require('express');

const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  // res.send("respond with a resource");
  res.json([
    {
      id: 0,
      username: 'user1',
    },
    {
      id: 1,
      username: 'user2',
    },
  ]);
});

router.post('/', (req, res) => {
  res.send(req.body.username);
});

module.exports = router;
