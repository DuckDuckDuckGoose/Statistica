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
      retry: {
        max: 3
      },
      transactionType: `IMMEDIATE`,
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
  addTankStat(params) {
    return new Promise(async (resolve, reject) => {
      await this.models.create(params);
      resolve();
    })
  }
}
module.exports = DBManager;
