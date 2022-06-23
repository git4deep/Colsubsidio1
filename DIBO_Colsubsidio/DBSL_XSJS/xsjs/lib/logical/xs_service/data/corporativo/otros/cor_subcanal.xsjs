let connModule = $.require("../../../../model/bw/service");


let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_SUBCANAL\";";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function deleteContentDataA(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_SUBCANAL_PLANO\";";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_SUBCANAL_PLANO\" (ID_SUBCANAL_BW, ID_CANAL, SUBCANAL, LATITUD, LONGITUD) " + 
                                                                            "VALUES (?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.ID_SUBCANAL_BW ) {
            pstmt.setNString(1, mObject.ID_SUBCANAL_BW);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.ID_CANAL ) {
            pstmt.setInteger(2, oUtil._number(mObject.ID_CANAL));
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.SUBCANAL ) {
            pstmt.setNString(3, mObject.SUBCANAL);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.LATITUD ) {
            pstmt.setDecimal(4, oUtil._decimal(mObject.LATITUD));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.LONGITUD ) {
            pstmt.setDecimal(5, oUtil._decimal(mObject.LONGITUD));
        } else {
            pstmt.setNull(5);
        }
        
        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}

function insertNewRows(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_SUBCANAL\" (ID_SUBCANAL_BW, ID_CANAL, SUBCANAL, LATITUD,  LONGITUD) " +
            " ( " +
            "    SELECT A.ID_SUBCANAL_BW, A.ID_CANAL, UPPER(A.SUBCANAL) AS SUBCANAL, A.LATITUD,  A.LONGITUD " +
            "    FROM \"logical.data::T_COR_SUBCANAL_PLANO\" A  " +
            "    FULL JOIN \"logical.data::T_COR_SUBCANAL\" B ON A.ID_SUBCANAL_BW=B.ID_SUBCANAL_BW " +
            "    WHERE B.ID_SUBCANAL_BW IS NULL " +
            "    ORDER BY A.ID_SUBCANAL_BW " +
            " );";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function getMetadata(){
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_SUBCANAL.xsodata",
        SET: "subcanal"
    };
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);

    if (aObjects.length > 0) {
        //deleteContentData();
        deleteContentDataA();
        insertRows(aObjects);
        insertNewRows();
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


