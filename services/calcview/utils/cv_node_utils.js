const dataSourceUtils = require("./cv_data_source_utils");
const cvUtils = require("./cv_utils");
const localVarUtils = require("./cv_local_var_utils");
const varMapUtils = require("./cv_var_map_utils");


//! UTILS
// Get the root of Calculation View element.
// This contains an array of all calculation view nodes
function GetNodeRoot(cvJson, cb) {
    const cvRoot =
        cvJson["Calculation:scenario"].calculationViews[0].calculationView;
    if (cvRoot === undefined) {
        return cb(Error("No calculation view"));
    }
    return cb(null, cvRoot);
}
function GetNodeRootPromise(cvJson) {
    return new Promise((resolve, reject) => {
        const cvRoot = cvJson["Calculation:scenario"].calculationViews[0].calculationView;
        if (cvRoot === undefined) {
            reject(new Error("No calculation view"));
        } else {
            resolve(cvRoot);
        }
    })
}

// Get all CalculationView nodes
// Return array
function GetNodes(cvJson, cb) {
    GetNodeRoot(cvJson, (err, root) => {
        if (err) {
            return cb(null);
        }
        let cvs = [];
        for (let i = 0; i < root.length; i += 1) {
            cvs.push(root[i]);
        }
        return cb(null, cvs);
    });
}
function GetNodesPromise(cvJson) {
    return GetNodeRootPromise(cvJson)
        .then(root => {
            if (root.length === 0) {
                throw new Error("Root length is 0.");
            }
            let cvs = [];
            for (let i = 0; i < root.length; i += 1) {
                cvs.push(root[i]);
            }
            return cvs;
        })
}
// Get CalculationView node by name (id)
function GetNodeByName(cvJson, cvName, cb) {
    GetNodeRoot(cvJson, (err, root) => {
        if (err) {
            return cb(err);
        }
        let cvNameParsed = JSON.parse(cvName);
        if (cvNameParsed.charAt(0) === "#") {
            cvNameParsed = cvNameParsed.substr(1);
        }
        for (let i = 0; i < root.length; i += 1) {
            if (root[i].$.id === cvNameParsed) {
                return cb(root[i]);
            }
        }
        return null;
    });
}

function GetNodeByNamePromise(cvJson, cvName) {
    return GetNodeRootPromise(cvJson)
        .then(root => {
            let cvNameParsed = JSON.parse(cvName);
            if (cvNameParsed.charAt(0) === "#") {
                cvNameParsed = cvNameParsed.substr(1);
            }
            for (let i = 0; i < root.length; i += 1) {
                if (root[i].$.id === cvNameParsed) {
                    return cb(root[i]);
                }
            }
            return null;
        })
}

// Get all Calculation View nodes that have specified input node
//! can probably change this to use the GetCvs function. Just remove elements that don't have match.
//! i made the change
////
function GetNodesByInput(cvJson, inputName, cb) {
    let inputNameParsed = JSON.parse(inputName);
    if (inputNameParsed.charAt(0) !== "#") {
        inputNameParsed = `#${inputNameParsed}`;
    }
    const results = [];
    GetNodes(cvJson, (err, cvs) => {
        cvs.forEach(cv => {
            cv.input.forEach(input => {
                if (input.$.node === inputNameParsed && results.indexOf(input) === -1) {
                    results.push(cv);
                }
            });
        });
    });
    return cb(null, results);
}
// Get all filter expressions that occur in all nodes
function GetFilterExpressions(cvJson, cb) {
    const filterExpressions = [];
    GetNodes(cvJson, (err, nodes) => {
        nodes.forEach(node => {
            if (node.filter !== undefined) filterExpressions.push(node.filter[0]);
        });
    });
    return cb(null, filterExpressions);
}

function GetFilterExpressionsPromise(cvJson) {
    return GetNodesPromise(cvJson)
        .then(nodes => {
            const filterExpressions = [];
            nodes.forEach(node => {
                if (node.filter !== undefined) filterExpressions.push(node.filter[0]);
            });
            return filterExpressions;
        })
}

