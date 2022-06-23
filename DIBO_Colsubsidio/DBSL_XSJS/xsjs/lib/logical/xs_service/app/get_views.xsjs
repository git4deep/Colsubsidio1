/*
Retorna las vistas de T_COR_VISTA
*/

const conn = $.db.getConnection();

let oResponse = {};
let aViews = [];

function init(){
    
	try {
        this.getViews();
        
        if(aViews.length > 0){
            oResponse.code = 1;
            oResponse.data = aViews;
            oResponse.message = "Transaction completed";
        } else {
            oResponse.code = 2;
            oResponse.data = aViews;
            oResponse.message = "No matches";
        }
		
	} catch (ex){
		oResponse.code = 3;
		oResponse.data = aViews;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}
	
}


function getViews(){
    
    var sql = "SELECT * FROM \"logical.data::T_COR_VISTA\"";
    
    var sScript = conn.prepareStatement(sql);
	var mQuery = sScript.executeQuery();

	while (mQuery.next()) {
		var oView = {
			ID_VISTA: mQuery.getInteger(1),
			DESCRIPCION: mQuery.getNString(2)
		};
		aViews.push(oView);
	}
    
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));

$.response.headers.set("Access-Control-Allow-Origin", "*");
$.response.status = $.net.http.OK;