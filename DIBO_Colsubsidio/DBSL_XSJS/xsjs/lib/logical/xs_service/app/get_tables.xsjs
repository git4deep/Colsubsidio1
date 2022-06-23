/*
Retorna las tablas de SYS.M_TABLES
*/

const conn = $.db.getConnection();

let oResponse = {};
let aTables = [];

function init(){
    
	try {
        this.getTables();
        
        if(aTables.length > 0){
            oResponse.code = 1;
            oResponse.data = aTables;
            oResponse.message = "Transaction completed";
        } else {
            oResponse.code = 2;
            oResponse.data = aTables;
            oResponse.message = "No matches";
        }
		
	} catch (ex){
		oResponse.code = 3;
		oResponse.data = aTables;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}
	
}


function getTables(){
    
    var sql = "SELECT TABLE_NAME FROM SYS.M_TABLES WHERE SCHEMA_NAME ='DBSL'";
    
    var sScript = conn.prepareStatement(sql);
	var mQuery = sScript.executeQuery();

	while (mQuery.next()) {
		var oView = {
			TABLE_NAME: mQuery.getNString(1)
		};
		aTables.push(oView);
	}
    
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));