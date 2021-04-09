const nodeUtils = require("./utils/cv_node_utils");
const joinUtils = require("./utils/cv_join_utils");
const parseUtils = require("./utils/cv_parse_utils");
const headerUtils = require('./utils/cv_header_utils');
const util = require("util");
const fs = require('fs');
const xml2js = require("xml2js");

//! Fixes
const FixSplitNodesProm = util.promisify(nodeUtils.FixSplitNodes);
const FixRightJoinsProm = util.promisify(joinUtils.FixRightJoins);

const ParseFileProm = util.promisify(parseUtils.ParseFile);
const GetCvheaderInfoProm = util.promisify(headerUtils.GetCvheaderInfo);


async function FixSingleFile(filePath, cb) {
    try {
        const json = await ParseFileProm(filePath);
        const header = await GetCvheaderInfoProm(json);
        const split = await FixSplitNodesProm(json, header.version);
        const right = await FixRightJoinsProm(json);
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(json);
        fs.unlinkSync(filePath);
        return cb(null, xml);
    } catch (err) {
        fs.unlinkSync(filePath);
        return (err);
    }
}

const FixSingleFileProm = util.promisify(FixSingleFile);

async function FixManyFiles(files, cb) {
    try {
        const allRes = [];
        for (let index = 0; index < files.length; index++) {
            const file = files[index];
            const resXml = await FixSingleFileProm(file.path);
            allRes.push(resXml);
            if (index + 1 === files.length) {
                return cb(null, allRes);
            }
        }
    } catch (err) {
        return (err);
    }
}

module.exports = {
    FixSingleFile,
    FixManyFiles
}