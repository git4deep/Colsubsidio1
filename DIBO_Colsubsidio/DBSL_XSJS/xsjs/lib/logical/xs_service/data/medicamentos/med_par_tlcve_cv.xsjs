let connModule = $.require("../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};


function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_MED_PAR_TLCVE_CV\" " + 
	" WHERE PERIODO >= '" + mPeriod + "';";
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
        
        let sql = "INSERT INTO \"logical.data::T_MED_PAR_TLCVE_CV\" (CANAL, CALMONTH, BIC_ZCH_AGCON, DESC_AGCON, ENTIDAD,  " +
                                                                            "PARTICIPA_VENTAS, PARTICIPA_VTA_ENTI, PARTICIPA_CANTI, VENTAS_MES, VENTAS_CANAL, " +
                                                                            "CANTIDAD_CANAL, CANTIDAD_MES, VENTAS_ENTIDAD, CANTIDAD_ENTIDAD, PARTICIPA_CANTI_ENTI) " +
                                                                            " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        
        if ( mObject.CANAL ) {
            pstmt.setNString(1, mObject.CANAL);
        } else {
            pstmt.setNull(1);
        }
        
        if ( mObject.CALMONTH ) {
            pstmt.setNString(2, mObject.CALMONTH);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject._BIC_ZCH_AGCON ) {
            pstmt.setNString(3, mObject._BIC_ZCH_AGCON);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.DESC_AGCON ) {
            pstmt.setNString(4, mObject.DESC_AGCON);
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.ENTIDAD ) {
            pstmt.setNString(5, mObject.ENTIDAD);
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.PARTICIPA_VENTAS ) {
            pstmt.setDecimal(6, oUtil._number(mObject.PARTICIPA_VENTAS));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.PARTICIPA_VTA_ENTI ) {
            pstmt.setDecimal(7, oUtil._number(mObject.PARTICIPA_VTA_ENTI));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.PARTICIPA_CANTI ) {
            pstmt.setDecimal(8, oUtil._number(mObject.PARTICIPA_CANTI));
        } else {
            pstmt.setNull(8);
        }
        
        if ( mObject.VENTAS_MES ) {
            pstmt.setDecimal(9, oUtil._number(mObject.VENTAS_MES));
        } else {
            pstmt.setNull(9);
        }
        
        if ( mObject.VENTAS_CANAL ) {
            pstmt.setDecimal(10, oUtil._number(mObject.VENTAS_CANAL));
        } else {
            pstmt.setNull(10);
        }
        
        if ( mObject.CANTIDAD_CANAL ) {
            pstmt.setDecimal(11, oUtil._number(mObject.CANTIDAD_CANAL));
        } else {
            pstmt.setNull(11);
        }
        
        if ( mObject.CANTIDAD_MES ) {
            pstmt.setDecimal(12, oUtil._number(mObject.CANTIDAD_MES));
        } else {
            pstmt.setNull(12);
        }
        
        if ( mObject.VENTAS_ENTIDAD ) {
            pstmt.setDecimal(13, oUtil._number(mObject.VENTAS_ENTIDAD));
        } else {
            pstmt.setNull(13);
        }
        
        if ( mObject.CANTIDAD_ENTIDAD ) {
            pstmt.setDecimal(14, oUtil._number(mObject.CANTIDAD_ENTIDAD));
        } else {
            pstmt.setNull(14);
        }
        
        if ( mObject.PARTICIPA_CANTI_ENTI ) {
            pstmt.setDecimal(15, oUtil._number(mObject.PARTICIPA_CANTI_ENTI));
        } else {
            pstmt.setNull(15);
        }
        
        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}

function getMetadata(){
    var mLog = {};
    
    var gPeriod = oUtil.getLastMonth();
    //var gPeriod = oUtil.getPenultimateMonth();
    //var gPeriod = '2020-09-01';
    var mPeriod = gPeriod.substr(0, 4) + gPeriod.substr(5, 2);

    let mService = {
        METHOD: "GET",
        ENTITY: "DBMED_PAR_TLCVE_CV.xsodata",
        SET: "PAR_TLC?$filter=CALMONTH ge '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);
    
    if (aObjects.length > 0) {
        deleteContentData(gPeriod);
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


