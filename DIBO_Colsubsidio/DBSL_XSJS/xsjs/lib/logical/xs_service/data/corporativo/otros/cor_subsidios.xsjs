let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_SUBSIDIOS\" WHERE PERIODO = '" + mPeriod + "';";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_SUBSIDIOS\" (PERIODO, TIPO_SUBSIDIO, DESCRIPCION, ACTUAL_PPTO, ACTUAL_EJECUCION) " + 
                                                                            "VALUES (?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        
        if ( mObject.TIPO_SUBSIDIO ) {
            pstmt.setNString(2, mObject.TIPO_SUBSIDIO);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.DESCRIPCION ) {
            pstmt.setNString(3, mObject.DESCRIPCION);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.ACTUAL_PPTO ) {
            pstmt.setDecimal(4, oUtil._number(mObject.ACTUAL_PPTO));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.ACTUAL_EJECUCION ) {
            pstmt.setDecimal(5, oUtil._number(mObject.ACTUAL_EJECUCION));
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
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = oUtil.getLastThreeMonths();
    //var mPeriod = '2021-09-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_SUBSIDIOS.xsodata",
        SET: "subsidios?$filter=PERIODO eq '" + mPeriod + "'"
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


