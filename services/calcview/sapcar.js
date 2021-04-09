/*
    *DOCUMENTATION
    This is to provide a graphical tool for extracting SAR files using SAPCAR.exe
*/

const { exec } = require('child_process');
const AdmZip = require('adm-zip');
const fs = require('fs');

function ExtractSAR(filePath, cb) {
  exec(`${__dirname}\\sapcar.exe -xvf ${filePath}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return cb(err, null);
    }
    console.log('stdout', stdout);
    console.log('stderr', stderr);
    return cb(null, stdout);
  });
}

function ZipFolder(filePath, outputPath, cb) {
  const zip = new AdmZip();
  zip.addLocalFolder('SAP_HANA_CLIENT');
  zip.writeZip(`${__dirname}\\zip_test.zip`);
  return cb(null, 'success');
}
console.log('dirname', __dirname);
ExtractSAR(`${__dirname}\\IMDB_CLIENT20_004_139-80002085.SAR`, (err, res) => {
  if (err) {
    console.error(err);
  }
  ZipFolder('SAP_HANA_CLIENT', `${__dirname}\\zip_test.zip`, (err, res) => {
    if (err) {
      console.error(err);
    }
    console.log(res);
    // fs.unlinkSync();
  });
});
