let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");

var mError = {};

function deleteContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_AFILIADOS\" " +
	" WHERE NIVEL_3 = '2. AFILIADOS COMPRADORES' " +
	" AND PERIODO = '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentData(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) ( " +
            " SELECT PERIODO_A PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            " COUNT(*) AS CANTIDAD, '2. AFILIADOS COMPRADORES' AS NIVEL_3, 0 AS VALOR FROM ( " +
            " SELECT DISTINCT Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO FROM  " +
            " (SELECT PERIODO PERIODO_C, DOCUMENTO, CASE WHEN SEGMENTO IN ('FACULTATIVOS', 'INDEPENDIENTES', 'PENSIONADOS', 'OTROS') THEN '5. OTROS' ELSE SEGMENTO END AS SEGMENTO " +
            " FROM \"logical.data::T_COR_STG_LAE\" WHERE TIPO_TERCERO = 'TRABAJADORES' " +
            " AND EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) " +
            " AND NIVEL_2 <> 'SUBSIDIOS Y FONDOS' " +
            " ) Z INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " +
            " (SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) )A LEFT JOIN " +
            " (SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) B ON ANIO = ANIO_B  " +
            " AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO_C = Y.PERIODO_B ) C  WHERE PERIODO_A = '" + mPeriod + "' " +
            " GROUP BY PERIODO_A, SEGMENTO ORDER BY PERIODO_A, SEGMENTO );";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentAfiliadosTotal(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
    sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR, BASE_PARTICIPACION) ( " +
            " SELECT PERIODO_A PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            " COUNT(*) AS CANTIDAD, '2. AFILIADOS COMPRADORES' AS NIVEL_3, 0 AS VALOR, COUNT(*) AS BASE_PARTICIPACION FROM ( " +
            " SELECT DISTINCT Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO FROM  " +
            " (SELECT PERIODO PERIODO_C, DOCUMENTO, 'TOTAL' AS SEGMENTO " +
            " FROM \"logical.data::T_COR_STG_LAE\" WHERE TIPO_TERCERO = 'TRABAJADORES' " +
            " AND EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) " +
            " AND NIVEL_2 <> 'SUBSIDIOS Y FONDOS' " +
            " AND SEGMENTO NOT IN ('FACULTATIVOS', 'INDEPENDIENTES', 'PENSIONADOS', 'OTROS', '5. OTROS') " +
            " ) Z INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " +
            " (SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) )A LEFT JOIN " +
            " (SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) B ON ANIO = ANIO_B  " +
            " AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO_C = Y.PERIODO_B ) C  WHERE PERIODO_A = '" + mPeriod + "' " +
            " GROUP BY PERIODO_A, SEGMENTO ORDER BY PERIODO_A, SEGMENTO );";

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
            " SELECT PERIODO_A PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            " COUNT(*) AS CANTIDAD, '2. AFILIADOS COMPRADORES' AS NIVEL_3, 0 AS VALOR, COUNT(*) AS BASE_PARTICIPACION FROM ( " +
            " SELECT DISTINCT Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO FROM  " +
            " (SELECT PERIODO PERIODO_C, DOCUMENTO, 'TOTAL+OTROS' AS SEGMENTO " +
            " FROM \"logical.data::T_COR_STG_LAE\" WHERE TIPO_TERCERO = 'TRABAJADORES' " +
            " AND EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) " +
            " AND NIVEL_2 <> 'SUBSIDIOS Y FONDOS' " +
            " ) Z INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " +
            " (SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) )A LEFT JOIN " +
            " (SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) B ON ANIO = ANIO_B  " +
            " AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO_C = Y.PERIODO_B ) C  WHERE PERIODO_A = '" + mPeriod + "' " +
            " GROUP BY PERIODO_A, SEGMENTO ORDER BY PERIODO_A, SEGMENTO );";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}



function deleteContentPartIndividual(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_AFILIADOS\" " +
        	" WHERE NIVEL_3 NOT IN ('% PEN.', '1. AFILIADOS A LA CAJA', '1. AFILIADOS A CAJA', '2. AFILIADOS COMPRADORES', " +
        	" 'CANT. EMPRESAS', 'CANT. TRABAJADORES', 'NO DEPENDIENTES', 'REMANENTE $', 'TOTAL') " +
        	" AND PERIODO = '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(sql));
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentPartIndividual(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) ( " +
            " SELECT PERIODO_A PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            " COUNT(*) AS CANTIDAD, NIVEL_3, SUM(INGRESO_REAL) AS VALOR FROM ( " +
            " SELECT Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO, Z.NIVEL_3, SUM(INGRESO_REAL) AS INGRESO_REAL FROM  " +
            " ( " +
            "    SELECT PERIODO PERIODO_C, DOCUMENTO, CASE WHEN SEGMENTO IN ('FACULTATIVOS', 'INDEPENDIENTES', 'PENSIONADOS', 'OTROS') THEN '5. OTROS' ELSE SEGMENTO END AS SEGMENTO,  " +
            "    CASE WHEN NIVEL_1 IN ('TEATRO','BIBLIOTECAS','CULTURA','OTROS PROGRAMAS EDUCATIVOS') THEN 'TEATRO Y CULTURA' " +
            "    WHEN NIVEL_1 IN ('PRODUCTOS PREFERENCIALES') THEN 'SALUD IPS' " +
            "    WHEN NIVEL_1 IN ('BLOC','CANTU','CONCEPTA','TACTICA') THEN 'NUEVOS NEGOCIOS RYT' " +
            "    WHEN NIVEL_1 IN ('BENEFICIOS DE GESTIÓN','PROYECTOS PROPIOS') THEN 'VIVIENDA' " +
            "    ELSE NIVEL_1 END AS NIVEL_3, INGRESO_REAL " +
            "    FROM \"logical.data::T_COR_STG_LAE\" WHERE TIPO_TERCERO = 'TRABAJADORES' " +
            "    AND EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) " +
            "    AND NIVEL_2 <> 'SUBSIDIOS Y FONDOS' " +
            " ) Z INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " +
            " (SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) )A LEFT JOIN " +
            " (SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) B ON ANIO = ANIO_B  " +
            " AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO_C = Y.PERIODO_B  " +
            " GROUP BY Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO, Z.NIVEL_3 " +
            " ) C WHERE PERIODO_A = '" + mPeriod + "' " +
            " GROUP BY PERIODO_A, SEGMENTO, NIVEL_3 ORDER BY PERIODO_A, SEGMENTO, NIVEL_3 " +
            " );";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentPartIndTotal(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) ( " +
            " SELECT PERIODO_A PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            " COUNT(*) AS CANTIDAD, NIVEL_3, SUM(INGRESO_REAL) AS VALOR FROM ( " +
            " SELECT Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO, Z.NIVEL_3, SUM(INGRESO_REAL) AS INGRESO_REAL FROM  " +
            " ( " +
            "    SELECT PERIODO PERIODO_C, DOCUMENTO, 'TOTAL' AS SEGMENTO,  " +
            "    CASE WHEN NIVEL_1 IN ('TEATRO','BIBLIOTECAS','CULTURA','OTROS PROGRAMAS EDUCATIVOS') THEN 'TEATRO Y CULTURA' " +
            "    WHEN NIVEL_1 IN ('PRODUCTOS PREFERENCIALES') THEN 'SALUD IPS' " +
            "    WHEN NIVEL_1 IN ('BLOC','CANTU','CONCEPTA','TACTICA') THEN 'NUEVOS NEGOCIOS RYT' " +
            "    WHEN NIVEL_1 IN ('BENEFICIOS DE GESTIÓN','PROYECTOS PROPIOS') THEN 'VIVIENDA' " +
            "    ELSE NIVEL_1 END AS NIVEL_3, INGRESO_REAL " +
            "    FROM \"logical.data::T_COR_STG_LAE\" WHERE TIPO_TERCERO = 'TRABAJADORES' " +
            "    AND EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) " +
            "    AND NIVEL_2 <> 'SUBSIDIOS Y FONDOS' " +
            "    AND SEGMENTO NOT IN ('FACULTATIVOS', 'INDEPENDIENTES', 'PENSIONADOS', 'OTROS', '5. OTROS') " +
            " ) Z INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " +
            " (SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) )A LEFT JOIN " +
            " (SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) B ON ANIO = ANIO_B  " +
            " AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO_C = Y.PERIODO_B  " +
            " GROUP BY Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO, Z.NIVEL_3 " +
            " ) C WHERE PERIODO_A = '" + mPeriod + "' " +
            " GROUP BY PERIODO_A, SEGMENTO, NIVEL_3 ORDER BY PERIODO_A, SEGMENTO, NIVEL_3 " +
            " );";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentPartIndTotalO(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR) ( " +
            " SELECT PERIODO_A PERIODO, SEGMENTO, 0 AS PARTICIPACION, CAST('INGRESOS POR LÍNEA DE ACCIÓN ESTRATÉGICA' AS NVARCHAR) AS TIPO_ANALISIS, " +
            " COUNT(*) AS CANTIDAD, NIVEL_3, SUM(INGRESO_REAL) AS VALOR FROM ( " +
            " SELECT Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO, Z.NIVEL_3, SUM(INGRESO_REAL) AS INGRESO_REAL FROM  " +
            " ( " +
            "    SELECT PERIODO PERIODO_C, DOCUMENTO, 'TOTAL+OTROS' AS SEGMENTO,  " +
            "    CASE WHEN NIVEL_1 IN ('TEATRO','BIBLIOTECAS','CULTURA','OTROS PROGRAMAS EDUCATIVOS') THEN 'TEATRO Y CULTURA' " +
            "    WHEN NIVEL_1 IN ('PRODUCTOS PREFERENCIALES') THEN 'SALUD IPS' " +
            "    WHEN NIVEL_1 IN ('BLOC','CANTU','CONCEPTA','TACTICA') THEN 'NUEVOS NEGOCIOS RYT' " +
            "    WHEN NIVEL_1 IN ('BENEFICIOS DE GESTIÓN','PROYECTOS PROPIOS') THEN 'VIVIENDA' " +
            "    ELSE NIVEL_1 END AS NIVEL_3, INGRESO_REAL " +
            "    FROM \"logical.data::T_COR_STG_LAE\" WHERE TIPO_TERCERO = 'TRABAJADORES' " +
            "    AND EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) " +
            "    AND NIVEL_2 <> 'SUBSIDIOS Y FONDOS' " +
            " ) Z INNER JOIN (SELECT PERIODO_A, PERIODO_B FROM " +
            " (SELECT DISTINCT PERIODO PERIODO_A, EXTRACT(YEAR FROM PERIODO) AS ANIO FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) )A LEFT JOIN " +
            " (SELECT DISTINCT PERIODO PERIODO_B, EXTRACT(YEAR FROM PERIODO) AS ANIO_B FROM \"logical.data::T_COR_STG_LAE\" " +
            " WHERE EXTRACT(YEAR FROM PERIODO) = EXTRACT(YEAR FROM CAST('" + mPeriod + "' AS DATE)) ) B ON ANIO = ANIO_B  " +
            " AND PERIODO_B <= PERIODO_A) Y ON Z.PERIODO_C = Y.PERIODO_B  " +
            " GROUP BY Y.PERIODO_A, Z.DOCUMENTO, Z.SEGMENTO, Z.NIVEL_3 " +
            " ) C WHERE PERIODO_A = '" + mPeriod + "' " +
            " GROUP BY PERIODO_A, SEGMENTO, NIVEL_3 ORDER BY PERIODO_A, SEGMENTO, NIVEL_3 " +
            " );";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function updateContentPartIndividual(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
    sql = "UPDATE \"logical.data::T_COR_AFILIADOS\" as T1  " +
            "    SET BASE_PARTICIPACION = (SELECT SUM(T2.CANTIDAD) FROM \"logical.data::T_COR_AFILIADOS\" as T2  " +
            "    WHERE T1.PERIODO = T2.PERIODO AND T1.SEGMENTO = T2.SEGMENTO " +
            "    AND T2.NIVEL_3 = '1. AFILIADOS A LA CAJA' AND T2.PERIODO = '" + mPeriod + "' ) " +
            "    WHERE T1.NIVEL_3 NOT IN ('% PEN.', '1. AFILIADOS A LA CAJA', '2. AFILIADOS COMPRADORES', 'CANT. EMPRESAS', 'CANT. TRABAJADORES',  " +
            "    'NO DEPENDIENTES', 'REMANENTE $', 'TOTAL', '1. AFILIADOS A CAJA') AND T1.PERIODO = '" + mPeriod + "'; ";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function updateContentPartIndividualO(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
    sql = "UPDATE \"logical.data::T_COR_AFILIADOS\" as T1  " +
            "    SET BASE_PARTICIPACION = (SELECT SUM(T2.CANTIDAD) FROM \"logical.data::T_COR_AFILIADOS\" as T2  " +
            "    WHERE T1.PERIODO = T2.PERIODO AND T1.SEGMENTO = T2.SEGMENTO " +
            "    AND T2.NIVEL_3 = '1. AFILIADOS A CAJA' AND T2.PERIODO = '" + mPeriod + "' ) " +
            "    WHERE T1.NIVEL_3 NOT IN ('% PEN.', '1. AFILIADOS A LA CAJA', '2. AFILIADOS COMPRADORES', 'CANT. EMPRESAS',  " +
            "    'CANT. TRABAJADORES', 'NO DEPENDIENTES', 'REMANENTE $', 'TOTAL', '1. AFILIADOS A CAJA') " +
            "    AND T1.SEGMENTO NOT IN ('TOTAL') AND T1.PERIODO = '" + mPeriod + "'; ";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function deleteContentTotales(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_AFILIADOS\" " +
	" WHERE NIVEL_3 = 'TOTAL' " +
	" AND PERIODO = '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function deleteContentPenetracion(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_COR_AFILIADOS\" " +
	" WHERE NIVEL_3 = '% PEN.' " +
	" AND PERIODO = '" + mPeriod + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertContentPenetracion(mPeriod){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "INSERT INTO \"logical.data::T_COR_AFILIADOS\" (PERIODO, SEGMENTO, PARTICIPACION, TIPO_ANALISIS, CANTIDAD, NIVEL_3, VALOR, BASE_PARTICIPACION) ( " +
            " SELECT A.PERIODO, A.SEGMENTO, 0 AS PARTICIPACION, A.TIPO_ANALISIS, B.CANTIDAD_COMPRADORES AS CANTIDAD, '% PEN.' AS NIVEL_3, 0 AS VALOR, " +
            " A.CANTIDAD_AFILIADOS AS BASE_PARTICIPACION FROM " +
            " ( " +
            "  SELECT PERIODO, SEGMENTO, TIPO_ANALISIS, CANTIDAD AS CANTIDAD_AFILIADOS " +
            "  FROM \"logical.data::T_COR_AFILIADOS\" " +
            "  WHERE NIVEL_3 = '1. AFILIADOS A LA CAJA' " +
            "  AND PERIODO = '" + mPeriod + "' " +
            " UNION " +
            "  SELECT PERIODO, SEGMENTO, TIPO_ANALISIS, CANTIDAD AS CANTIDAD_COMPRADORES " +
            "  FROM \"logical.data::T_COR_AFILIADOS\" " +
            "  WHERE NIVEL_3 = 'NO DEPENDIENTES' " +
            "  AND PERIODO = '" + mPeriod + "' " +
            " UNION " +
            "  SELECT PERIODO, SEGMENTO, TIPO_ANALISIS, CANTIDAD AS CANTIDAD_AFILIADOS  " +
            "  FROM \"logical.data::T_COR_AFILIADOS\"  " +
            "  WHERE NIVEL_3 = '1. AFILIADOS A CAJA'  " +
            "  AND PERIODO = '" + mPeriod + "'  " +
            "  AND SEGMENTO = 'TOTAL+OTROS' " +
            " ) A INNER JOIN  " +
            " ( " +
            " SELECT PERIODO, SEGMENTO, TIPO_ANALISIS, CANTIDAD AS CANTIDAD_COMPRADORES " +
            " FROM \"logical.data::T_COR_AFILIADOS\" " +
            " WHERE NIVEL_3 = '2. AFILIADOS COMPRADORES' " +
            " AND PERIODO = '" + mPeriod + "' " +
            " ) B ON A.PERIODO = B.PERIODO AND A.SEGMENTO=B.SEGMENTO AND A.TIPO_ANALISIS=B.TIPO_ANALISIS " +
            " );";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}



function init(){
    let mResponse = {}; let mData = {};
    
	try {
        var mPeriod = oUtil.getLastMonth();
        //var mPeriod = '2021-10-01';
        
        deleteContentData(mPeriod);
        insertContentData(mPeriod);

        insertContentAfiliadosTotal(mPeriod);
        insertContentAfiliadosTotalO(mPeriod);
    
        deleteContentPartIndividual(mPeriod);
        insertContentPartIndividual(mPeriod);
        insertContentPartIndTotal(mPeriod);
        insertContentPartIndTotalO(mPeriod);
        updateContentPartIndividual(mPeriod);
        updateContentPartIndividualO(mPeriod);
        
        deleteContentPenetracion(mPeriod);
        insertContentPenetracion(mPeriod);
        
        //BORRAR POSTACTUALIZACION
        //deleteContentTotales(mPeriod);
        
        mResponse.code = 1;
        mResponse.data = mData;
        mResponse.message = "Transaction completed";
        
		
	} catch (ex){
		mResponse.code = 3;
		mResponse.data = mError;
		mResponse.message = ex.message;
	}
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}


init();
