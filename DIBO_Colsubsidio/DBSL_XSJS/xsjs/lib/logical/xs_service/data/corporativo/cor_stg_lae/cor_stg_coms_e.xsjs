let oService = $.import("logical.model.bw", "service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");
let oCorIncome = $.import("logical.xs_service.data.cor_stg_lae", "cor_stg_lae");
let connModule = $.require("../../../../model/bw/service");

function getMetadata(){
    var mLog = {};
    var sType = "COMS_LAE";
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-10-01';

    let mService = {
        METHOD: "GET",
        ENTITY: "D_LAE_DET_COMS_ESP.xsodata",
        SET: sType + "?$filter=PERIODO eq '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);

    if (aObjects.length > 0) {
        oCorIncome.toSetData(mLog, aObjects, sType);
        oCorIncome.deleteIncomePeriodLAE(mPeriod, sType);
        oCorIncome.insertRowsLAE(mPeriod, sType);
        oCorIncome.updateColumnsLAE(mPeriod, sType); 
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
        
        sData = "true";
        
        if(sData === "true"){
            mResponse.data = aData;
        }
        
    } catch (ex){
        mResponse.code = 3;
        mResponse.data = {};
        mResponse.message = ex.message;
    }
    
    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify(mResponse.message));
}

init();