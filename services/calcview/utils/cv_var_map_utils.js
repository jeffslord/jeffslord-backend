//! UTILS
// Get Variable Map root element
// This contains an array of all mappings of input parameters?
function GetVarMapRoot(cvJson, cb) {
    const varMapRoot =
        cvJson["Calculation:scenario"].variableMappings[0].mapping;
    if (varMapRoot === undefined) {
        return cb(null, []);
        // return cb(Error('No variable mappings'));
    }
    return cb(null, varMapRoot);
}

function GetVarMaps(cvJson, cb) {
    const varMaps = [];
    GetVarMapRoot(cvJson, (err, varMapRoot) => {
        if (err) {
            return cb(err);
        }
        varMapRoot.forEach(ele => {
            varMaps.push(ele);
        });
    });
    return cb(null, varMaps);
}

// I think this formats the var maps in a nicer way
function GetVarMapLocalTarget(cvJson, cb) {
    const localTarget = [];
    GetVarMaps(cvJson, (err, varMaps) => {
        if (err) {
            return cb(err);
        }
        varMaps.forEach(ele => {
            const data = {
                local: ele.localVariable[0],
                target: ele.targetVariable[0].$.name
            };
            localTarget.push(data);
        });
    });
    return cb(null, localTarget);
}


module.exports = {
    GetVarMaps,
    GetVarMapLocalTarget
};