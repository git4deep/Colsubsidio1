let connModule = $.require("../../../../model/bw/service");

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};

function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_AFILIADOS\" " +
	"WHERE NIVEL_3 IN ('1. AFILIADOS A LA CAJA','1. AFILIADOS A CAJA','CANT. TRABAJADORES', 'NO DEPENDIENTES', 'CANT. EMPRESAS') " +
	"AND PERIODO >= '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function updateColumns(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "UPDATE \"logical.data::T_COR_AFILIADOS\" as T1 " +
            "SET BASE_PARTICIPACION = (SELECT SUM(T2.CANTIDAD) FROM \"logical.data::T_COR_AFILIADOS\" as T2 " +
            "WHERE T1.PERIODO = T2.PERIODO AND T1.NIVEL_3 = T2.NIVEL_3 AND T2.NIVEL_3 IN ('1. AFILIADOS A LA CAJA', 'CANT. TRABAJADORES', 'NO DEPENDIENTES', 'CANT. EMPRESAS') " +
            " AND T2.PERIODO >= '" + mPeriod + "' )" +
            "WHERE T1.NIVEL_3 IN ('1. AFILIADOS A LA CAJA', 'CANT. TRABAJADORES', 'NO DEPENDIENTES', 'CANT. EMPRESAS')  " +
            " AND T1.PERIODO >= '" + mPeriod + "'; ";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentAfiliadosTotal(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR, BASE_PARTICIPACION) " +
            "( " +
            "SELECT PERIODO, 'TOTAL' AS SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            "SUM(CANTIDAD) AS CANTIDAD, NIVEL_3, 0 AS VALOR, SUM(CANTIDAD) AS BASE_PARTICIPACION " +
            "FROM \"logical.data::T_COR_AFILIADOS\" " +
            "WHERE NIVEL_3 IN ( '1. AFILIADOS A LA CAJA', 'CANT. TRABAJADORES') " +
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

function insertContentAfiliadosTotalO(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
    sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR, BASE_PARTICIPACION) ( " +
            " SELECT PERIODO, 'TOTAL+OTROS' AS SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " + 
            " SUM(CANTIDAD) AS CANTIDAD, '1. AFILIADOS A CAJA' AS NIVEL_3, 0 AS VALOR, SUM(CANTIDAD) AS BASE_PARTICIPACION  FROM ( " +
            "     SELECT PERIODO, SEGMENTO, CANTIDAD " +
            "     FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "     WHERE NIVEL_3 = '1. AFILIADOS A LA CAJA'  " +
            "     AND SEGMENTO NOT IN ('TOTAL', 'TOTAL+OTROS') " +
            "     AND PERIODO >= '" + mPeriod + "'  " +
            "     UNION  " +
            "     SELECT PERIODO, SEGMENTO, CANTIDAD " +
            "     FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "     WHERE NIVEL_3 = 'NO DEPENDIENTES'  " +
            "     AND PERIODO >= '" + mPeriod + "'  " +
            " ) GROUP BY PERIODO " +
            " UNION " +
            " SELECT A.PERIODO, A.SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS,  " +
            " CANTIDAD, '1. AFILIADOS A CAJA' AS NIVEL_3, 0 AS VALOR, BASE_PARTICIPACION  FROM ( " +
            "     SELECT PERIODO, SEGMENTO, CANTIDAD " +
            "     FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "     WHERE NIVEL_3 = '1. AFILIADOS A LA CAJA'  " +
            "     AND SEGMENTO NOT IN ('TOTAL', 'TOTAL+OTROS') " +
            "     AND PERIODO >= '" + mPeriod + "'  " +
            "     UNION  " +
            "     SELECT PERIODO, SEGMENTO, CANTIDAD " +
            "     FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "     WHERE NIVEL_3 = 'NO DEPENDIENTES'  " +
            "     AND PERIODO >= '" + mPeriod + "'  " +
            " ) A INNER JOIN ( " +
            "     SELECT PERIODO, SUM(CANTIDAD) AS BASE_PARTICIPACION  FROM ( " +
            "         SELECT PERIODO, SEGMENTO, CANTIDAD " +
            "         FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "         WHERE NIVEL_3 = '1. AFILIADOS A LA CAJA'  " +
            "         AND SEGMENTO NOT IN ('TOTAL', 'TOTAL+OTROS') " +
            "         AND PERIODO >= '" + mPeriod + "'  " +
            "         UNION  " +
            "         SELECT PERIODO, SEGMENTO, CANTIDAD " +
            "         FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "         WHERE NIVEL_3 = 'NO DEPENDIENTES'  " +
            "         AND PERIODO >= '" + mPeriod + "'  " +
            "     ) GROUP BY PERIODO) B " +
            " ON A.PERIODO = B.PERIODO " +
            " );";

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
        
        let sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) " + 
                                                                                "VALUES (?,?,?,?,?,?,?) ;";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        
        if ( mObject.SEGMENTO ) {
            pstmt.setNString(2, mObject.SEGMENTO);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.PARTICIPACION ) {
            pstmt.setDecimal(3, oUtil._number(mObject.PARTICIPACION));
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.TIPO_ANALISIS ) {
            pstmt.setNString(4, mObject.TIPO_ANALISIS);
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.CANTIDAD ) {
            pstmt.setDecimal(5, oUtil._number(mObject.CANTIDAD));
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.NIVEL_3 ) {
            pstmt.setNString(6, mObject.NIVEL_3);
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.VALOR ) {
            pstmt.setDecimal(7, oUtil._number(mObject.VALOR));
        } else {
            pstmt.setNull(7);
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


function getMetadata(){
    var mLog = {};
    
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-10-01';
    
    let mService = {
        METHOD: "GET",
        ENTITY: "T_COR_AFILIADOS.xsodata",
        SET: "afiliados?$filter=PERIODO ge '" + mPeriod + "'"
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
        updateColumns(mPeriod);
        insertContentAfiliadosTotal(mPeriod);
        insertContentAfiliadosTotalO(mPeriod);
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
