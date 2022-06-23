let connModule = $.require("../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_MED_BASE_GASTOS_OPERACIONALES\" " +
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
        
        let sql = "INSERT INTO \"logical.data::T_MED_BASE_GASTOS_OPERACIONALES\" (FISCPER, COSTCENTER, GL_ACCOUNT, VALOR) VALUES (?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.FISCPER ) {
            pstmt.setNString(1, mObject.FISCPER);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.COSTCENTER ) {
            pstmt.setNString(2, mObject.COSTCENTER);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.GL_ACCOUNT ) {
            pstmt.setNString(3, mObject.GL_ACCOUNT);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.VALOR ) {
            pstmt.setDecimal(4, oUtil._number(mObject.VALOR));
        } else {
            pstmt.setNull(4);
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
        ENTITY: "DBMED_FIGL15_51_CV.xsodata",
        SET: "GastosOpeIni?$filter=FISCPER ge '" + mPeriod + "'"
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


