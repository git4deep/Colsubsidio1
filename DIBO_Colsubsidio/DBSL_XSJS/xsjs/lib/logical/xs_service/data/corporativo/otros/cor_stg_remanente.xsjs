let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};

function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_STG_REMANENTE\"  WHERE PERIODO = '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function deleteDestinationData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_AFILIADOS\"  WHERE NIVEL_3 = 'REMANENTE $' AND PERIODO = '" + mPeriod + "';";
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
        
        let sql = "INSERT INTO \"logical.data::T_COR_STG_REMANENTE\" (PERIODO, SEGMENTO, APORTES, APORTES_PORC, OTROS_DISTR, " + 
                    "SUBS_ESP, SUBS_MONETARIO, REMANENTE_MES )" + 
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        
        if ( mObject.SEGMENTO ) {
            pstmt.setNString(2, mObject.SEGMENTO);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.APORTES ) {
            pstmt.setDecimal(3, oUtil._number(mObject.APORTES));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.APORTES_PORC ) {
            pstmt.setDecimal(4, oUtil._number(mObject.APORTES_PORC));
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.OTROS_DISTR ) {
            pstmt.setDecimal(5, oUtil._number(mObject.OTROS_DISTR));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.SUBS_ESP ) {
            pstmt.setDecimal(6, oUtil._number(mObject.SUBS_ESP));
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.SUBS_MONETARIO ) {
            pstmt.setDecimal(7, oUtil._number(mObject.SUBS_MONETARIO));
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.REMANENTE_MES ) {
            pstmt.setDecimal(8, oUtil._number(mObject.REMANENTE_MES));
        } else {
            pstmt.setNull(8);
        }

        pstmt.execute();
        pstmt.close();
        
	});
	conn.commit();
    conn.close();
}


function toFilter(aObjects){
    aObjects.forEach(function(mObject){
        if ( mObject.SEGMENTO ) {
            mObject.SEGMENTO.trim();
        }
        mObject.SEGMENTO.trim();
        if ( mObject.SEGMENTO === "Alto" ) {
            mObject.SEGMENTO = "4. ALTO";
        }
        if ( mObject.SEGMENTO === "Básico" ) {
            mObject.SEGMENTO = "1. BASICO";
        }
        if ( mObject.SEGMENTO === "Joven" ) {
            mObject.SEGMENTO = "2. MEDIO";
        }
        if ( mObject.SEGMENTO === "Medio" ) {
            mObject.SEGMENTO = "3. JOVEN";
        }
    });
    return aObjects;
}


function updateColumns(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "UPDATE \"logical.data::T_COR_AFILIADOS\" as T1 " +
            "SET BASE_PARTICIPACION = (SELECT SUM(T2.CANTIDAD) FROM \"logical.data::T_COR_AFILIADOS\" as T2 " +
            "WHERE T1.PERIODO = T2.PERIODO AND T1.NIVEL_3 = T2.NIVEL_3 AND T2.NIVEL_3 = 'REMANENTE $' AND T2.PERIODO = '" + mPeriod + "') " +
            "WHERE T1.NIVEL_3 = 'REMANENTE $' AND T1.PERIODO = '" + mPeriod + "'; ";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function insertDestination(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	/*
	//Forma Mensual
	$sql = "INSERT INTO \"DBSL\".\"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) ( " +
            " SELECT PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS,  " +
            " REMANENTE_MES AS CANTIDAD, 'REMANENTE $' AS NIVEL_3, 0 AS VALOR " +
            " FROM \"DBSL\".\"logical.data::T_COR_STG_REMANENTE\" WHERE PERIODO = '" + mPeriod + "' " +
            " );";
    */        
    //Forma Acumulada:        
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) ( " +
            "SELECT PERIODO, SEGMENTO, 0 AS PARTICIPACION,  " +
            "CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            "SUM(REMANENTE) / 1000000 AS CANTIDAD, 'REMANENTE $' AS NIVEL_3, 0 AS VALOR FROM ( " +
            "SELECT PERIODO_A AS PERIODO, SEGMENTO, SUM(REMANENTE_MES) AS REMANENTE FROM  " +
            "(SELECT PERIODO, SEGMENTO,  REMANENTE_MES FROM \"logical.data::T_COR_STG_REMANENTE\" " + 
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) Z " +
            "INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " + 
            "(SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_REMANENTE\" " + 
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) A LEFT JOIN " +
            "(SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_REMANENTE\" " + 
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE))  ) B  " +
            "ON ANIO = ANIO_B AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO = Y.PERIODO_B  " +
            "GROUP BY PERIODO_A,SEGMENTO ) W WHERE PERIODO = '" + mPeriod + "' GROUP BY PERIODO, SEGMENTO ORDER BY PERIODO, SEGMENTO " +
            "); ";
    
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentRemanenteTotal(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR, BASE_PARTICIPACION) " +
            "( " +
            "SELECT PERIODO, 'TOTAL' AS SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            "SUM(CANTIDAD) AS CANTIDAD, NIVEL_3, 0 AS VALOR, SUM(CANTIDAD) AS BASE_PARTICIPACION " +
            "FROM \"logical.data::T_COR_AFILIADOS\" " +
            "WHERE NIVEL_3 IN ( 'REMANENTE $' ) " +
            "AND PERIODO >= '" + mPeriod + "' " +
            "GROUP BY PERIODO, NIVEL_3 " +
            "ORDER BY PERIODO" +
            ")";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function getMetadata(){

    var mLog = {};
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-10-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_STG_REMANENTE.xsodata",
        SET: "REMANENTE?$filter=PERIODO eq '" + mPeriod + "'"
    };
    
    //SET LOG 
    mLog.ENTITY = mService.ENTITY;
    mLog.SET = mService.SET;
    mLog.MESSAGE = "Transaction completed";
    
    //let aObjects = oService.sendRequest(mService);
    let aObjects = connModule.sync.sendRequest(mService);

    if (aObjects.length > 0) {
        deleteContentData(mPeriod);
        deleteDestinationData(mPeriod);
        insertRows(toFilter(aObjects));
        insertDestination(mPeriod);
        updateColumns(mPeriod);
        insertContentRemanenteTotal(mPeriod);
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