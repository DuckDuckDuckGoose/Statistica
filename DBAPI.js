const {Sequelize} = require(`sequelize`);
const path = require(`path`);
const fs = require(`fs`);
const emitter = require(`events`)

class DBEmitter extends emitter {}
class DBManager {
  constructor() {
    this.models = {};
    this.emitter = new DBEmitter();
    this.sequelize = new Sequelize({
      dialect: `sqlite`,
      storage: path.join(process.mainModule.path, `database.db`),
      logging: false,
      benchmark: true,
      retry: {
        max: 3
      },
      transactionType: `DEFERRED`,
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
    })
    let seqAuth = this.sequelize.authenticate();
    seqAuth.then(() => {
      console.log(`Connection success`);
    }, (err) => {
      throw err;
    });

    let fsRead = new Promise((resolve, reject) => {
      fs.readdir(path.join(process.mainModule.path, `DBcomponents`), (err, data) => {
        if(err) {
          reject(err);
        }
        if(data) {
          let modelData;
          data.forEach((fileName, i) => {
            if(fileName.endsWith(`.js`)) {
              modelData = require(`./` + path.join(`DBComponents`, fileName));
              this.models[modelData.modelName] = this.sequelize.define(...Object.values(modelData));
            }
          });
        }
        resolve();
      })
    })
    fsRead.then(() => {
      console.log(`Component import success`);
    }, (err) => {
      throw err;
    });
    Promise.all([seqAuth, fsRead]).then(() => {
      this.sequelize.sync({force: true}).then(() => {
        console.log(`Setup done`);
        this.emitter.emit(`load`);
      })
    })
  }
  addPlayerTank(params) {
    this.models.playerTank.create({account_id: 1, tank_id: 2});
  }
}

module.exports = DBManager;
