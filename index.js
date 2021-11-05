const DBManager = require(`./DBAPI.js`);
const APIInterface = require(`./APIInterface.js`);
let dbManager = new DBManager();
let i = 544404755;
(async () => {
  APIInterface.accountIdTester(i, 100).then(
  (data) => {
    console.log(data);
  },
  (err) => {
    console.log(err);
  });
})()
