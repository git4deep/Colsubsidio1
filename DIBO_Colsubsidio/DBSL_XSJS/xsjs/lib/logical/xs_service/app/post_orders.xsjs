/*
Crear registro en T_COR_ORDEN_VISTA
*/

const conn = $.db.getConnection();

let oResponse = {};

var aOrder = JSON.parse($.request.body.asString());

var sScript;

function init() {

	try {
		this.deleteOrder();
		this.postOrder();

		oResponse.code = 1;
		oResponse.data = conn;
		oResponse.message = "Transaction completed";

	} catch (ex) {
		oResponse.code = 3;
		oResponse.data = conn;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}
}

function postOrder() {
	var oOrder;
	
	var sColumns = this.getColumnsSQL();

	for (var i = 0; i < aOrder.length; i++) {
		oOrder = aOrder[i];

		var sql = "INSERT INTO \"logical.data::T_COR_ORDEN_VISTA\"" + sColumns + " VALUES(?,?,?)";
			//" (ID_VISTA, FILTRO_1, ORDEN_1) VALUES(?,?,?)"
			

		sScript = conn.prepareStatement(sql);
		sScript.setInteger(1, oOrder.ID_VISTA);
		sScript.setNString(2, oOrder.FILTRO_1);
		sScript.setNString(3, oOrder.ORDEN_1.toString());

		sScript.execute();
		conn.commit();
	}

	conn.close();
}

function getColumnsSQL(){
    var sColumns = " (ID_VISTA, ";
	var oOrder = aOrder[0];
	
	if (oOrder.FILTRO_SELECCIONADO === "1"){
	    sColumns += "FILTRO_1, ";
	} else {
	    sColumns += "FILTRO_2, ";
	}
	
	if (oOrder.ORDEN_SELECCIONADO === "1"){
	    sColumns += "ORDEN_1) ";
	}
	if (oOrder.ORDEN_SELECCIONADO === "2"){
	    sColumns += "ORDEN_2) ";
	}
	if (oOrder.ORDEN_SELECCIONADO === "3"){
	    sColumns += "ORDEN_3) ";
	}
	if (oOrder.ORDEN_SELECCIONADO === "4"){
	    sColumns += "ORDEN_4) ";
	}
	
	return sColumns;
}

function deleteOrder() {

	var sql = "DELETE FROM \"logical.data::T_COR_ORDEN_VISTA\"" +
		" WHERE ID_VISTA = ?";
	sScript = conn.prepareStatement(sql);
	sScript.setInteger(1, aOrder[0].ID_VISTA);

	sScript.execute();
	conn.commit();
}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));