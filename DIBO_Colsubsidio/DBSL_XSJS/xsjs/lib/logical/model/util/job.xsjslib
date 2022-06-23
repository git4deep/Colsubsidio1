let oUtil = $.import("logical.model.util", "util");

function deleteJobLog(){
    let conn = $.db.getConnection();
    let sql; let pstmt;
	
	sql = "DELETE FROM \"logical.data::T_ADM_JOBLOG\" ;";
	pstmt = conn.prepareStatement(sql);
	
	pstmt.execute();
    conn.commit();
    
	pstmt.close();    
    conn.close();
}

function insertJobLog(mLog, mError){
    let conn = $.db.getConnection();
    
    var oDate = new Date();
    oDate.setHours(oDate.getHours() - 5);
        
    let sql = "INSERT INTO \"logical.data::T_ADM_JOBLOG\" (ODATA, FILTRO, FECHA, RESPUESTA, OBJETO) VALUES (?,?,?,?,?) ;";
    
    let pstmt = conn.prepareStatement(sql);
    
    pstmt.setNString(1, mLog.ENTITY);
    pstmt.setNString(2, mLog.SET);
    pstmt.setNString(3, oDate.toString());
    pstmt.setNString(4, mLog.MESSAGE);
    
    if ( mError ){
        pstmt.setNString(5, JSON.stringify(mError));
    } else {
        pstmt.setNull(5);
    }
    
    
    pstmt.execute();
    pstmt.close();
        
	conn.commit();
    conn.close();
}