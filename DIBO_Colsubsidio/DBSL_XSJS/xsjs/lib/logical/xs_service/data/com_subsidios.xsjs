let connModule = $.require("../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COM_SUBSIDIOS\" ;";
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
        
        let sql = "INSERT INTO \"logical.data::T_COM_SUBSIDIOS\" (FECHA, ID_PIRAMIDE_2, ID_TIPO_SUBSIDIO, ID_ESTADO_SUBSIDIO, SUBSIDIOS, " + 
                                                                        "CANTIDAD_SUBSIDIOS, CANTIDAD_TRABAJADORES, CANTIDAD_BENEFICIARIOS) " + 
                                                                        "VALUES (?,?,?,?,?,?,?,?);";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.PERIODO ) {
            pstmt.setDate(1, mObject.PERIODO);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.ID_PIRAMIDE_2 ) {
            pstmt.setInteger(2, oUtil._number(mObject.ID_PIRAMIDE_2));
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.ID_TIPO_SUBSIDIO ) {
            pstmt.setInteger(3, oUtil._number(mObject.ID_TIPO_SUBSIDIO));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.ID_ESTADO_SUBSIDIO ) {
            pstmt.setInteger(4, oUtil._number(mObject.ID_ESTADO_SUBSIDIO));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.SUBSIDIOS ) {
            pstmt.setDecimal(5, oUtil._number(mObject.SUBSIDIOS));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.CANTIDAD_SUBSIDIOS ) {
            pstmt.setInteger(6, oUtil._number(mObject.CANTIDAD_SUBSIDIOS));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.CANTIDAD_TRABAJADORES ) {
            pstmt.setInteger(7, oUtil._number(mObject.CANTIDAD_TRABAJADORES));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.CANTIDAD_BENEFICIARIOS ) {
            pstmt.setInteger(8, oUtil._number(mObject.CANTIDAD_BENEFICIARIOS));
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
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COM_SUBSIDIOS.xsodata",
        SET: "COM_SUBSIDIOS"
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


