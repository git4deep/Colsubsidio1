



function getObjects(){
    let conn = $.db.getConnection();
    let sql; let pstmt; let rs;
    
    sql = 'SELECT * FROM \"DBSL\".\"logical.data.calculationviews.CORPORATIVO.ILAE/TV2_INGRESOS_TV6\" ;';
    pstmt = conn.prepareStatement(sql);
    
    rs = pstmt.executeQuery();
    
    let aObject = [];
    
    while (rs.next()) {
        let mObject = {
            PERIODO: rs.getNString(1),
            ID_SERVICIO: rs.getNString(2),
            SERVICIO: rs.getNString(3),
            INGRESO_REAL_AN: rs.getNString(3),
            INGRESO_REAL: rs.getNString(4),
            INGRESO_PPTO: rs.getNString(5)
        };
        aObject.push(mObject);
    }
    pstmt.close();    
    conn.close();
        
    return aObject;
}





function init(){
    let mResponse = {}; let mData = {};
    
	try {
	    
	    let aData = getObjects();
        
        if(aData.length > 0){
            mResponse.code = 1;
            mResponse.data = aData;
            mResponse.message = "Transaction completed";
        } else {
            mResponse.code = 2;
            mResponse.data = mData;
            mResponse.message = "No matches";
        }
		
	} catch (ex){
		mResponse.code = 3;
		mResponse.data = mData;
		mResponse.message = ex.message;
	}
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}


init();


