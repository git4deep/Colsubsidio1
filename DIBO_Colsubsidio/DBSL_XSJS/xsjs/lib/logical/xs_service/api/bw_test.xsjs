let connModule = $.require("../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");


function getMetadata(){
    var aFilters = [];
    
    aFilters.push({filter: "A0FISCPER eq '001.2019'"});
    aFilters.push({filter: "A0PROFIT_CTR eq '3200002'"});
    
    /*let mService = {
        METHOD: "GET",
        ENTITY: "ZV_PCA1DIV_QTEST_SRV",
        SET: "ZV_PCA1DIV_QTESTResults"
        //FILTERS: aFilters
    };*/
    
    let mService = {
        METHOD: "GET",
        ENTITY: "ZX_RT_T_INGRESOS_CDS",
        SET: "ZX_RT_T_INGRESOS"
    };
    
    // let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);

    let aData = [];
    aObjects.forEach(function(mObject){
        aData.push(mObject);
    });
    
    return aData;
    
    
}

function init(){
    let mResponse = {}; let mData = {};
    
	try {
        let aData = getMetadata();
        
        if(aData.length > 0){
            mResponse.code = 1;
            mResponse.data = aData;
            mResponse.message = "Transaction completed";
        } else {
            mResponse.code = 2;
            mResponse.data = mData;
            mResponse.message = "No matches";
        }
		
	} catch (ex){
		mResponse.code = 3;
		mResponse.data = mData;
		mResponse.message = ex.message;
	}
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}


init();


