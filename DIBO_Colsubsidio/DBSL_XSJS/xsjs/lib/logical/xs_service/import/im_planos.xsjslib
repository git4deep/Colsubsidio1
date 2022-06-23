let oService = $.import("logical.model.bw", "service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");

function executeSQL(sql){
    let conn = $.db.getConnection();
    let pstmt;

    pstmt = conn.prepareStatement(sql);
    
    pstmt.execute();
    conn.commit();
    
    pstmt.close();    
    conn.close();
}

function exportData(mImport){
    
    var sType = "";
    var sqlDelete = "SELECT 1 FROM DUMMY;";
    var sqlInsert = "SELECT 1 FROM DUMMY;";
    //var mPeriod = oUtil.getLastMonth();
    var mPeriod = '2021-07-01';
    
    if (mImport.table === 'logical.data::T_COR_EGRESO_PLANO') {
        sqlDelete = "DELETE FROM \"logical.data::T_COR_EGRESO\" " +
                " WHERE PERIODO >= '" + mPeriod + "' AND ID_SERVICIO = '11'; ";
        
        sqlInsert = "INSERT INTO \"logical.data::T_COR_EGRESO\" " +
                "(PERIODO,EGRESO_PPTO,EGRESO_REAL,EGRESO_REAL_AN,ID_CAJA,ID_GRUPO_LINEA_ACCION,ID_SERVICIO,NIVEL_1,NIVEL_2,TIPO, " +
                " TIPO_ANALISIS) " +
                "( " +
                "   SELECT " +
                "   PERIODO,EGRESO_PPTO,EGRESO_REAL,EGRESO_REAL_AN,ID_CAJA,ID_GRUPO_LINEA_ACCION,ID_SERVICIO, " +
                "   CAST(CASE WHEN NIVEL_1 = 'T�CNICOS Y TECN�LOGOS' THEN 'TÉCNICOS Y TECNÓLOGOS' ELSE NIVEL_1 END AS NCLOB) AS NIVEL_1, " +
                "   CAST(CASE WHEN NIVEL_2 = 'T�CNICOS Y TECN�LOGOS' THEN 'TÉCNICOS Y TECNÓLOGOS' ELSE NIVEL_2 END AS NCLOB) AS NIVEL_2, " +
                "   TIPO,TIPO_ANALISIS " +
                "   FROM \"logical.data::T_COR_EGRESO_PLANO\" " +
                "   WHERE PERIODO >= '" + mPeriod + "' " +
                "); ";
    }
    
    if (mImport.table === 'logical.data::T_COR_FONDO_CREDITO_PLANO') {
        sqlDelete = "DELETE FROM \"logical.data::T_COR_FONDO_CREDITO\" " +
                " WHERE PERIODO = '" + mPeriod + "' " +
                " AND CONCEPTO = 'RECURSOS PROPIOS'; ";
        
        sqlInsert = "INSERT INTO \"logical.data::T_COR_FONDO_CREDITO\" (PERIODO, ID_SERVICIO, TIPO_ANALISIS, CONCEPTO, VALOR) " +
                "( " +
                "   SELECT PERIODO, ID_SERVICIO, CAST('TV - CRÉDITO' AS NCLOB) AS TIPO_ANALISIS, CONCEPTO, VALOR " +
                "   FROM \"logical.data::T_COR_FONDO_CREDITO_PLANO\" " +
                "   WHERE PERIODO = '" + mPeriod + "' " +
                "); ";
    }
    
    if (mImport.table === 'logical.data::T_COR_FONDOS_PLANO') {
        
        sqlDelete = "DELETE FROM \"logical.data::T_COR_FONDOS\" " +
                " WHERE PERIODO >= '" + mPeriod + "' " +
                " AND TIPO = 'PLANO'; ";
        
        sqlInsert = "INSERT INTO \"logical.data::T_COR_FONDOS\" (PERIODO,TIPO_FONDO,DESCRIPCION,ACTUAL_PPTO,ASIGNACIONES, " +
                " RECURSOS_DISPONIBLES,SALDOS,TIPO) " +
                "( " +
                "    SELECT PERIODO, CAST(CASE WHEN TIPO_FONDO = 'FONI�EZ' THEN 'FONIÑEZ' ELSE TIPO_FONDO END AS NCLOB) AS TIPO_FONDO, " +
                "    CAST( " +
                "        CASE WHEN DESCRIPCION = 'RECURSOS ASIGNACI�N DE SUBSIDIOS' THEN 'RECURSOS ASIGNACIÓN DE SUBSIDIOS' " +
                "        WHEN DESCRIPCION = 'RECURSOS CR�DITO HIPOTECARIO' THEN 'RECURSOS CRÉDITO HIPOTECARIO' " +
                "        WHEN DESCRIPCION = 'RECURSOS PROMOCI�N Y OFERTA' THEN 'RECURSOS PROMOCIÓN Y OFERTA' " +
                "        WHEN DESCRIPCION = 'ATENCI�N INTEGRAL A LA NI�EZ' THEN 'ATENCIÓN INTEGRAL A LA NIÑEZ'   "  +
                "        WHEN DESCRIPCION = 'CAPACITACI�N - 29.5% (20% - 30%)' THEN 'CAPACITACIÓN - 29.5% (20% - 30%)' " +
                "        WHEN DESCRIPCION = 'SISTEMA DE INFORMACI�N -1% (0% - 1%)' THEN 'SISTEMA DE INFORMACIÓN - 1% (0% - 1%)' " +
                "        WHEN DESCRIPCION = 'BENEFICIOS ECON�MICOS - 43% (40% - 55%)' THEN 'BENEFICIOS ECONÓMICOS - 43% (40% - 55%)' " +
                "        WHEN DESCRIPCION = 'SALDO (APORTES - APROPIACI�N)' THEN 'SALDO (APORTES - APROPIACIÓN)'" +
                "        WHEN DESCRIPCION = 'CAPACITACI�N' THEN 'CAPACITACIÓN' " +
                "        WHEN DESCRIPCION = 'SISTEMA DE INFORMACI�N' THEN 'SISTEMA DE INFORMACIÓN' " +
                "        WHEN DESCRIPCION = 'BENEFICIOS ECON�MICOS' THEN 'BENEFICIOS ECONÓMICOS' " +
                "    ELSE DESCRIPCION END AS NCLOB) AS DESCRIPCION, " +
                "    ACTUAL_PPTO, ASIGNACIONES, RECURSOS_DISPONIBLES, SALDOS, 'PLANO' AS TIPO " +
                "    FROM \"logical.data::T_COR_FONDOS_PLANO\" " +
                "    WHERE PERIODO >= '" + mPeriod + "' " +
                "); ";
    }
    
    if (mImport.table === 'logical.data::T_COR_INGRESO_CET') {
        
        sType = "CET_FIN";
        sqlDelete = "DELETE FROM \"logical.data::T_COR_INGRESO\" " +
                " WHERE PERIODO >= '" + mPeriod + "' AND TIPO_INGRESO = '" + sType + "'; ";
        
        sqlInsert = "INSERT INTO \"logical.data::T_COR_INGRESO\" " +
                "(PERIODO, INGRESO_PPTO, INGRESO_REAL, INGRESO_REAL_AN, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, NIVEL_1, " +
                " NIVEL_2, TIPO, TIPO_TERCERO, SEGMENTO, TERCERO, PARTICIPACION, CANTIDAD_HABITACIONES, OCUPACION_HABITACIONES, " +
                " TIPO_ANALISIS, VENTA, VENTA_ANTERIOR, VENTA_PPTO, CANTIDAD, CANTIDAD_ANTERIOR, TMS_ACTUAL, TMS_ANTERIOR, " + 
                " TIPO_INGRESO, BASE_PARTICIPACION ) " +
                "( " + 
                "    SELECT PERIODO,INGRESO_PPTO,INGRESO_REAL,INGRESO_REAL_AN,ID_CAJA,ID_GRUPO_LINEA_ACCION,ID_SERVICIO, " + 
                "    CAST(CASE WHEN NIVEL_1 = 'T�CNICOS Y TECN�LOGOS' THEN 'TÉCNICOS Y TECNÓLOGOS' ELSE NIVEL_1 END AS NCLOB) AS NIVEL_1, " + 
                "    CAST(CASE WHEN NIVEL_2 = 'T�CNICOS Y TECN�LOGOS' THEN 'TÉCNICOS Y TECNÓLOGOS' ELSE NIVEL_2 END AS NCLOB) AS NIVEL_2, " + 
                "    TIPO,TIPO_TERCERO,SEGMENTO,TERCERO,PARTICIPACION,CANTIDAD_HABITACIONES,OCUPACION_HABITACIONES,TIPO_ANALISIS,VENTA, " +
                "    VENTA_ANTERIOR,VENTA_PPTO,CANTIDAD,CANTIDAD_ANTERIOR, TMS_ACTUAL,TMS_ANTERIOR,TIPO_INGRESO,BASE_PARTICIPACION  " + 
                "    FROM \"logical.data::T_COR_INGRESO_CET\"  " + 
                "    WHERE PERIODO >= '" + mPeriod + "' " +
                "    ORDER BY PERIODO " + 
                "); ";
    }
    if (mImport.table === 'logical.data::T_COR_INGRESO_PLANO') {
        
        sType = "'OTRA_CAJAS', 'OTRA_COLSU', 'RESU_CAJAS'";
        sqlDelete = "DELETE FROM \"logical.data::T_COR_INGRESO\" " +
                " WHERE PERIODO >= '" + mPeriod + "' AND TIPO_INGRESO IN (" + sType + "); ";
        
        sqlInsert = "INSERT INTO \"logical.data::T_COR_INGRESO\" " +
                "(PERIODO, INGRESO_PPTO, INGRESO_REAL, INGRESO_REAL_AN, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, NIVEL_1, NIVEL_2, " +
                "TIPO, TIPO_TERCERO, SEGMENTO, TERCERO, PARTICIPACION, CANTIDAD_HABITACIONES, OCUPACION_HABITACIONES, TIPO_ANALISIS, VENTA, " +
                "VENTA_ANTERIOR, VENTA_PPTO, CANTIDAD, CANTIDAD_ANTERIOR, TMS_ACTUAL, TMS_ANTERIOR, TIPO_INGRESO, BASE_PARTICIPACION ) " +
                "( " +
                "    SELECT " +
                "    PERIODO, INGRESO_PPTO, INGRESO_REAL, INGRESO_REAL_AN, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, NIVEL_1,  " +
                "    NIVEL_2, TIPO, TIPO_TERCERO, SEGMENTO, TERCERO, PARTICIPACION, CANTIDAD_HABITACIONES, OCUPACION_HABITACIONES, " +
                "    TIPO_ANALISIS, VENTA, VENTA_ANTERIOR, VENTA_PPTO, CANTIDAD, CANTIDAD_ANTERIOR, TMS_ACTUAL, TMS_ANTERIOR, " +
                "    TIPO_INGRESO, BASE_PARTICIPACION " +
                "    FROM \"logical.data::T_COR_INGRESO_PLANO\" " +
                "    WHERE PERIODO >= '" + mPeriod + "' " +
                "    AND TIPO_INGRESO IN (" + sType + ") " +
                "); ";
    }
    
    executeSQL(sqlDelete);
    executeSQL(sqlInsert);
}