// Go through all Calculation View nodes and count how many times each input node is used
// This will determine whether a split nodes occur
//! check if this is comparing with data sources. data sources can occur multiple times.
function GetInputNodeCounts(cvJson, cb) {
    GetNodes(cvJson, (err, cvs) => {
        if (err) {
            return cb(err);
        }
        const inputNodes = {};
        cvs.forEach(ele1 => {
            ele1.input.forEach(ele2 => {
                const inputNode = JSON.stringify(ele2.$.node);
                if (inputNode in inputNodes) {
                    inputNodes[inputNode] += 1;
                } else {
                    inputNodes[inputNode] = 1;
                }
            });
        });
        return cb(null, inputNodes);
    });
}

function GetInputNodeCountsPromise(cvJson) {
    return GetNodesPromise(cvJson)
        .then(cvs => {
            const inputNodes = {};
            cvs.forEach(ele1 => {
                ele1.input.forEach(ele2 => {
                    const inputNode = JSON.stringify(ele2.$.node);
                    if (inputNode in inputNodes) {
                        inputNodes[inputNode] += 1;
                    } else {
                        inputNodes[inputNode] = 1;
                    }
                });
            });
            return inputNodes;
        })
}

// Return array of input nodes
//! figure out what this does exactly
// Get all Calculation View Inputs based on an input name
// Used to change mappings to newly created nodes.
function GetInputs(cvJson, inputName, cb) {
    let inputNameParsed = inputName;
    if (inputNameParsed.charAt(0) === '"') {
        inputNameParsed = inputNameParsed.slice(1, -1);
    }
    const inputs = [];
    GetNodes(cvJson, (err, cvs) => {
        cvs.forEach(cv => {
            cv.input.forEach(input => {
                if (input.$.node === inputNameParsed) {
                    inputs.push(input);
                }
            });
        });
    });
    // console.log(inputs);
    return cb(null, inputs);
}

function GetInputsPromise(cvJson, inputName) {
    let inputNameParsed = inputName;
    if (inputNameParsed.charAt(0) === '"') {
        inputNameParsed = inputNameParsed.slice(1, -1);
    }
    return GetNodesPromise(cvJson)
        .then(nodes => {
            const inputs = [];
            nodes.forEach(cv => {
                cv.input.forEach(input => {
                    if (input.$.node === inputNameParsed) {
                        inputs.push(input);
                    }
                });
            });
            return inputs;
        })
}

function GetCalculatedColumns(cvJson, cb) {
    let calcColumns = [];
    GetNodes(cvJson, (err, nodes) => {
        nodes.forEach(element => {
            if (element.calculatedViewAttributes[0] !== "") {
                const calcAtts =
                    element.calculatedViewAttributes[0].calculatedViewAttribute;
                calcAtts.forEach(col => {
                    calcColumns.push(col);
                });
            }
        });
    });
    return cb(null, calcColumns);
}

function GetCalculatedColumnsPromise(cvJson) {
    return GetNodesPromise(cvJson)
        .then(nodes => {
            let calcColumns = [];
            nodes.forEach(element => {
                if (element.calculatedViewAttributes[0] !== "") {
                    const calcAtts =
                        element.calculatedViewAttributes[0].calculatedViewAttribute;
                    calcAtts.forEach(col => {
                        calcColumns.push(col);
                    });
                }
            });
            return calcColumns;
        })
}

function GetCalculatedColumnNames(cvJson, cb) {
    let calcColumnNames = [];
    GetCalculatedColumns(cvJson, (err, calcColumns) => {
        if (err) {
            return cb(Error("Error at GetCalculatedColumns"));
        }
        calcColumns.forEach(element => {
            calcColumnNames.push(element.$.id);
        });
    });
    return cb(null, calcColumnNames);
}

function GetCalculatedColumnNamesPromise(cvJson) {
    return GetCalculatedColumnsPromise(cvJson)
        .then(calcColumns => {
            let calcColumnNames = [];
            calcColumns.forEach(element => {
                calcColumnNames.push(element.$.id);
            });
            return calcColumnNames;
        })
}

