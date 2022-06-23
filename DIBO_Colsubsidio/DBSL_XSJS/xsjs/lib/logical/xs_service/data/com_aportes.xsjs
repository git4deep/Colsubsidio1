let connModule = $.require("../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COM_APORTES\" ;";
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
        
        let sql = "INSERT INTO \"logical.data::T_COM_APORTES\" (ID_PIRAMIDE_2, FECHA, ID_DISTRIB_APORTE, APORTES, APORTES_PPTO, " + 
                                                                        "RECAUDO, RECAUDO_PPTO, REMANENTE, REMANENTE_PPTO, CANTIDAD_EMPRESAS, " + 
                                                                        "CANTIDAD_TRABAJADORES, CANTIDAD_BENEFICIARIOS) VALUES (?,?,?,?,?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.ID_PIRAMIDE_2 ) {
            pstmt.setInteger(1, oUtil._number(mObject.ID_PIRAMIDE_2));
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.PERIODO ) {
            pstmt.setDate(2, mObject.PERIODO);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.ID_DISTRIB_APORTE ) {
            pstmt.setInteger(3, oUtil._number(mObject.ID_DISTRIB_APORTE));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.APORTES ) {
            pstmt.setDecimal(4, oUtil._number(mObject.APORTES));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.APORTES_PPTO ) {
            pstmt.setDecimal(5, oUtil._number(mObject.APORTES_PPTO));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.RECAUDO ) {
            pstmt.setDecimal(6, oUtil._number(mObject.RECAUDO));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.RECAUDO_PPTO ) {
            pstmt.setDecimal(7, oUtil._number(mObject.RECAUDO_PPTO));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.REMANENTE ) {
            pstmt.setDecimal(8, oUtil._number(mObject.REMANENTE));
        } else {
            pstmt.setNull(8);
        }
        
        if ( mObject.REMANENTE_PPTO ) {
            pstmt.setDecimal(9, oUtil._number(mObject.REMANENTE_PPTO));
        } else {
            pstmt.setNull(9);
        }
        
        if ( mObject.CANTIDAD_EMPRESAS ) {
            pstmt.setInteger(10, oUtil._number(mObject.CANTIDAD_EMPRESAS));
        } else {
            pstmt.setNull(10);
        }
        
        if ( mObject.CANTIDAD_TRABAJADORES ) {
            pstmt.setInteger(11, oUtil._number(mObject.CANTIDAD_TRABAJADORES));
        } else {
            pstmt.setNull(11);
        }
        
        if ( mObject.CANTIDAD_BENEFICIARIOS ) {
            pstmt.setInteger(12, oUtil._number(mObject.CANTIDAD_BENEFICIARIOS));
        } else {
            pstmt.setNull(12);
        }
        
        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}




function getMetadata(){
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COM_APORTES.xsodata",
        SET: "COM_APORTES"
    };
    
    // let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);
    
    if (aObjects.length > 0) {
        deleteContentData();
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


