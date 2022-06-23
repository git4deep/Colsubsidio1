let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_REDENCIONES\" WHERE PERIODO = '" + mPeriod + "';";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_REDENCIONES\" (ID_CANAL, PERIODO, TIPO, CANTIDAD_REDENCION, " + 
                                                                        "VALOR_REDENCION, CANTIDAD_COMPRA, VALOR_COMPRA) " + 
                                                                        " VALUES (?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.ID_CANAL ) {
            pstmt.setInteger(1, oUtil._number(mObject.ID_CANAL));
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.PERIODO ) {
            pstmt.setDate(2, mObject.PERIODO);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.TIPO ) {
            pstmt.setNString(3, mObject.TIPO);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.CANTIDAD_REDENCION ) {
            pstmt.setDecimal(4, oUtil._number(mObject.CANTIDAD_REDENCION));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.VALOR_REDENCION ) {
            pstmt.setDecimal(5, oUtil._number(mObject.VALOR_REDENCION));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.CANTIDAD_COMPRA ) {
            pstmt.setDecimal(6, oUtil._number(mObject.CANTIDAD_COMPRA));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.VALOR_COMPRA ) {
            pstmt.setDecimal(7, oUtil._number(mObject.VALOR_COMPRA));
        } else {
            pstmt.setNull(7);
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
    //var mPeriod = '2021-10-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_REDENCIONES.xsodata",
        SET: "redenciones?$filter=PERIODO eq '" + mPeriod + "'"
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