function GetCalculatedColumnFormulas(cvJson, cb) {
    const formulas = [];
    GetCalculatedColumns(cvJson, (err, calcColumns) => {
        if (err) {
            return cb(err);
        }
        calcColumns.forEach(element => {
            formulas.push(element.formula[0]);
        });
    });
    return cb(null, formulas);
}

function GetCalculatedColumnFormulasPromise(cvJson) {
    return GetCalculatedColumnsPromise(cvJson)
        .then(calcColumns => {
            const formulas = [];
            calcColumns.forEach(element => {
                formulas.push(element.formula[0]);
            });
            return formulas;
        })
}

function GetCalcColumnsInFilter(cvJson, cb) {
    const calcColumnsInFilter = [];
    GetCalculatedColumnNames(cvJson, (err, calcColumns) => {
        if (err) {
            return cb(err);
        }
        GetFilterExpressions(cvJson, (err, filters) => {
            if (err) {
                return cb(err);
            }
            filters.forEach(filter => {
                // console.log(filter);
                calcColumns.forEach(col => {
                    // console.log('Filter:', filter, 'Column:', col);
                    if (filter.includes(col)) {
                        calcColumnsInFilter.push(col);
                    }
                });
            });
        });
    });
    return cb(null, calcColumnsInFilter);
}

function GetCalcColumnsInFilterPromise(cvJson) {
    return Promise.all([GetCalculatedColumnNamesPromise(cvJson), GetFilterExpressionsPromise(cvJson)])
        .then(([calcColumnNames, filtersExpressions]) => {
            const calcColumnsInFilter = [];
            filtersExpressions.forEach(filter => {
                calcColumnNames.forEach(col => {
                    if (filter.includes(col)) {
                        calcColumnsInFilter.push(col);
                    }
                });
            });
            return calcColumnsInFilter;
        })
}

function GetSplitNodes(cvJson, cb) {
    const splitNodes = {};
    dataSourceUtils.GetDataSourceNames(cvJson, (err2, ds) => {
        GetInputNodeCounts(cvJson, (err, inputNodes) => {
            Object.keys(inputNodes).forEach(key => {
                if (inputNodes[key] > 1) {
                    let keyParsed = JSON.parse(key);
                    keyParsed = keyParsed.replace("#", "");
                    if (!ds.includes(keyParsed)) {
                        splitNodes[key] = inputNodes[key];
                    }
                }
            });
        });
    });
    return cb(null, splitNodes);
}

function GetSplitNodesPromise(cvJson) {

}

function CopyNode(jsonResult, cvName, cb) {
    GetNodeByName(jsonResult, cvName, cv => {
        // duplicate cv into another cv and add it to the root
        const cvCopy = JSON.parse(JSON.stringify(cv));
        return cb(cvCopy);
    });
}

function CopyNodePromise(jsonResult, cvName) {

}

function GetUnmappedParameters(cvJson, cb) {
    let unmapped = [];
    localVarUtils.GetLocalVarNames(cvJson, (err, localVarNames) => {
        // console.log('GetLocalVarNames:', localVarNames);
        varMapUtils.GetVarMapLocalTarget(cvJson, (err, varMaps) => {
            // console.log('GetVarMapLocalTarget:', varMaps);
            const exists = [];
            varMaps.forEach(map => {
                exists.push(map.local);
            });
            unmapped = localVarNames.filter(x => !exists.includes(x));
            GetCalculatedColumnFormulas(cvJson, (err, formulas) => {
                GetFilterExpressions(cvJson, (err, filters) => {
                    const toRemove = [];
                    //! optimization here. break out of for loop when found
                    unmapped.forEach(unmap => {
                        // console.log('Searching unmapped:', unmap);
                        for (let i = 0; i < filters.length; i += 1) {
                            if (filters[i].includes(unmap)) {
                                toRemove.push(unmapped.indexOf(unmap));
                                // break;
                            }
                        }
                        for (let i = 0; i < formulas.length; i += 1) {
                            if (formulas[i].includes(unmap)) {
                                toRemove.push(unmapped.indexOf(unmap));
                                // break;
                            }
                        }
                        toRemove.forEach(removal => {
                            unmapped.splice(removal, 1);
                        });
                    });
                });
            });
        });
    });
    return cb(null, unmapped);
}

