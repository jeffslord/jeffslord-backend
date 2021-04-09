const fs = require("fs");
const xml2js = require("xml2js");
const path = require("path");
const parser = new xml2js.Parser();

//! UTILS
function ParseFile(filePath, cb) {
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return cb(err);
        }
        parser.parseString(data, (err2, parsedString) => {
            if (err2) {
                return cb(new Error(err2));
            }
            cb(null, parsedString);
        });
    });
}
function ParseXML(xml, cb) {
    parser.parseString(xml, (err, parsedString) => {
        if (err) {
            return cb(err);
        }
        cb(null, parsedString);
    });
}

module.exports = {
    ParseFile,
    ParseXML
}