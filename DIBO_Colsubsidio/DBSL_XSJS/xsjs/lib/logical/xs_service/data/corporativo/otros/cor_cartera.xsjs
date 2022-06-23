let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_CARTERA\" WHERE PERIODO = '" + mPeriod + "' ;";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_CARTERA\" (PERIODO, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, TIPO_ANALISIS, " + 
                                                                    "TERCERO, VENTA, CARTERA, CARTERA_VENCIDA, PROVISION) " + 
                                                                    "VALUES (?,?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.PERIODO ) {
            pstmt.setDate(1, mObject.PERIODO);
        } else {
            pstmt.setNull(1);
        }
        
        pstmt.setNString(2, mObject.ID_GRUPO_LINEA_ACCION);
        pstmt.setNString(3, mObject.ID_SERVICIO);
        
        if ( mObject.TIPO_ANALISIS ) {
            pstmt.setNString(4, mObject.TIPO_ANALISIS);
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.TERCERO ) {
            pstmt.setNString(5, mObject.TERCERO);
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.VENTAS ) {
            pstmt.setDecimal(6, oUtil._number(mObject.VENTAS));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.CARTERA ) {
            pstmt.setDecimal(7, oUtil._number(mObject.CARTERA));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.CARTERA_VENCIDA ) {
            pstmt.setDecimal(8, oUtil._number(mObject.CARTERA_VENCIDA));
        } else {
            pstmt.setNull(8);
        }
        
        if ( mObject.PROVISION ) {
            pstmt.setDecimal(9, oUtil._number(mObject.PROVISION));
        } else {
            pstmt.setNull(9);
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
    //var mPeriod = '2021-09-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_CARTERA.xsodata",
        SET: "cartera?$filter=PERIODO eq '" + mPeriod + "'"
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
		
	} catch (ex){
		mResponse.code = 3;
		mResponse.data = mError;
		mResponse.message = ex.message;
	}
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}


init();

