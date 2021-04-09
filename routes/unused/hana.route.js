// const express = require('express');
// const path = require('path');
// // const formidable = require('formidable');
// const multer = require('multer');
// const fs = require('fs');
// const hana = require('@sap/hana-client');
// const cv = require('../modules/cv_check_fix');

// const router = express.Router();

// router.get('/test', (req, res, next) => {
//   const client = hana.createConnection();
//   client.connect(
//     `serverNode=${process.env.DB_URL}:${process.env.DB_PORT};uid=${process.env.DB_UID};pwd=${process.env.DB_PASS}`,
//   );
//   client.setAutoCommit(false);
//   const stmt = client.prepare('select * from dummy');
//   //   let result = stmt.exec([600, 'Eastern Sales', 902]);
//   //   result += stmt.exec([700, 'Western Sales', 902]);
//   const result = stmt.exec();
//   stmt.drop();
//   //   console.log(`Number of rows added: ${result}`);
//   console.log('Query Result:', result);
//   client.commit();
//   client.disconnect();
//   res.send(result);
// });

// router.get('/schemas', (req, res, next) => {
//   const client = hana.createConnection();
//   client.connect(
//     `serverNode=${process.env.DB_URL}:${process.env.DB_PORT};uid=${process.env.DB_UID};pwd=${process.env.DB_PASS}`,
//   );
//   client.setAutoCommit(false);
//   const stmt = client.prepare('select schema_name from sys.schemas order by schema_name');
//   //   let result = stmt.exec([600, 'Eastern Sales', 902]);
//   //   result += stmt.exec([700, 'Western Sales', 902]);
//   const result = stmt.exec();
//   stmt.drop();
//   //   console.log(`Number of rows added: ${result}`);
//   console.log('Query Result:', result);
//   const arrResult = [];
//   result.forEach((ele) => {
//     arrResult.push(ele.SCHEMA_NAME);
//   });
//   client.commit();
//   client.disconnect();
//   res.send(arrResult);
// });
// router.get('/schemasClassic', (req, res, next) => {
//   const client = hana.createConnection();
//   client.connect(
//     `serverNode=${process.env.DB_URL}:${process.env.DB_PORT};uid=${process.env.DB_UID};pwd=${process.env.DB_PASS}`,
//   );
//   client.setAutoCommit(false);
//   const stmt = client.prepare(
//     `select schema_name from sys.schemas where 
//     schema_name not like '%_DT' and 
//     schema_name not like '%_DO' and 
//     schema_name not like '%_OO' and 
//     schema_name not like '%_RT' and 
//     schema_name not like '%_DI' and 
//     schema_name not LIKE_REGEXPR '[0-9][0-9][0-9][0-9][0-9]' 
//     and schema_name not LIKE_REGEXPR '_[0-9]' 
//     order by schema_name;`,
//   );
//   //   let result = stmt.exec([600, 'Eastern Sales', 902]);
//   //   result += stmt.exec([700, 'Western Sales', 902]);
//   const result = stmt.exec();
//   stmt.drop();
//   //   console.log(`Number of rows added: ${result}`);
//   console.log('Query Result:', result);
//   // const arrResult = [];
//   // result.forEach((ele) => {
//   //   arrResult.push(ele.SCHEMA_NAME);
//   // });
//   client.commit();
//   client.disconnect();
//   res.send(result);
// });

// router.get('/tables', (req, res, next) => {
//   const client = hana.createConnection();
//   client.connect(
//     `serverNode=${process.env.DB_URL}:${process.env.DB_PORT};uid=${process.env.DB_UID};pwd=${process.env.DB_PASS}`,
//   );
//   client.setAutoCommit(false);
//   const stmt = client.prepare(
//     'select table_name from sys.tables where schema_name=? order by table_name',
//   );
//   //   let result = stmt.exec([600, 'Eastern Sales', 902]);
//   //   result += stmt.exec([700, 'Western Sales', 902]);
//   const result = stmt.exec([req.body.schema]);
//   stmt.drop();
//   //   console.log(`Number of rows added: ${result}`);
//   console.log('Schema', req.body.schema);
//   console.log('Query Result:', result);
//   const arrResult = [];
//   result.forEach((ele) => {
//     arrResult.push(ele.TABLE_NAME);
//   });
//   console.log('Flattened:', arrResult);
//   client.commit();
//   client.disconnect();
//   res.send(arrResult);
// });
// router.get('/calcviews', (req, res, next) => {
//   const client = hana.createConnection();
//   client.connect(
//     `serverNode=${process.env.DB_URL}:${process.env.DB_PORT};uid=${process.env.DB_UID};pwd=${process.env.DB_PASS}`,
//   );
//   client.setAutoCommit(false);
//   const stmt = client.prepare(
//     // 'select schema_name, view_name from sys.views where is_column_view=\'TRUE\' and schema_name=?',
//     "select schema_name, view_name from sys.views where is_column_view='TRUE'",
//   );
//   //   let result = stmt.exec([600, 'Eastern Sales', 902]);
//   //   result += stmt.exec([700, 'Western Sales', 902]);
//   // const result = stmt.exec([req.body.schema]);
//   const result = stmt.exec();
//   stmt.drop();
//   //   console.log(`Number of rows added: ${result}`);
//   // console.log('Schema', req.body.schema);
//   console.log('Query Result:', result);
//   // const arrResult = [];
//   // arrResult = result;
//   // result.forEach((ele) => {
//   //   arrResult.push(ele.TABLE_NAME);
//   // });
//   // console.log('Flattened:', arrResult);
//   client.commit();
//   client.disconnect();
//   res.send(result);
// });

// router.get('/data', (req, res, next) => {
//   const client = hana.createConnection();
//   client.connect(
//     `serverNode=${process.env.DB_URL}:${process.env.DB_PORT};uid=${process.env.DB_UID};pwd=${process.env.DB_PASS}`,
//   );
//   client.setAutoCommit(false);

//   //! It seems that ACTIVE_OBJECTS may not store entries for objects created by HDI in XSA.
//   //! Need to figure out another way to get this data.

//   const stmt = client.prepare('select cdata from _SYS_REPO.ACTIVE_OBJECT where OBJECT_NAME=?');
//   //   let result = stmt.exec([600, 'Eastern Sales', 902]);
//   //   result += stmt.exec([700, 'Western Sales', 902]);
//   const result = stmt.exec([req.body.objectName]);
//   stmt.drop();
//   //   console.log(`Number of rows added: ${result}`);
//   console.log('Query Result:', result);
//   const arrResult = [];
//   result.forEach((ele) => {
//     arrResult.push(ele.CDATA);
//   });
//   console.log('Flattened:', arrResult);
//   client.commit();
//   client.disconnect();
//   res.send(arrResult);
// });

// module.exports = router;
