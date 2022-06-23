let oService = $.import("logical.model.bw", "service");
let connModule = $.require("../../../../model/bw/service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");
let oCorIncome = $.import("logical.xs_service.data.cor_ingreso", "cor_ingreso");

function getMetadata(){
    var mLog = {};
    var sType = "COCS_FIN";
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-07-01';

    let mService = {
        METHOD: "GET",
        ENTITY: "D_PCA01_COCS_CV_EXP.xsodata",
        SET: sType + "?$filter=PERIODO ge '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    // let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);
    
    if (aObjects.length > 0) {
        oCorIncome.deleteGreaterPeriod(mPeriod, sType);
        oCorIncome.toSetData(mLog, aObjects, sType);
    }

    oJob.insertJobLog(mLog);
    return aObjects;
}

function init(){
    let mResponse = {}; let mData = {};
    
    try {
        var sData = $.request.parameters.get("data");
        let aData = getMetadata();
        
        if( aData ){
            mResponse.code = 1;
            mResponse.data = mData;
            mResponse.message = "Transaction completed";
        } else {
            mResponse.code = 2;
            mResponse.data = mData;
            mResponse.message = "No matches";
        }
        
        //sData = "true";
        
        if(sData === "true"){
            mResponse.data = aData;
        }
        
    } catch (ex){
        mResponse.code = 3;
        mResponse.data = {};
        mResponse.message = ex.message;
    }
    
    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify(mResponse));
}

init();