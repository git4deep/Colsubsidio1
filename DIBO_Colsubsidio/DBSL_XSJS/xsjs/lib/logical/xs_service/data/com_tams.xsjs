let connModule = $.require("../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COM_TAMS\" ;";
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
        
        let sql = "INSERT INTO \"logical.data::T_COM_TAMS\" (ID_PIRAMIDE_2, FECHA, SUBSIDIOS, SALDO) " + 
                                                                        "VALUES (?,?,?,?);";
        
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
        
        if ( mObject.SUBSIDIOS ) {
            pstmt.setDecimal(3, oUtil._number(mObject.SUBSIDIOS));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.SALDO ) {
            pstmt.setDecimal(4, oUtil._number(mObject.SALDO));
        } else {
            pstmt.setNull(4);
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
        ENTITY: "T_COM_TAMS.xsodata",
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


