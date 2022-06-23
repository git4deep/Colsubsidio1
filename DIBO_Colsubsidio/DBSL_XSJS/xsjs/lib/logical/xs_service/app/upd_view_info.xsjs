/*
Actualiza registro en T_COR_VISTA_INFO
*/
const conn = $.db.getConnection();

let oResponse = {};

var oInfoView = JSON.parse($.request.body.asString());

function init() {

	try {
		this.updInfoView();

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

function updInfoView() {
	var sql = "UPDATE \"logical.data::T_COR_VISTA_INFO\"" +
	        " SET TABLA = ?, COLUMNA = ?" +
	        " WHERE ID_VISTA = ?";
	var sScript = conn.prepareStatement(sql);
	
	sScript.setInteger(3, oInfoView.ID_VISTA);
	sScript.setNString(1, oInfoView.TABLA);
	sScript.setNString(2, oInfoView.COLUMA);

	sScript.execute();
	conn.commit();

	conn.close();
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));