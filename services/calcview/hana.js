// const config = require('dotenv').config();

const hana = require('@sap/hana-client');

const client = hana.createConnection();
const pwd = process.env.DB_PASS;
const uid = process.env.DB_UID;

function disconnect() {
  client.disconnect((err) => {
    if (err) {
      console.error(err);
    }
  });
}

client.connect(
  `serverNode=ec2-3-228-254-229.compute-1.amazonaws.com:30015;uid=${uid};pwd=${pwd}`,
  (err) => {
    if (err) {
      console.error(err);
    }
    console.log('Connected');
    client.exec(
      "select SCHEMA_NAME from sys.schemas where schema_name like '%CROSS_CONTAINER%'",
      (err, rows) => {
        if (err) {
          console.error(err);
          disconnect();
        }
        console.log('rows', rows);
        disconnect();
      },
    );
  },
);