function GetUnmappedParametersPromise() {

}

//! CHECKS
function CheckSplitNodes(cvJson, cb) {
    GetSplitNodes(cvJson, (err, data) => {
        if (err) {
            return cb(err);
        }
        return cb(null, { data, found: Object.keys(data).length > 0 });
    });
}

function CheckSplitNodesPromise(cvJson) {

}

function CheckCalcColumnsInFilter(cvJson, cb) {
    GetCalcColumnsInFilter(cvJson, (err, data) => {
        if (err) {
            return cb(err);
        }
        return cb(null, { data, found: data.length > 0 });
    });
}
function CheckUnmappedParameters(cvJson, cb) {
    GetUnmappedParameters(cvJson, (err, data) => {
        if (err) {
            return cb(err);
        }
        return cb(null, { data, found: data.length > 0 });
    });
}

//! FIXES
// need to check if split node is a data source
// if it is a data source than it is allowed to be in multiple places
function FixSplitNodes(cvJson, version, cb) {
    // const cvRoot = GetCvRoot(cvJson);
    // TODO: Replace this with GetNodes

    GetNodeRoot(cvJson, (err, cvRoot) => {
        if (err) {
            return cb(new Error(err));
        }
        let complete = false;
        let allSplits = [];
        while (!complete) {
            // Get input nodes that are used by more than 1 node
            CheckSplitNodes(cvJson, (err, splitRes) => {
                if (err) {
                    return cb(err);
                }
                if (Object.keys(splitRes.data).length === 0) {
                    complete = true;
                } else {
                    allSplits.push(splitRes.splitNodes);
                    Object.keys(splitRes.data).forEach(key => {
                        // Get the calc view nodes based on the name of split inputs
                        GetInputs(cvJson, key, (err2, inputNodes) => {
                            for (let i = 0; i < splitRes.data[key] - 1; i++) {
                                // Make a copy for each split (if used in 10 places, create 9 new)
                                CopyNode(cvJson, key, cvCopy => {
                                    const cvCopyNew = cvCopy;
                                    // Change the copies id to new id (_i for iteration)
                                    cvCopyNew.$.id = `${cvCopyNew.$.id}_${i + 1}`;
                                    // Add copy to the structure
                                    cvRoot.push(cvCopyNew);
                                    // Change input node to the newly created calc view node
                                    // CreateInputName(inputNodes[i].$.node, version, (err, newName) => {
                                    //   inputNodes[i].$.node = newName;
                                    // });
                                    if (version <= 2.3) {
                                        inputNodes[i].$.node = `#${cvCopyNew.$.id}`;
                                    } else {
                                        inputNodes[i].$.node = `${cvCopyNew.$.id}`;
                                    }
                                });
                            }
                        });
                    });
                }
            });
        }
        return cb(null, allSplits);
    });
}

function FixSplits(jsonResult, splits, key) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < splits.data[key] - 1; i++) {
            CopyNodePromise(jsonResult, key)
        }
    })
}
function FixSplitNodesPromise(cvJson) {
    let complete = false;
    let allSplits = [];
    return GetNodeRootPromise(cvJson)
        .then(cvRoot => {
            return CheckSplitNodesPromise(cvJson);
        })
        .then(splitRes => {
            Object.keys(splitRes.data).forEach(key => {
                return GetInputsPromise(cvJson, key);

            });
        })
}

//! NOT IMPLEMENTED
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
//! END

module.exports = {
    GetNodes,
    GetNodeByName,
    GetFilterExpressions,
    GetInputNodeCounts,
    GetInputs,
    GetCalculatedColumns,
    GetCalculatedColumnNames,
    GetCalculatedColumnFormulas,
    GetCalcColumnsInFilter,
    GetSplitNodes,
    CheckSplitNodes,
    CheckCalcColumnsInFilter,
    GetUnmappedParameters,
    FixSplitNodes,
    CheckUnmappedParameters,
    CopyNode
};