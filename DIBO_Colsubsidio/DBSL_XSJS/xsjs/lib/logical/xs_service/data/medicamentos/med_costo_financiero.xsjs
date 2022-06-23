let connModule = $.require("../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_MED_COSTO_FINANCIERO\" " +
	" WHERE FISCPER >= '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function insertRows(aObjects){
	let conn = $.db.getConnection();
	
	aObjects.forEach(function(mObject){
        
        mError = mObject;
        
        let sql = "INSERT INTO \"logical.data::T_MED_COSTO_FINANCIERO\" (FISCPER, DEBITOR, CARTERA_VENCIDA, TOTCART, PORCARVEN) VALUES (?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.FISCPER ) {
            pstmt.setNString(1, mObject.FISCPER);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.DEBITOR ) {
            pstmt.setNString(2, mObject.DEBITOR);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.CARTERA_VENCIDA ) {
            pstmt.setDecimal(3, oUtil._number(mObject.CARTERA_VENCIDA));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.TOTCART ) {
            pstmt.setDecimal(4, oUtil._number(mObject.TOTCART));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.PORCARVEN ) {
            pstmt.setDecimal(5, oUtil._number(mObject.PORCARVEN));
        } else {
            pstmt.setNull(5);
        }
        
        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}



function getMetadata(){
    
    var mLog = {};
    
    var gPeriod = oUtil.getLastMonth();
    //var gPeriod = oUtil.getPenultimateMonth();
    //var gPeriod = '2020-07-01';
    
    var mPeriod = gPeriod.substr(0, 4) + "0" + gPeriod.substr(5, 2);

    let mService = {
        METHOD: "GET",
        ENTITY: "DBMED_COSTFIN_CV.xsodata",
        SET: "CostoFinanciero?$filter=FISCPER ge '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);
    
    if (aObjects.length > 0) {
        deleteContentData(mPeriod);
        insertRows(aObjects);
    }
    
    return aObjects;
}

function init(){
    let mResponse = {}; let mData = {};
    
	try {
        var sData = $.request.parameters.get("data");
        let aData = getMetadata();
        
        if(aData){
            mResponse.code = 1;
            mResponse.data = mData;
            mResponse.message = "Transaction completed";
        } else {
            mResponse.code = 2;
            mResponse.data = mData;
            mResponse.message = "No matches";
        }
        
        //sData = "true";
        
        if ( sData === "true" ) {
            mResponse.data = aData;
        }
		
	} catch (ex){
		mResponse.code = 3;
		mResponse.data = mError;
		mResponse.message = ex.message;
	}
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}


init();


