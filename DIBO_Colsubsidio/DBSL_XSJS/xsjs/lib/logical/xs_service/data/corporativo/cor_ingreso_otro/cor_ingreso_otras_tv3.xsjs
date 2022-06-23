let oService = $.import("logical.model.bw", "service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");
let oCorIncome = $.import("logical.xs_service.data.cor_ingreso", "cor_ingreso");

function insertContentData(mPeriod, sType){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql =  "INSERT INTO \"logical.data::T_COR_INGRESO\"  " +
    " SELECT PERIODO, SUM(INGRESO_PPTO) INGRESO_PPTO, SUM(INGRESO_REAL) INGRESO_REAL, " + 
    " SUM(INGRESO_REAL_ANT) INGRESO_REAL_ANT, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, " + 
    " NIVEL_1, " + 
    " NIVEL_2, " + 
    " TIPO,  " + 
    " TIPO_TERCERO, " + 
    " SEGMENTO, " + 
    " TERCERO, " + 
    " SUM(PARTICIPACION) PARTICIPACION, " + 
    " SUM(CANTIDAD_HABITACIONES) CANTIDAD_HABITACIONES, " + 
    " SUM(OCUPACION_HABITACIONES) OCUPACION_HABITACIONES, " + 
    " TIPO_ANALISIS, " + 
    " SUM(VENTA) VENTA, " + 
    " SUM(VENTA_ANTERIOR) VENTA_ANTERIOR, " + 
    " SUM(VENTA_PPTO) VENTA_PPTO, " + 
    " SUM(CANTIDAD) CANTIDAD, " + 
    " SUM(CANTIDAD_ANTERIOR) CANTIDAD_ANTERIOR, " + 
    " SUM(TMS_ACTUAL) TMS_ACTUAL, " + 
    " SUM(TMS_ANTERIOR) TMS_ANTERIOR, " + 
    " TIPO_INGRESO, " + 
    " 0 BASE_PARTICIPACION " + 
    " FROM ( " + 
    " 	SELECT A.PERIODO, 0 INGRESO_PPTO, SUM(A.INGRESO_REAL) INGRESO_REAL, 0 INGRESO_REAL_ANT, '22' ID_CAJA,  " + 
    " 	1 ID_GRUPO_LINEA_ACCION, " + 
    " 	'16' ID_SERVICIO,  " + 
    " 	'0' NIVEL_1, " + 
    " 	'0' NIVEL_2, " + 
    " 	'0' TIPO, " + 
    " 	CASE WHEN A.ID_SERVICIO = 'COAP' THEN '1' " + 
    " 		 WHEN A.ID_SERVICIO IN ('CORT','COVD','COCS','COAB','COEC') THEN '4' " + 
    " 		 WHEN A.ID_SERVICIO = 'COAD' OR NIVEL_1 = 'OTROS INGRESOS' THEN '11' " + 
    " 		 WHEN A.ID_SERVICIO = 'COIP' AND TIPO_ANALISIS = 'TV - IPS' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'INSTITUCIONAL' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMS' THEN '3'  " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'COMERCIAL' THEN '3' " + 
    " 		 ELSE A.ID_SERVICIO " + 
    " 	END TIPO_TERCERO, " + 
    " 	'0' SEGMENTO, " + 
    " 	'0' TERCERO, " + 
    " 	0 PARTICIPACION, " + 
    " 	0 CANTIDAD_HABITACIONES, " + 
    " 	0 OCUPACION_HABITACIONES, " + 
    " 	'OTRAS CAJAS' TIPO_ANALISIS, " + 
    " 	0 VENTA, " + 
    " 	0 VENTA_ANTERIOR, " + 
    " 	0 VENTA_PPTO, " + 
    " 	0 CANTIDAD, " + 
    " 	0 CANTIDAD_ANTERIOR, " + 
    " 	0 TMS_ACTUAL, " + 
    " 	0 TMS_ANTERIOR, " + 
    " 	'" + sType + "' TIPO_INGRESO, " + 
    " 	0 BASE_PARTICIPACION " + 
    " 	FROM \"logical.data::T_COR_INGRESO\" A " + 
    " 	WHERE (A.TIPO_INGRESO LIKE '%_FIN' OR (ID_SERVICIO = 'COIP' AND TIPO_ANALISIS = 'TV - IPS')) AND A.ID_SERVICIO LIKE 'CO%' " + 
    " 	GROUP BY A.PERIODO,  " + 
    " 	CASE WHEN A.ID_SERVICIO = 'COAP' THEN '1' " + 
    " 		 WHEN A.ID_SERVICIO IN ('CORT','COVD','COCS','COAB','COEC') THEN '4' " + 
    " 		 WHEN A.ID_SERVICIO = 'COAD' OR NIVEL_1 = 'OTROS INGRESOS' THEN '11' " + 
    " 		 WHEN A.ID_SERVICIO = 'COIP' AND TIPO_ANALISIS = 'TV - IPS' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'INSTITUCIONAL' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMS' THEN '3'  " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'COMERCIAL' THEN '3' " + 
    " 		 ELSE A.ID_SERVICIO " + 
    " 	END " + 
    " 	UNION ALL " + 
    " 	SELECT ADD_MONTHS(A.PERIODO,12), 0 INGRESO_PPTO, 0 INGRESO_REAL, SUM(A.INGRESO_REAL) INGRESO_REAL_ANT, '22' ID_CAJA,  " + 
    " 	1 ID_GRUPO_LINEA_ACCION, " + 
    " 	'16' ID_SERVICIO,  " + 
    " 	'0' NIVEL_1, " + 
    " 	'0' NIVEL_2, " + 
    " 	'0' TIPO, " + 
    " 	CASE WHEN A.ID_SERVICIO = 'COAP' THEN '1' " + 
    " 		 WHEN A.ID_SERVICIO IN ('CORT','COVD','COCS','COAB','COEC') THEN '4' " + 
    " 		 WHEN A.ID_SERVICIO = 'COAD' OR NIVEL_1 = 'OTROS INGRESOS' THEN '11' " + 
    " 		 WHEN A.ID_SERVICIO = 'COIP' AND TIPO_ANALISIS = 'TV - IPS' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'INSTITUCIONAL' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMS' THEN '3'  " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'COMERCIAL' THEN '3' " + 
    " 		 ELSE A.ID_SERVICIO " + 
    " 	END TIPO_TERCERO, " + 
    " 	'0' SEGMENTO, " + 
    " 	'0' TERCERO, " + 
    " 	0 PARTICIPACION, " + 
    " 	0 CANTIDAD_HABITACIONES, " + 
    " 	0 OCUPACION_HABITACIONES, " + 
    " 	'OTRAS CAJAS' TIPO_ANALISIS, " + 
    " 	0 VENTA, " + 
    " 	0 VENTA_ANTERIOR, " + 
    " 	0 VENTA_PPTO, " + 
    " 	0 CANTIDAD, " + 
    " 	0 CANTIDAD_ANTERIOR, " + 
    " 	0 TMS_ACTUAL, " + 
    " 	0 TMS_ANTERIOR, " + 
    " 	'" + sType + "' TIPO_INGRESO, " + 
    " 	0 BASE_PARTICIPACION " + 
    " 	FROM \"logical.data::T_COR_INGRESO\" A " + 
    " 	WHERE (A.TIPO_INGRESO LIKE '%_FIN' OR (ID_SERVICIO = 'COIP' AND TIPO_ANALISIS = 'TV - IPS')) AND A.ID_SERVICIO LIKE 'CO%' " + 
    " 	GROUP BY ADD_MONTHS(A.PERIODO,12), " + 
    " 	CASE WHEN A.ID_SERVICIO = 'COAP' THEN '1' " + 
    " 		 WHEN A.ID_SERVICIO IN ('CORT','COVD','COCS','COAB','COEC') THEN '4' " + 
    " 		 WHEN A.ID_SERVICIO = 'COAD' OR NIVEL_1 = 'OTROS INGRESOS' THEN '11' " + 
    " 		 WHEN A.ID_SERVICIO = 'COIP' AND TIPO_ANALISIS = 'TV - IPS' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'INSTITUCIONAL' THEN '2' " + 
    " 		 WHEN A.ID_SERVICIO = 'COMS' THEN '3'  " + 
    " 		 WHEN A.ID_SERVICIO = 'COMD' AND NIVEL_1 = 'COMERCIAL' THEN '3' " + 
    " 		 ELSE A.ID_SERVICIO " + 
    " 	END " + 
    " ) " + 
    " WHERE PERIODO = '" + mPeriod + "' " + 
    " GROUP BY PERIODO, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO,  " + 
    " NIVEL_1, " + 
    " NIVEL_2, " + 
    " TIPO, " + 
    " TIPO_TERCERO, " + 
    " SEGMENTO, " + 
    " TERCERO, " + 
    " ID_SERVICIO, " + 
    " TIPO_ANALISIS, " + 
    " TIPO_INGRESO, " + 
    " BASE_PARTICIPACION" + 
    " ORDER BY TIPO_TERCERO, PERIODO";

	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function getMetadata(){
    var mLog = {};
    
    /*PARAMETROS PARA TV3 OTRAS CAJAS*/
    /*ID_GRUPO_LINEA_ACCION = 1*/
    /*TIPO_TERCERO = 1 / 2 / 3 / 4 / 11 */
    /*ID_SERVICIO = 16 */
    /* TIPO_INGRESO = OTRA_COLSU / COLSUBSIDIO */
    /* TIPO_INGRESO = OTRA_CAJAS / OTRAS */
    var sType = "OTRA_COLSU";
    
    var mPeriod = oUtil.getLastMonth();
    //var mPeriod = oUtil.getPenultimateMonth();
    //var mPeriod = '2021-04-01';
    
    //SET LOG 
    mLog.ENTITY = 'OTRAS_CAJAS_TV3';
    mLog.SET = sType + '?' + mPeriod;
    mLog.MESSAGE = "Transaction completed";
    

    try {
        oCorIncome.deleteIncomePeriod(mPeriod, sType);
        insertContentData(mPeriod, sType);
        oJob.insertJobLog(mLog);
    } catch (ex){
        mLog.MESSAGE = "Error en el SQL de Insercion";
        oJob.insertJobLog(mLog);
        return mLog;
    }

}

function init(){
    let mResponse = {}; let mData = {};
    
    try {
        var sData = $.request.parameters.get("data");
        let aData = getMetadata();
        
        if( aData ){
            mResponse.code = 2;
            mResponse.data = mData;
            mResponse.message = "ERROR";
        } else {
            mResponse.code = 1;
            mResponse.data = mData;
            mResponse.message = "Transaction completed";
        }
        
        sData = "true";
        
        if(sData === "true"){
            mResponse.data = aData;
        }
        
    } catch (ex){
        mResponse.code = 3;
        mResponse.data = {};
        mResponse.message = ex.message;
    }
    
    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify(mResponse));
}

init();

