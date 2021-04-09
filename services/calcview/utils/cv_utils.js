//! NOTES
// Get Roots seem to be the same as getting their respective element arrays

const fs = require("fs");
const xml2js = require("xml2js");
function WriteFile(fileName, text) {
  fs.writeFileSync(fileName, text);
}

// There doesn't seem to be a single join formula.
// Need to figure out how to get it
function GetJoinFormulas(jsonResult, cb) {
  const joinFormulas = [];
  return cb(null, joinFormulas);
}
// Once I get the join formulas, this is mostly just a string check against a list of values
function GetCalculatedColumnsInJoin(jsonResult, cb) {
  const calcColumns = [];

  return cb(null, calcColumns);
}

module.exports = {
  WriteFile,
};
