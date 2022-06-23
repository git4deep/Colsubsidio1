let oService = $.import("logical.model.bw", "service");
let connModule = $.require("../../../../model/bw/service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");
let oCorIncome = $.import("logical.xs_service.data.cor_ingreso", "cor_ingreso");

function getMetadata(){
    var mLog = {};
    var sType = "COAP_FIN";
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2022-01-01';

    let mService = {
        METHOD: "GET",
        ENTITY: "D_PCA01_COAP_CV_EXP.xsodata",
        SET: sType + "?$filter=PERIODO eq '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
   // console.log("Before Call of :"+mService.ENTITY);
   // let aObjects = oService.sendRequest(mService);
   let aObjects =   connModule.sync.sendRequest(mService);
  //  console.log("After Call of :"+mService.ENTITY);
   // console.log(aObjects);
    if (aObjects.length > 0) {
        //oCorIncome.deleteGreaterPeriod(mPeriod, sType);
        oCorIncome.deleteIncomePeriod(mPeriod, sType);
        oCorIncome.toSetData(mLog, aObjects, sType);
    }

    oJob.insertJobLog(mLog);
    return aObjects;
}

function init(){
    let mResponse = {}; let mData = {};
    
    try {
      //  console.log("In Try");
        var sData = $.request.parameters.get("data");
       // console.log("after data");
        let aData = getMetadata();
      //  console.log("after Metadata");
        if( aData ){
            mResponse.code = 1;
            mResponse.data = mData;
            mResponse.message = "Transaction completed";
        } else {
            mResponse.code = 2;
            mResponse.data = mData;
            mResponse.message = "No matches";
        }
        
        sData = "true";
        
        if(sData === "true"){
            mResponse.data = aData;
        }
        
    } catch (ex){
       // console.log("IN CATCH: ");
      //  console.log(ex);
        mResponse.code = 3;
        mResponse.data = {};
        mResponse.message = ex.message;
    }
    
    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify(mResponse));
}

init();