let oService = $.import("logical.model.bw", "service");
let oUtil = $.import("logical.model.util", "util");
let oJob = $.import("logical.model.util", "job");

var mLog = {};
var mError = {};

function deleteIncomePeriod(sPeriod, sType){
    let conn = $.db.getConnection();
    let sql; let pstmt;
    
    sql = "DELETE FROM \"logical.data::T_COR_INGRESO\" WHERE PERIODO = '" + sPeriod + "' AND TIPO_INGRESO = '" + sType + "';";
    pstmt = conn.prepareStatement(sql);
    
    pstmt.execute();
    conn.commit();
    
    pstmt.close();    
    conn.close();
}

function deleteGreaterPeriod(sPeriod, sType){
    let conn = $.db.getConnection();
    let sql; let pstmt;
    
    sql = "DELETE FROM \"logical.data::T_COR_INGRESO\" WHERE PERIODO >= '" + sPeriod + "' AND TIPO_INGRESO = '" + sType + "';";
    pstmt = conn.prepareStatement(sql);
    
    pstmt.execute();
    conn.commit();
    
    pstmt.close();    
    conn.close();
}

function updateColumns(sPeriod, sType){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "UPDATE \"logical.data::T_COR_INGRESO\" as T1 " +
 	    " SET BASE_PARTICIPACION = (SELECT SUM(T2.INGRESO_REAL) FROM \"logical.data::T_COR_INGRESO\" as T2 " +
        " WHERE T1.TIPO_INGRESO = T2.TIPO_INGRESO AND T1.PERIODO = T2.PERIODO AND T1.TIPO_ANALISIS = T2.TIPO_ANALISIS " +
        " AND T2.PERIODO = '" + sPeriod + "' AND T2.TIPO_INGRESO = '" + sType + "' ) " +
        " WHERE T1.PERIODO = '" + sPeriod + "' AND T1.TIPO_INGRESO = '" + sType + "' ;";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertRows(aObjects, sType){
    let conn = $.db.getConnection();
    
    aObjects.forEach(function(mObject){
       // console.log(mObject);
        mError = mObject;
        
        let sql = "INSERT INTO \"logical.data::T_COR_INGRESO\" (PERIODO, ID_CAJA, ID_GRUPO_LINEA_ACCION, ID_SERVICIO, NIVEL_2, NIVEL_1, TIPO_ANALISIS, " + 
                                                                    "TIPO, TIPO_TERCERO, SEGMENTO, TERCERO, PARTICIPACION, INGRESO_REAL, INGRESO_PPTO, INGRESO_REAL_AN, " + 
                                                                    "VENTA, VENTA_ANTERIOR, VENTA_PPTO, CANTIDAD_HABITACIONES, OCUPACION_HABITACIONES, CANTIDAD, TMS_ACTUAL, " + 
                                                                    "TMS_ANTERIOR, CANTIDAD_ANTERIOR, TIPO_INGRESO) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
        
        let pstmt = conn.prepareStatement(sql);
        pstmt.setDate(1, mObject.PERIODO);
        //pstmt.setNString(2, mObject.ID_CAJA);
        //pstmt.setNString(3, mObject.ID_GRUPO_LINEA_ACCION);
        //pstmt.setNString(4, mObject.ID_SERVICIO);
        
        if ( mObject.ID_CAJA ) {
            pstmt.setNString(2, mObject.ID_CAJA);
        } else {
            pstmt.setNull(2);
        }
        
        if ( mObject.ID_GRUPO_LINEA_ACCION ) {
            pstmt.setNString(3, mObject.ID_GRUPO_LINEA_ACCION);
        } else {
            pstmt.setNull(3);
        }
        
        if ( mObject.ID_SERVICIO ) {
            pstmt.setNString(4, mObject.ID_SERVICIO);
        } else {
            pstmt.setNull(4);
        }
        
        if ( mObject.NIVEL_2 ) {
            pstmt.setNString(5, mObject.NIVEL_2);
        } else {
            pstmt.setNull(5);
        }
        
        if ( mObject.NIVEL_1 ) {
            pstmt.setNString(6, mObject.NIVEL_1);
        } else {
            pstmt.setNull(6);
        }
        
        if ( mObject.TIPO_ANALISIS ) {
            pstmt.setNString(7, mObject.TIPO_ANALISIS);
        } else {
            pstmt.setNull(7);
        }
        
        if ( mObject.TIPO ) {
            pstmt.setNString(8, mObject.TIPO);
        } else {
            pstmt.setNull(8);
        }
        
        if ( mObject.TIPO_TERCERO ) {
            pstmt.setNString(9, mObject.TIPO_TERCERO);
        } else {
            pstmt.setNull(9);
        }
        
        if ( mObject.SEGMENTO ) {
            pstmt.setNString(10, mObject.SEGMENTO);
        } else {
            pstmt.setNull(10);
        }
        
        if ( mObject.TERCERO ) {
            pstmt.setNString(11, mObject.TERCERO);
        } else {
            pstmt.setNull(11);
        }
        
        if ( mObject.PARTICIPACION ) {
            pstmt.setDecimal(12, oUtil._number(mObject.PARTICIPACION));
        } else {
            pstmt.setNull(12);
        }
        
        if ( mObject.INGRESO_REAL ) {
            pstmt.setDecimal(13, oUtil._number(mObject.INGRESO_REAL));
        } else {
            pstmt.setNull(13);
        }
        
        if ( mObject.INGRESO_PPTO ) {
            pstmt.setDecimal(14, oUtil._number(mObject.INGRESO_PPTO));
        } else {
            pstmt.setNull(14);
        }
        
        if ( mObject.INGRESO_REAL_AN ) {
            pstmt.setDecimal(15, oUtil._number(mObject.INGRESO_REAL_AN));
        } else {
            pstmt.setNull(15);
        }
        
        if ( mObject.VENTA ) {
            pstmt.setDecimal(16, oUtil._number(mObject.VENTA));
        } else {
            pstmt.setNull(16);
        }
        
        if ( mObject.VENTA_ANTERIOR ) {
            pstmt.setDecimal(17, oUtil._number(mObject.VENTA_ANTERIOR));
        } else {
            pstmt.setNull(17);
        }
        
        if ( mObject.VENTA_PPTO ) {
            pstmt.setDecimal(18, oUtil._number(mObject.VENTA_PPTO));
        } else {
            pstmt.setNull(18);
        }
        
        if ( mObject.CANTIDAD_HABITACIONES ) {
            pstmt.setDecimal(19, oUtil._number(mObject.CANTIDAD_HABITACIONES));
        } else {
            pstmt.setNull(19);
        }
        
        if ( mObject.OCUPACION_HABITACIONES ) {
            pstmt.setDecimal(20, oUtil._number(mObject.OCUPACION_HABITACIONES));
        } else {
            pstmt.setNull(20);
        }
        
        if ( mObject.CANTIDAD ) {
            pstmt.setDecimal(21, oUtil._number(mObject.CANTIDAD));
        } else {
            pstmt.setNull(21);
        }
        
        if ( mObject.TMS_ACTUAL ) {
            pstmt.setDecimal(22, oUtil._number(mObject.TMS_ACTUAL));
        } else {
            pstmt.setNull(22);
        }
        
        if ( mObject.TMS_ANTERIOR ) {
            pstmt.setDecimal(23, oUtil._number(mObject.TMS_ANTERIOR));
        } else {
            pstmt.setNull(23);
        }

        if ( mObject.CANTIDAD_ANTERIOR ) {
            pstmt.setDecimal(24, oUtil._number(mObject.CANTIDAD_ANTERIOR));
        } else {
            pstmt.setNull(24);
        }
        
        mObject.TIPO_INGRESO = sType;
        pstmt.setNString(25, mObject.TIPO_INGRESO);
       // console.log(pstmt);
        pstmt.execute();
        pstmt.close();
        
    });
    conn.commit();
    conn.close();
}

function updateColumnsPercent(sPeriod, sType){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "UPDATE \"logical.data::T_COR_INGRESO\" as T1 " +
 	    "SET BASE_PARTICIPACION = (SELECT SUM(T2.INGRESO_REAL) FROM \"logical.data::T_COR_INGRESO\" as T2 " +
        "WHERE T1.ID_SERVICIO = T2.ID_SERVICIO AND T1.PERIODO = T2.PERIODO AND T1.TIPO_ANALISIS = T2.TIPO_ANALISIS " +
        "AND T1.PERIODO = '" + sPeriod + "' AND T1.TIPO_INGRESO = '" + sType + "'" +
        ") WHERE T1.PERIODO = '" + sPeriod + "' AND T1.TIPO_INGRESO = '" + sType + "';";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}


function toFilter(aObjects){
    aObjects.forEach(function(mObject){
        
        // NIVEL_1
        if ( mObject.NIVEL_1 ) {
            mObject.NIVEL_1.trim();
        }
        
        if ( mObject.NIVEL_1 === "1.PISCILAGO" ) {
            mObject.NIVEL_1 = "PISCILAGO";
        }
        if ( mObject.NIVEL_1 === "2.HOTELES" ) {
            mObject.NIVEL_1 = "HOTELES";
        }
        if ( mObject.NIVEL_1 === "3.CLUBES" ) {
            mObject.NIVEL_1 = "CLUBES";
        }
        if ( mObject.NIVEL_1 === "4.NUEVOS CONCEPTOS" ) {
            mObject.NIVEL_1 = "NUEVOS PROGRAMAS";
        }
        if ( mObject.NIVEL_1 === "5.RECREACIÓN, DEPORTES Y EVENTOS" ) {
            mObject.NIVEL_1 = "RECREACIÓN, DEPORTES Y EVENTOS";
        }
        if ( mObject.NIVEL_1 === "6.OTROS *" ) {
            mObject.NIVEL_1 = "OTROS *";
        }
        if ( mObject.NIVEL_1 === "1.EMPRESARIAL" ) {
            mObject.NIVEL_1 = "EMPRESARIAL";
        }
        if ( mObject.NIVEL_1 === "2.INDIVIDUAL" ) {
            mObject.NIVEL_1 = "INDIVIDUAL";
        }
        if ( mObject.NIVEL_1 === "CAPITACIÓN IPS" ) {
            mObject.NIVEL_1 = "CAPITACIÓN";
        }
        if ( mObject.NIVEL_1 === "OTROS" ) {
            mObject.NIVEL_1 = "OTROS *";
        }
        
        // NIVEL_2
        if ( mObject.NIVEL_2 === "HOTEL ALCARAVÁN" ) {
            mObject.NIVEL_2 = "HOTEL EL ALCARAVÁN";
        }
        if ( mObject.NIVEL_2 === "COLINA" ) {
            mObject.NIVEL_2 = "LA COLINA";
        }
        if ( mObject.NIVEL_2 === "BLOC" ) {
            mObject.NIVEL_2 = "BLOCS";
        }
        if ( mObject.NIVEL_2 === "CAFÉ DE LAS LETRAS EMPRESARIAL" ) {
            mObject.NIVEL_2 = "CAFÉ DE LAS LETRAS - EMPRESARIAL";
        }
        if ( mObject.NIVEL_2 === "OTROS" ) {
            mObject.NIVEL_2 = "OTROS *";
        }
        if ( mObject.NIVEL_2 === "CAPITACIÓN IPS" ) {
            mObject.NIVEL_2 = "CAPITACIÓN";
        }
        if ( mObject.NIVEL_2 === "COMOSION CUPO" ) {
            mObject.NIVEL_2 = "COMISIONES CUPO";
        }
        
        // SEGMENTO
        if ( mObject.SEGMENTO === "Emp Grandes" ) {
            mObject.SEGMENTO = "1. EMPRESAS GRANDES";
        }
        if ( mObject.SEGMENTO === "Emp Medianas" ) {
            mObject.SEGMENTO = "2. EMPRESAS MEDIANAS";
        }
        if ( mObject.SEGMENTO === "Emp Micro" ) {
            mObject.SEGMENTO = "3. EMPRESAS PEQUEÑAS";
        }
        if ( mObject.SEGMENTO === "Emp Pymes" ) {
            mObject.SEGMENTO = "3. EMPRESAS PEQUEÑAS";
        }
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
            mObject.SEGMENTO = "2. MEDIO";
        }
        if ( mObject.SEGMENTO === "APORTES PRESCRITOS" ) {
            mObject.SEGMENTO = "APORTES PREESCRITOS";
        }
        
        // TERCERO
        if ( mObject.TERCERO === "NEPS" ) {
            mObject.TERCERO = "NUEVA EPS";
        }
        
    });
    return aObjects;
}

function toSetData(_mLog, aObjects, sType){
    try {
        mLog = _mLog;
        insertRows(toFilter(aObjects), sType);
    } catch (ex){
        mLog.MESSAGE = ex.message;
        oJob.insertJobLog(mLog, mError);
    }
}