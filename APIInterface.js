let axios = require(`axios`);
let qs = require(`qs`);
let {token} = require(`./config.json`);

function accountIdTester(startID, rawQuantity) {
  return new Promise(async (resolve, reject) => {
    let quantity = Math.min(rawQuantity, 100);
    let ids = [];
    for(let i = 0;i < quantity;i++) {
      ids.push(i + startID);
    }
    let data = await axios({
      method: `get`,
      url: `https://api.worldoftanks.eu/wot/account/tanks/`,
      data: {
        application_id: token,
        account_id: ids
      },
      paramsSerializer: function(params) {
        return qs.stringify(params, {arrayFormat: `comma`});
      }
    })
    if(data.data.status == `error`) {
      reject(data.data.error)
    } else {
      resolve(data.data)
    }
  })
}

module.exports = {accountIdTester: accountIdTester}
