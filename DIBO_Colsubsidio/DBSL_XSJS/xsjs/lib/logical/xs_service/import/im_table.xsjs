

let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");




function getMetadata(sTable){
    const conn = $.db.getConnection();
    var sql = "SELECT COLUMN_NAME, DATA_TYPE_NAME, LENGTH, SCALE, IS_NULLABLE, GENERATION_TYPE " + 
                "FROM TABLE_COLUMNS WHERE SCHEMA_NAME = 'DBSL' AND TABLE_NAME = '" + sTable + "' ORDER BY POSITION;";
    
    var pstmt = conn.prepareStatement(sql);
    var rs = pstmt.executeQuery();
    
    var aData = [];
    while (rs.next()) {
        var mData = {
            COLUMN_NAME : rs.getNString(1),
            DATA_TYPE_NAME : rs.getNString(2),
            LENGTH : rs.getInteger(3),
            SCALE : rs.getInteger(4),
            IS_NULLABLE : rs.getNString(5),
            GENERATION_TYPE: rs.getNString(6)
        };
        
        if ( !mData.GENERATION_TYPE ) {
            aData.push(mData);
        }
    }
    return aData;
}

function init(){
    let mResponse = {}; let mData = {};
    
	try {
        var sTable = $.request.parameters.get("table");
        let mInfo = getMetadata(sTable);
        
        if(mInfo){
            mResponse.code = 1;
            mResponse.data = mInfo;
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


