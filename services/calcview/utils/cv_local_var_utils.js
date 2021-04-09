//! UTILS
// Get Local Variable element
// This contains an array of all local variable elements (input parameters)?
function GetLocalVarRoot(cvJson, cb) {
    // console.log('TEST')
    const localVarRoot =
        cvJson["Calculation:scenario"].localVariables[0].variable;
    // console.log('INFO', localVarRoot);
    if (localVarRoot === undefined) {
        return cb(null, []);
        // return cb(Error('No local variables'));
    }
    return cb(null, localVarRoot);
}

function GetLocalVars(cvJson, cb) {
    const localVars = [];
    GetLocalVarRoot(cvJson, (err, localVarRoot) => {
        if (err) {
            return cb(err);
        }
        if (localVarRoot.length === 0) {
            return cb(null, localVars);
        }
        localVarRoot.forEach(ele => {
            localVars.push(ele);
        });
    });
    return cb(null, localVars);
}
function GetLocalVarNames(cvJson, cb) {
    const localVarNames = [];
    GetLocalVars(cvJson, (err, localVars) => {
        if (err) {
            return cb(err);
        }
        localVars.forEach(ele => {
            localVarNames.push(ele.$.id);
        });
    });
    return cb(null, localVarNames);
}

module.exports = {
    GetLocalVars,
    GetLocalVarNames
};