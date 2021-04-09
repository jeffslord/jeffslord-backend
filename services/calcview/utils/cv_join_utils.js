const nodeUtils = require("./cv_node_utils");

//! UTILS
function GetRightJoinCvs(cvJson, cb) {
    nodeUtils.GetNodes(cvJson, (err, cvs) => {
        const rightOuters = [];
        cvs.forEach(ele => {
            if (ele.$.joinType === "rightOuter") {
                rightOuters.push(ele);
            }
        });
        return cb(null, rightOuters);
        // return cb(null, { rightOuters, found: rightOuters.length > 0 });
    });
}

//! CHECKS
function CheckRightJoins(cvJson, cb) {
    GetRightJoinCvs(cvJson, (err, data) => {
        if (err) {
            return cb(err);
        }
        return cb(null, { data, found: data.length > 0 });
    });
}

//! FIXES
function FixRightJoins(jsonResult, cb) {
    CheckRightJoins(jsonResult, (err, rightRes) => {
        rightRes.data.forEach(ele => {
            ele.$.joinType = "leftOuter";
            [ele.input[0], ele.input[1]] = [ele.input[1], ele.input[0]];
        });
        return cb(null, rightRes.rightOuters);
    });
}
module.exports = {
    CheckRightJoins,
    FixRightJoins
};