import { Schema as _Schema, model } from 'mongoose';

const Schema = _Schema;

const CamSchema = new Schema({
  url: { type: String, required: true, max: 100 },
  description: String,
  user: { type: String, required: true },
  pass: { type: String, required: true },
});

export default model('Cam', CamSchema);
