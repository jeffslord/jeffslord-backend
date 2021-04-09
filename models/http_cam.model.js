const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const HTTPCamSchema = new Schema({
  url: { type: String, required: true, max: 100 },
  user: { type: String, required: true },
  pass: { type: String, required: true },
});

module.exports = mongoose.model('HTTPCam', HTTPCamSchema);
