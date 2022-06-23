/*
Retorna las colunas de TABLE_COLUMNS
*/

const conn = $.db.getConnection();

var TABLE_NAME = $.request.parameters.get("TABLE_NAME");

let oResponse = {};
let aColumnsByTable = [];

function init(){
    
	try {
        this.getColumnsByTable();
        
        if(aColumnsByTable.length > 0){
            oResponse.code = 1;
            oResponse.data = aColumnsByTable;
            oResponse.message = "Transaction completed";
        } else {
            oResponse.code = 2;
            oResponse.data = aColumnsByTable;
            oResponse.message = "No matches";
        }
		
	} catch (ex){
		oResponse.code = 3;
		oResponse.data = aColumnsByTable;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}
	
}


function getColumnsByTable(){
    
    var sql = "SELECT COLUMN_NAME"+
            " FROM TABLE_COLUMNS" +
            " WHERE SCHEMA_NAME = 'DBSL' " +
            " AND TABLE_NAME = " + TABLE_NAME +
            " ORDER BY POSITION;";
    
    var sScript = conn.prepareStatement(sql);
	var mQuery = sScript.executeQuery();

	while (mQuery.next()) {
		var oView = {
			TABLE_COLUMNS: mQuery.getNString(1)
		};
		aColumnsByTable.push(oView);
	}
    
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));