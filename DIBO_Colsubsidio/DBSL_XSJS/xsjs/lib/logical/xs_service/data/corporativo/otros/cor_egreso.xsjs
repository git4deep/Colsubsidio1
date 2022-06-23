let connModule = $.require("../../../../model/bw/service");
let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_EGRESO\" " + 
	        " WHERE ID_SERVICIO IN ('CORT','COEC','COCS','COAP','COAD','COMS','COVD','COMD','COIP','COAB') " + 
            " AND PERIODO >= '" + mPeriod + "';";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_EGRESO\" (PERIODO, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, NIVEL_2, NIVEL_1, " + 
                                                                    "TIPO_ANALISIS, TIPO, EGRESO_REAL, EGRESO_PPTO, EGRESO_REAL_AN) " + 
                                                                    "VALUES (?,?,?,?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        pstmt.setNString(2, mObject.ID_CAJA);
        pstmt.setNString(3, mObject.ID_GRUPO_LINEA_ACCION);
        pstmt.setNString(4, mObject.ID_SERVICIO);
        
        if ( mObject.NIVEL_2 ) {
            pstmt.setNString(5, mObject.NIVEL_2);
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.NIVEL_1 ) {
            pstmt.setNString(6, mObject.NIVEL_1);
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.TIPO_ANALISIS ) {
            pstmt.setNString(7, mObject.TIPO_ANALISIS);
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.TIPO ) {
            pstmt.setNString(8, mObject.TIPO);
        } else {
            pstmt.setNull(8);
        }
        
        if ( mObject.EGRESO_REAL ) {
            pstmt.setDecimal(9, oUtil._number(mObject.EGRESO_REAL));
        } else {
            pstmt.setNull(9);
        }
        
        if ( mObject.EGRESO_PPTO ) {
            pstmt.setDecimal(10, oUtil._number(mObject.EGRESO_PPTO));
        } else {
            pstmt.setNull(10);
        }
        
        if ( mObject.EGRESO_REAL_AN ) {
            pstmt.setDecimal(11, oUtil._number(mObject.EGRESO_REAL_AN));
        } else {
            pstmt.setNull(11);
        }
        
        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}


function toFilter(aObjects){
    aObjects.forEach(function(mObject){
        if ( mObject.NIVEL_1 ) {
            mObject.NIVEL_1.trim();
        }
        if ( mObject.NIVEL_1 === "1.PISCILAGO" ) {
            mObject.NIVEL_1 = "PISCILAGO";
        }
        if ( mObject.NIVEL_1 === "2.HOTELES" ) {
            mObject.NIVEL_1 = "HOTELES";
        }
        if ( mObject.NIVEL_1 === "3.CLUBES" ) {
            mObject.NIVEL_1 = "CLUBES";
        }
        if ( mObject.NIVEL_1 === "4.NUEVOS PROGRAMAS" ) {
            mObject.NIVEL_1 = "NUEVOS PROGRAMAS";
        }
        if ( mObject.NIVEL_1 === "5.RECREACIÓN, DEPORTES Y EVENTOS" ) {
            mObject.NIVEL_1 = "RECREACIÓN, DEPORTES Y EVENTOS";
        }
        if ( mObject.NIVEL_1 === "6.OTROS *" ) {
            mObject.NIVEL_1 = "OTROS *";
        }
        /*
        if ( mObject.NIVEL_1 === "1.PRIMERA INFANCIA" ) {
            mObject.NIVEL_1 = "PRIMERA INFANCIA";
        }
        if ( mObject.NIVEL_1 === "2.COLEGIOS PROPIOS" ) {
            mObject.NIVEL_1 = "COLEGIOS PROPIOS";
        }
        if ( mObject.NIVEL_1 === "3.OTROS COLEGIOS" ) {
            mObject.NIVEL_1 = "OTROS COLEGIOS";
        }
        if ( mObject.NIVEL_1 === "4.BAC" ) {
            mObject.NIVEL_1 = "BAC";
        }
        if ( mObject.NIVEL_1 === "5.TEATRO" ) {
            mObject.NIVEL_1 = "TEATRO";
        }
        if ( mObject.NIVEL_1 === "6. BIBLIOTECAS" ) {
            mObject.NIVEL_1 = "BIBLIOTECAS";
        }
        if ( mObject.NIVEL_1 === "7.CIENCIA Y TECNOLOGÍA" ) {
            mObject.NIVEL_1 = "CIENCIA Y TECNOLOGÍA";
        }
        if ( mObject.NIVEL_1 === "8.OTROS*" ) {
            mObject.NIVEL_1 = "OTROS *";
        }
        */
        if ( mObject.NIVEL_2 ) {
            mObject.NIVEL_2.trim();
        }
        if ( mObject.NIVEL_2 === "HOTEL ALCARAVÁN" ) {
            mObject.NIVEL_2 = "HOTEL EL ALCARAVÁN";
        }
        if ( mObject.NIVEL_2 === "OTROS *" ) {
            mObject.NIVEL_2 = "OTROS *";
        }
    });
    return aObjects;
}

function getMetadata(){
    
    var mLog = {};
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-01-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_EGRESOS.xsodata",
        SET: "egreso?$filter=PERIODO ge '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);

    if (aObjects.length > 0) {
        deleteContentData(mPeriod);
        insertRows(toFilter(aObjects));
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
        
        if(sData === "true"){
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

