let connModule = $.require("../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_MED_DIST_GASTO_X_CUENTA\" " +
	" WHERE PERIODO >= '" + mPeriod + "';";
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
        
        let sql = "INSERT INTO \"logical.data::T_MED_DIST_GASTO_X_CUENTA\" (PERIODO, CUENTA, PORC_COMERCIAL, PORC_INSTITUCIONAL, FACTOR) VALUES (?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.PERIODO ) {
            pstmt.setDate(1, mObject.PERIODO);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.GL_ACCOUNT ) {
            pstmt.setNString(2, mObject.GL_ACCOUNT);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject._BIC_ZKF_POCOM ) {
            pstmt.setDecimal(3, oUtil._number(mObject._BIC_ZKF_POCOM));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject._BIC_ZKF_POINS ) {
            pstmt.setDecimal(4, oUtil._number(mObject._BIC_ZKF_POINS));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.CALMONTH ) {
            pstmt.setDecimal(5, oUtil._number(mObject.CALMONTH));
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
    //var gPeriod = '2020-06-01';
    var mPeriod = gPeriod.substr(0, 4) + gPeriod.substr(5, 2);

    let mService = {
        METHOD: "GET",
        ENTITY: "ZD_DISGAS_CV.xsodata",
        SET: "DistGastoCuenta?$filter=CALMONTH ge '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);
    
    if (aObjects.length > 0) {
        deleteContentData(gPeriod);
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


