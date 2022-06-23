/*
Retorna los registros por columa
*/

const conn = $.db.getConnection();

const sPath = "\"";

var TABLE_NAME = $.request.parameters.get("TABLE_NAME");
var COLUMN_NAME = $.request.parameters.get("COLUMN_NAME");

let oResponse = {};
let aRecordsColumn = [];

var sql;

function init() {

	try {

		if (TABLE_NAME || COLUMN_NAME) {
			this.getRecordsColumn();

			if (aRecordsColumn.length > 0) {
				oResponse.code = 1;
				oResponse.data = aRecordsColumn;
				oResponse.message = "Transaction completed";
				oResponse.sql = sql;
			} else {
				oResponse.code = 2;
				oResponse.data = aRecordsColumn;
				oResponse.message = "No matches";
				oResponse.sql = sql;
			}
		} else {
			oResponse.code = 2;
			oResponse.data = aRecordsColumn;
			oResponse.message = "No parameters";
		}

	} catch (ex) {
		oResponse.code = 3;
		oResponse.data = aRecordsColumn;
		oResponse.message = ex.message;
		oResponse.error = ex.stack;
		oResponse.sql = sql;
	}

}

function getRecordsColumn() {

	sql = "SELECT DISTINCT " + COLUMN_NAME + " FROM " + sPath + TABLE_NAME + "\"";

	var sScript = conn.prepareStatement(sql);
	var mQuery = sScript.executeQuery();

	while (mQuery.next()) {
		var oView = {
			RECORD: mQuery.getNString(1)

		};
		aRecordsColumn.push(oView);
	}

}

this.init();

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(oResponse));