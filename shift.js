const mongoose = require("mongoose");

//Shift object attributes
const shiftSchema = new mongoose.Schema({
  company: String,
  first: String,
  last: String,
  role: String,
  timeFrom: String,
  timeTo: String,
  startPeriod: String,
  endPeriod: String,
  day: Number,
  month: Number,
  year: Number
});

const Shift = mongoose.model('Shift', shiftSchema);

module.exports = Shift;
