//! UTILS
function GetHintRoot(cvJson, cb) {
    const hintRoot = cvJson["Calculation:scenario"].executionHints;
    if (hintRoot === undefined) {
        return cb(null, []);
    }
    return cb(null, hintRoot);
}
function GetHints(cvJson, cb) {
    const hints = [];
    GetHintRoot(cvJson, (err, hintRoot) => {
        if (hintRoot === []) {
            return cb(null, hints);
        } else {
            hintRoot.forEach(hint => {
                hints.push(`HINT: ${hint.$.name} VALUE: ${hint.$.value}`)
            });
            console.log(hintRoot);
        }
    })
    return cb(null, hints);
}

//! CHECKS
function CheckHints(cvJson, cb) {
    GetHints(cvJson, (err, data) => {
        if (err) {
            return cb(err);
        }
        return cb(null, { data, found: data.length > 0 });
    })
}

module.exports = {
    GetHints,
    CheckHints
};