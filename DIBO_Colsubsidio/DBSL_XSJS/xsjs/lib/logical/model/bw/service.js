"use strict";

const SapCfAxios = require('sap-cf-axios').default;

module.exports = {
    toInfo: function (mService, callback) {
        let sInfo = "";

        let oRequest, oResponse;
        let sURL;

        const axios = SapCfAxios("sapbhphana");
        if (mService.METHOD === "GET") {

            sURL = "/ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
            var method = "GET";
            var headers = {
                "content-type": "application/json",
                "accept": "application/json"
            };

            let oResponse = axios({
                method: method,
                url: sURL,
                headers: headers
            }).then((oResponse) => {
                //console.log(response.data);
                if (oResponse.status === 200) {
                    let aObjects = JSON.parse(oResponse.data.asString()).d;
                    sInfo = aObjects;

                }
                else {
                    let message = "HTTP Error: " + oResponse.headers[2].value + " " + oResponse.headers[3].value;

                    if (oResponse.data) {
                        message = message + " - " + oResponse.data.asString();
                    }
                    throw { message: message };

                }
                callback(null, sInfo)
            })
        }
       // callback(null, sInfo)
    },
    sendRequest: function (mService, callback) {

        let mData = [];
        let oResponse;
        let sURL;

        if (mService.METHOD === "GET") {
           // console.log("In GET of sendRequest");
            const axios = SapCfAxios("sapbhphana");
            
            //console.log("Result of Axios" + axios);
            sURL = "/ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
            var method = "GET";
            var headers = {
                "content-type": "application/json",
                "accept": "application/json"
            };
            let oResponse = axios({
                method: method,
                url: sURL,
                headers: headers
            }).then((oResponse) => {
                if (oResponse.status === 200) {
                    //   console.log(oResponse);
                    //  console.log("oResponse.data");
                    //     console.log(oResponse.data);
                    // console.log("oResponse.data.d.results");
                    //     console.log(oResponse.data.d.results);

                    //  let aObjects = JSON.parse(oResponse.body.asString()).d.results;
                    let aObjects = oResponse.data.d.results;
                    //console.log(aObjects);
                    aObjects.forEach(function (mObject) {
                       // console.log(mObject);
                        mData.push(mObject);
                    });

                } else {
                    let message = "HTTP Error: " + oResponse.headers[2].value + " " + oResponse.headers[3].value;

                    if (oResponse.data) {
                        message = message + " - " + oResponse.data.asString();
                      //  console.log("GET Message: " + message);
                    }
                    throw { message: message };
                }
               // console.log(mData);
                callback(null, mData)
            })
            
        }

        if (mService.METHOD === "POST") {
            sURL = "/ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
            var method = "POST";
            var headers = {
                "content-type": "application/json",
                "accept": "application/json"
            };
            const axios = SapCfAxios("sapbhphana", null, { method: 'get', url: '/ODATA_DIBOS/T_COR_INGRESOS.xsodata' });
            let oResponse = axios({
                method: method,
                url: sURL,
                headers: headers,
                data: JSON.stringify({ d: mService.OBJECT }),
                xsrfHeaderName: "x-csrf-token"
            }).then((oResponse) => {
                if (oResponse.status === 201) {
                    mData = JSON.parse(oResponse.data.asString()).d;
                } else {
                    message = "HTTP Error: " + oResponse.headers[2].value + " " + oResponse.headers[3].value;

                    if (oResponse.data) {
                        message = message + " - " + oResponse.data.asString();
                    }
                    throw { message: message };
                }
                callback(null, mData)
            })
            
        }
        
        
    },
    sendRequestXML: function (mService, callback) {
        let sResponse = "";
        let oResponse;
        let sURL;
        if (mService.METHOD === "GET") {
            const axios = SapCfAxios("sapbhphana");
            sURL = "/ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
            var method = "GET";
            var headers = {
                "content-type": "application/json",
                "accept": "application/json"
            };
            let oResponse = axios({
                method: method,
                url: sURL,
                headers: headers
            }).then((oResponse) => {
                if (oResponse.status === 200) {
                    sResponse = oResponse.data.asString();
                } else {
                    let message = "HTTP Error: " + oResponse.headers[2].value + " " + oResponse.headers[3].value;

                    if (oResponse.data) {
                        message = message + " - " + oResponse.data.asString();
                    }
                    throw { message: message };
                }
                callback(null, sResponse)
            })
        }
       // callback(null, sResponse)
    }

}