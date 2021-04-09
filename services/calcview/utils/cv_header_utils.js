//! UTILS
function GetCvheaderInfo(cvJson, cb) {
    const version = cvJson["Calculation:scenario"].$.schemaVersion;
    const { id } = cvJson["Calculation:scenario"].$;
    const info = { version, id };
    if (version === undefined) {
        return cb(Error("No version"));
    }
    if (id === undefined) {
        return cb(Error("No id"));
    }
    return cb(null, info);
}

module.exports = {
    GetCvheaderInfo
}