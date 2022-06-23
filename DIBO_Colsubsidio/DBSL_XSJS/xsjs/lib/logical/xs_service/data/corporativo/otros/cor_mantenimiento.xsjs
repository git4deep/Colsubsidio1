let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_MANTENIMIENTO\" " +
	" WHERE PERIODO >= '" + mPeriod + "'; ";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_MANTENIMIENTO\" (PERIODO, ID_SERVICIO, NIVEL_1, NIVEL_2, EJECUCION_MTTO, " + 
                                                                    "PPTO_MTTO, CUMPLIMIENTO_COP, CUMPLIMIENTO_PORC) " + 
                                                                    "VALUES (?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        pstmt.setNString(2, mObject.ID_SERVICIO);
        
        if ( mObject.Nivel_1 ) {
            pstmt.setNString(3, mObject.Nivel_1);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.NIVEL_2 ) {
            pstmt.setNString(4, mObject.NIVEL_2);
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.EJECUCION_MTTO ) {
            pstmt.setDecimal(5, oUtil._number(mObject.EJECUCION_MTTO));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.PPTO_MTTO ) {
            pstmt.setDecimal(6, oUtil._number(mObject.PPTO_MTTO));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.CUMPLIMIENTO_COP ) {
            pstmt.setDecimal(7, oUtil._number(mObject.CUMPLIMIENTO_COP));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.CUMPLIMIENTO_PORC ) {
            pstmt.setDecimal(8, oUtil._number(mObject.CUMPLIMIENTO_PORC));
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
    
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-06-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_MANTENIMIENTO.xsodata",
        SET: "mantenimiento?$filter=PERIODO ge '" + mPeriod + "'"
    };
    
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


