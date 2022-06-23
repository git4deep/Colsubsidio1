/*
Retorna toda la información de una vista
*/

const conn = $.db.getConnection();

var ID_VISTA = $.request.parameters.get("ID_VISTA");

let oResponse = {};
let aInfoView = [];

function init() {

	try {
		this.getInfoView();

		if (aInfoView.length > 0) {
			oResponse.code = 1;
			oResponse.data = aInfoView;
			oResponse.message = "Transaction completed";
		} else {
			oResponse.code = 2;
			oResponse.data = aInfoView;
			oResponse.message = "No matches";
		}

	} catch (ex) {
		oResponse.code = 3;
		oResponse.data = ID_VISTA;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
	}

}

function getInfoView() {

	var sql = "SELECT V_INFO.ID_VISTA, V_INFO.TABLA, V_INFO.COLUMNA, " +
		" V_ORDER.ID_ORDEN_VISTAS, V_ORDER.FILTRO_1, V_ORDER.FILTRO_2," +
		" V_ORDER.ORDEN_1, V_ORDER.ORDEN_2, V_ORDER.ORDEN_3, V_ORDER.ORDEN_4" +
		" FROM \"logical.data::T_COR_VISTA_INFO\" AS V_INFO" +
		" INNER JOIN \"logical.data::T_COR_ORDEN_VISTA\" AS V_ORDER" +
		" ON V_INFO.ID_VISTA = V_ORDER.ID_VISTA" +
		" WHERE V_INFO.ID_VISTA = " + ID_VISTA;

	var sScript = conn.prepareStatement(sql);
	var mQuery = sScript.executeQuery();

	while (mQuery.next()) {
		var oView = {
			ID_VISTA: mQuery.getInteger(1),
			TABLA: mQuery.getNString(2),
			COLUMNA: mQuery.getNString(3),
			ID_ORDEN_VISTAS: mQuery.getInteger(4),
			FILTRO_1: mQuery.getNString(5),
			FILTRO_2: mQuery.getNString(6),
			ORDEN_1: mQuery.getNString(7),
			ORDEN_2: mQuery.getNString(8),
			ORDEN_3: mQuery.getNString(9),
			ORDEN_4: mQuery.getNString(10)
		};
		aInfoView.push(oView);
	}

}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));