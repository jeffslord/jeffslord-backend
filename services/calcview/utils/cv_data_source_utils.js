//! UTILS
// Get Data Sources root element.
// This contains the origin of all data sources. Tables, other views, etc.
function GetDataSourceRoot(cvJson, cb) {
    const dataSourcesRoot =
        cvJson["Calculation:scenario"].dataSources[0].DataSource;
    if (dataSourcesRoot === undefined) {
        return cb(Error("No data sources"));
    }
    return cb(null, dataSourcesRoot);
}

function GetDataSources(cvJson, cb) {
    const dataSources = [];
    GetDataSourceRoot(cvJson, (err, root) => {
        root.forEach(ds => {
            dataSources.push(ds);
        });
    });
    return cb(null, dataSources);
}

function GetDataSourceNames(cvJson, cb) {
    const dataSourceNames = [];
    GetDataSources(cvJson, (err, dataSources) => {
        dataSources.forEach(ds => {
            dataSourceNames.push(ds.$.id);
        });
    });
    return cb(null, dataSourceNames);
}

module.exports = {
    GetDataSources,
    GetDataSourceNames
};