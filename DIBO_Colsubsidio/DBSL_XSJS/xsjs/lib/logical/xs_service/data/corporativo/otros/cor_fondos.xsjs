let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};

function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_FONDOS\" WHERE TIPO = 'AUTO' AND PERIODO = '" + mPeriod + "' ;";

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
        
        let sql = "INSERT INTO \"logical.data::T_COR_FONDOS\" (PERIODO, TIPO_FONDO, DESCRIPCION, ACTUAL_PPTO, ASIGNACIONES, RECURSOS_DISPONIBLES, SALDOS, TIPO) " + 
                                                                                "VALUES (?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        
        if ( mObject.TIPO_FONDO ) {
            pstmt.setNString(2, mObject.TIPO_FONDO);
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
        
        if ( mObject.ASIGNACIONES ) {
            pstmt.setDecimal(5, oUtil._number(mObject.ASIGNACIONES));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.RECURSOS_DISPONIBLES ) {
            pstmt.setDecimal(6, oUtil._number(mObject.RECURSOS_DISPONIBLES));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.SALDOS ) {
            pstmt.setDecimal(7, oUtil._number(mObject.SALDOS));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.Tipo ) {
            pstmt.setNString(8, mObject.Tipo);
        } else {
            pstmt.setNull(8);
        }
        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}


function getMetadata(){
    
    var mLog = {};
    //var mPeriod = oUtil.getPenultimateMonth();
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = '2021-10-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_FONDOS.xsodata",
        SET: "fondos?$filter=PERIODO eq '" + mPeriod + "'"
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
