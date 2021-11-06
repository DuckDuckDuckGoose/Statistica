const {token} = require(`./config.json`)
const DBManager = new (require(`./DBAPI.js`))();
const APIInterface = new (require(`./APIInterface.js`))({token: token, maxRequests: 20    });

let i = 544404755;

DBManager.emitter.on(`load`, () => {
  let interval = setInterval(async () => {
    console.log(i);
    APIInterface.accountIdTester(i, 100).then(
      (data) => {
        Object.entries(data).forEach(([account_id, tanks], index) => {
          tanks.forEach((tank, i) => {
            DBManager.addPlayerTank({account_id: parseInt(account_id, 10), tank_id: parseInt(tank.tank_id, 10)})
          });
        });
      },
      (err) => {
        console.log(err);
      }
    )
    i += 100;
    if(i > 544404355) {
      clearInterval(interval);
      setTimeout(async () => {
        let temp = await DBManager.models.playerTank.findAll()
        console.log(temp);
      }, 3000)
    }
  }, 51)
})
