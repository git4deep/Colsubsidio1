let connModule = $.require("../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_MED_MEDICAMENTOS\" ;";
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
        
        let sql = "INSERT INTO \"logical.data::T_MED_MEDICAMENTOS\" (PERIODO, ANO, MES, CANAL, ENTIDAD, DES_CANAL, DES_MES, VENTAS_BRUTAS, " +
                                                                            "DESCUENTOS_VENTAS, INGRESOS_OPER, INGRESOS_NOPER, CMV_ANTDIST, MVC_CREDITO, " +
                                                                            "MVC_DES_FIN, PROVFIL, REALFIL, GASTONOOPE) " +
                                                                            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.PERIODO ) {
            pstmt.setDate(1, mObject.PERIODO);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.ANO ) {
            pstmt.setNString(2, mObject.ANO);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.MES ) {
            pstmt.setNString(3, mObject.MES);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.CANAL ) {
            pstmt.setNString(4, mObject.CANAL);
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.ENTIDAD ) {
            pstmt.setNString(5, mObject.ENTIDAD);
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.DES_CANAL ) {
            pstmt.setNString(6, mObject.DES_CANAL);
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.DES_MES ) {
            pstmt.setNString(7, mObject.DES_MES);
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.VENTAS_BRUTAS ) {
            pstmt.setDecimal(8, oUtil._number(mObject.VENTAS_BRUTAS));
        } else {
            pstmt.setNull(8);
        }
        
        if ( mObject.DESCUENTOS_VENTAS ) {
            pstmt.setDecimal(9, oUtil._number(mObject.DESCUENTOS_VENTAS));
        } else {
            pstmt.setNull(9);
        }
        
        if ( mObject.INGRESOS_OPER ) {
            pstmt.setDecimal(10, oUtil._number(mObject.INGRESOS_OPER));
        } else {
            pstmt.setNull(10);
        }
        
        if ( mObject.INGRESOS_NOPER ) {
            pstmt.setDecimal(11, oUtil._number(mObject.INGRESOS_NOPER));
        } else {
            pstmt.setNull(11);
        }
        
        if ( mObject.CMV_ANTDIST ) {
            pstmt.setDecimal(12, oUtil._number(mObject.CMV_ANTDIST));
        } else {
            pstmt.setNull(12);
        }
        
        if ( mObject.MVC_CREDITO ) {
            pstmt.setDecimal(13, oUtil._number(mObject.MVC_CREDITO));
        } else {
            pstmt.setNull(13);
        }
        
        if ( mObject.MVC_DES_FIN ) {
            pstmt.setDecimal(14, oUtil._number(mObject.MVC_DES_FIN));
        } else {
            pstmt.setNull(14);
        }
        
        if ( mObject.PROVFIL ) {
            pstmt.setDecimal(15, oUtil._number(mObject.PROVFIL));
        } else {
            pstmt.setNull(15);
        }
        
        if ( mObject.REALFIL ) {
            pstmt.setDecimal(16, oUtil._number(mObject.REALFIL));
        } else {
            pstmt.setNull(16);
        }
        
        if ( mObject.GASTONOOPE ) {
            pstmt.setDecimal(17, oUtil._number(mObject.GASTONOOPE));
        } else {
            pstmt.setNull(17);
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
        ENTITY: "T_MED_MEDICAMENTOS.xsodata",
        SET: "T_MED_MEDICAMENTOS"
    };
    
    //let aObjects = oService.sendRequest(mService);
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


