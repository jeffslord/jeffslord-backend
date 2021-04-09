const express = require('express');

const router = express.Router();
const camController = require('../controllers/cam.controller');

router.get('/test', (req, res, next) => {
  res.send(camController.test());
});
router.get('/', (req, res, next) => {
  res.send(camController.getAll());
});
router.get('/:id', (req, res, next) => {
  res.send(camController.get());
});

module.exports = router;
