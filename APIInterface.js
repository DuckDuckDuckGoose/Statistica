let axios = require(`axios`);
let qs = require(`qs`);

class APIInterface {
  constructor(params) {
    this.token = params.token || 0;
    this.remainingRequests = params.maxRequests || 0;
    this.requestResetInterval = setInterval(() => {
      this.remainingRequests = params.maxRequests || 0;
    }, 1000)
  }
  accountIdTester(startID, rawQuantity) {
    if(this.remainingRequests > 0) {
      this.remainingRequests --;
      return new Promise(async (resolve, reject) => {
        let quantity = Math.min(rawQuantity, 100);
        let ids = [];
        for(let i = 0;i < quantity;i++) {
          ids.push(i + startID);
        }
        let data = await axios({
          method: `get`,
          url: `https://api.worldoftanks.eu/wot/account/tanks/`,

          transformResponse: [function (rawResponse, headers) {

            let parsedResponse = JSON.parse(rawResponse);

            if(parsedResponse.status == `error`) {
              return parsedResponse.error;
            }

            let data = parsedResponse.data;
            let filteredData = Object.entries(data).filter(([account_id, tanks], index) => {
              return tanks != null && tanks.length > 0;
            })

            return {data: Object.fromEntries(filteredData)};
          }],

          params: {
            application_id: this.token,
            account_id: ids
          },
          paramsSerializer: function(params) {
            return qs.stringify(params, {arrayFormat: `comma`});
          }
        })
        if(data.data.status == `error`) {
          reject(new Error(data.data.error.message));
        } else {
          resolve(data.data.data)
        }
      })
    }
    else {
      return Promise.reject(new Error(`Request limit exceeded`))
    }
  }
}

module.exports = APIInterface;
