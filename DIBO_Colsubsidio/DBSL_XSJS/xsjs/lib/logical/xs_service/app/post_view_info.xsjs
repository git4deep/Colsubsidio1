/*
Crear registro en T_COR_VISTA_INFO
*/
const conn = $.db.getConnection();

let oResponse = {};

var oInfoView = JSON.parse($.request.body.asString());

function init() {

	try {
		this.postInfoView();

		oResponse.code = 1;
		oResponse.data = oInfoView;
		oResponse.message = "Transaction completed";

	} catch (ex) {
		oResponse.code = 3;
		oResponse.data = oInfoView;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}
}

function postInfoView() {
	var sql = "INSERT INTO \"logical.data::T_COR_VISTA_INFO\"" +
	        " (ID_VISTA, FILTRO, ORDEN, TABLA, COLUMNA) VALUES(?,?,?,?,?)";
	var sScript = conn.prepareStatement(sql);
	
	sScript.setInteger(1, oInfoView.ID_VISTA);
	sScript.setNString(2, oInfoView.FILTRO);
	sScript.setNString(3, oInfoView.ORDEN);
	sScript.setNString(4, oInfoView.TABLA);
	sScript.setNString(5, oInfoView.COLUMA);

	sScript.execute();
	conn.commit();

	conn.close();
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));