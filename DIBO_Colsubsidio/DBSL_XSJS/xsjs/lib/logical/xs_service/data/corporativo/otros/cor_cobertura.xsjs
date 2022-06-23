let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};

//antes de ejecutar este script debe ejecutarse
// /logical/xs_service/data/corporativo/otros/cor_subcanal.xsjs

function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_COBERTURA\" WHERE PERIODO = '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function insertRows(aObjects){
	let conn = $.db.getConnection();
	let idCanal;
	
	aObjects.forEach(function(mObject){
        
        mError = mObject;
        
        let sqlId = "SELECT ID_SUBCANAL FROM \"logical.data::T_COR_SUBCANAL\" WHERE ID_SUBCANAL_BW = ? ;";
        
        let pstmtId = conn.prepareStatement(sqlId);
        pstmtId.setString(1,mObject.ID_SUBCANAL);
        let rs = pstmtId.executeQuery();
        if (rs.next()) {
          idCanal = rs.getInteger(1);
        }
        else{
          idCanal = -1;  
        /*  let sql1 = "INSERT INTO \"DBSL\".\"logical.data::T_COR_SUBCANAL\" (ID_SUBCANAL_BW, ID_CANAL, SUBCANAL, LATITUD, LONGITUD) VALUES (?,?,?,?,?) ;"; 
          /*let pstmt_canal = conn.prepareStatement(sql1);
          pstmt_canal.setString(1, mObject.ID_SUBCANAL);
          pstmt_canal.setString(2, '6');
          pstmt_canal.setString(3, 'TBD');
          pstmt_canal.setDecimal(4, 0,0);
          pstmt_canal.setDecimal(5, 0,0);
          pstmt_canal.execute();
          pstmt_canal.close();
          */
        }
        rs.close();
        
        let sql = "INSERT INTO \"logical.data::T_COR_COBERTURA\" (PERIODO, ID_SUBCANAL, VENTAS, TRANSACCIONES, TKT_PROMEDIO) " + 
                                                                                "VALUES (?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        
        if ( mObject.ID_SUBCANAL ) {
            //pstmt.setInteger(2, oUtil._number(mObject.ID_SUBCANAL));
            pstmt.setInteger(2, idCanal);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.VENTAS ) {
            pstmt.setDecimal(3, oUtil._number(mObject.VENTAS));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.TRANSACCIONES ) {
            pstmt.setDecimal(4, oUtil._number(mObject.TRANSACCIONES));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.TKT_PROMEDIO ) {
            pstmt.setDecimal(5, oUtil._number(mObject.TKT_PROMEDIO));
        } else {
            pstmt.setNull(5);
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
        ENTITY: "T_COR_COBERTURA.xsodata",
        SET: "cobertura?$filter=PERIODO eq '" + mPeriod + "'"
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
        
        sData = "true";
        
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


