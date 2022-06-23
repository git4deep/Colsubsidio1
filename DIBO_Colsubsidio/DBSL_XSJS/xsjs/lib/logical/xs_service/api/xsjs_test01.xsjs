/*
var mLog = {};
var mError = {};

let conn = $.db.getConnection();

var oDate = new Date();
oDate.setHours(oDate.getHours() - 5);
        
let sql = "INSERT INTO \"DBSL\".\"logical.data::T_ADM_JOBLOG\" (ODATA, FILTRO, FECHA, RESPUESTA, OBJETO) VALUES (?,?,?,?,?) ;";

let pstmt = conn.prepareStatement(sql);

    pstmt.setNString(1, 'ODATA');
    pstmt.setNString(2, 'FILTRO');
    pstmt.setNString(3, oDate.toString());
    pstmt.setNString(4, 'RESPUESTA');
    pstmt.setNString(5, 'OBJETO');
    
    pstmt.execute();
    pstmt.close();
        
	conn.commit();
    conn.close();
    
    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify('Hola'));
    
*/

    
function getFirstMonth(){
    
    var oLastPeriod = new Date();
    var oPeriod = new Date();
    
    oLastPeriod.setHours(oLastPeriod.getHours() - 5);
    oLastPeriod.setHours(0,0,0,0);
    oLastPeriod.setMonth(oLastPeriod.getMonth() - 1);
    
    oPeriod.setHours(oPeriod.getHours() - 5);
    oPeriod.setHours(0,0,0,0);
    
    // sLastPeriod
    var sLYear = oLastPeriod.getFullYear();
    var sLMonth = "01";
    var sLDate = "01";
    var sLastPeriod = sLYear + "-" + sLMonth + "-" + sLDate;
    
    return sLastPeriod;
}



var mPeriod = getFirstMonth();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(mPeriod));
    
    