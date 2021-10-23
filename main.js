const axios = require(`axios`);
const qs = require(`qs`);
const {apis} = require(`./config.json`);

let requestQueue = {};


function getPlayerVehicles(...args) { //args = [startInt]

  let idArr = [];
  for(let i = 0;i < 100;i ++) {
    idArr.push(i + args[0]);
  }

  let requestData = {
    method: `get`,
    url: `https://api.worldoftanks.eu/wot/account/tanks/`,
    params: {
      account_id: idArr,
      tank_id: 1537
    },
    paramsSerializer: function(params) {
      return qs.stringify(params, {arrayFormat: `comma`});
    }
  }

  let resultHandler = (rawData) => {
    let {data} = rawData;
    if(!data) {
      console.log(rawData);
    }
    let validPlayers = Object.entries(data).filter(([key, value], index) => {
      if(value && value.length > 0) {
        let {statistics} = value[0];
        if(statistics.battles > 100 && (statistics.wins / statistics.battles) > 0.5) {
          return true;
        }
      }
      return false;
    })
    validPlayers.length > 0 ? console.log(validPlayers) : false;
  }

  let resultCatch = (error) => {
    throw error;
  }

  if(!requestQueue[0]) {
    requestQueue[0] = [];
  }
  requestQueue[0].push({requestData, resultHandler, resultCatch});
}

function getPlayerVehicleStats(...args) {

}

function requestHandler(api) {

  let unusedCalls = api.maxRateLimit;
  let sortedIndexes = Object.keys(requestQueue).sort((a, b) => a - b);

  for(let i = 0;i < sortedIndexes.length;i++) {
    let currentQueue = requestQueue[sortedIndexes[i]];
    if(currentQueue.length > 0) {
      let length = currentQueue.length
      for(let j = 0;j < length;j++) {
        let requestInfo = currentQueue.shift();
        executeRequest(requestInfo, api.token);
        unusedCalls --;
        if(unusedCalls <= 0) {
          return false;
        }
      }
    }
  }
}

function executeRequest(requestInfo, application_id) {
  requestInfo.requestData.params.application_id = application_id;
  axios(requestInfo.requestData).then((res) => requestInfo.resultHandler(res.data), (err) => requestInfo.resultCatch(err))
}

setInterval(() => {
  apis.forEach((api, i) => {
    requestHandler(api);
  });
}, 1000)

let i = 544404755;
setInterval(() => {
  getPlayerVehicles(i);
  i += 100;
}, 50)
