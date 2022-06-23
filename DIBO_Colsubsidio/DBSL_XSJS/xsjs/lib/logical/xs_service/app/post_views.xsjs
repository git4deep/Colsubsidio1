/*
Crear vistas en T_COR_VISTA
*/
const conn = $.db.getConnection();

let oResponse = {};

var DESCRIPCION = JSON.parse($.request.body.asString());

function init() {

	try {
		this.postViews();

		oResponse.code = 1;
		oResponse.data = DESCRIPCION;
		oResponse.message = "Transaction completed";

	} catch (ex) {
		oResponse.code = 3;
		oResponse.data = DESCRIPCION;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}
}

function postViews() {
	var sql = "INSERT INTO \"logical.data::T_COR_VISTA\" (DESCRIPCION) VALUES(?)";

	var sScript = conn.prepareStatement(sql);
	sScript.setNString(1, DESCRIPCION);

	sScript.execute();
	conn.commit();

	conn.close();
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));