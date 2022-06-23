let oService = $.import("logical.model.bw", "service");
let connModule = $.require("../../../../model/bw/service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");
let oCorIncome = $.import("logical.xs_service.data.cor_ingreso", "cor_ingreso");

function getMetadata(){
    var mLog = {};
    var sType = "COMS_FIN";
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = oUtil.getLastThreeMonths();
    //var mPeriod = '2021-10-01';

    let mService = {
        METHOD: "GET",
        ENTITY: "D_PCA01_COMS_CV_EXP.xsodata",
        SET: sType + "?$filter=PERIODO eq '" + mPeriod + "'"
    };
    console.log("mService: " + mService.SET);
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    // let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);
    console.log("Length: " + aObjects.length);
    console.log("Aobject: " + aObjects);
    
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
    $.response.setBody(JSON.stringify(mResponse));
}

init();