sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/m/MessageStrip",
	"sap/ui/core/BusyIndicator",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/resource/ResourceModel",

], function (MessageBox, MessageToast, MessageStrip, BusyIndicator, Controller, JSONModel, ResourceModel) {
	"use strict";
		
	return {
		
		MessageBox:function(){
			return MessageBox;	
		},

		_onShowMessage: function (_title, _message, _type) {
			try {
				if (_message !== undefined && _type !== undefined) {
					if (_type === "info") {
						MessageBox.information(_message, {
							title: _title
						});
					} else if (_type === "error") {
						MessageBox.error(_message, {
							title: _title
						});
					} else if (_type === "warn") {
						MessageBox.warning(_message, {
							title: _title
						});
					} else if (_type === "good") {
						MessageBox.success(_message, {
							title: _title
						});
					} else if (_type === "toast") {
						MessageToast.show(_message);
					} 
				} else {
					this.console.warn("_message or _type are undefined");
				}
			} catch (err) {
				this.console.warn(err.stack);
			}
		},

		_showHTML: function(html){
			try {
				var _text = html.responseText || html.response.body;
				var _message = "\n" + _text.replace(/<[^>]*>?/g, " ") + "\n\n";
				
				if (html.status > 399 && html.status < 600){
					this._onShowMessage("",_message, "toast");
				} else {
					this._onShowMessage("",_message, "toast");
				}
			} catch (err){
				this.console.warn(err.stack);
			}
		},

		formatDate: function (date) {
			var d = date.getDate() + 1;
			var m = date.getMonth() + 1; //Month from 0 to 11
			var y = date.getFullYear();

			return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
		},

		prettyDate: function (date) {
			var y = date.getFullYear() + 1;
			var m = date.getMonth() + 1;
			var d = date.getDate();

			var hora = date.getHours();
			var minutos = date.getMinutes();

			//aquí se hace lo 'importante'
			if (m < 10) {
				m = '0' + m;
			}
			if (d < 10) {
				d = '0' + d;
			}
			if (hora < 10) {
				hora = '0' + hora;
			}
			if (minutos < 10) {
				minutos = '0' + minutos;
			}

			var mes = "";
			var auxMes = m + "";

			if (auxMes === "01") {
				mes = "Enero";
			}
			if (auxMes === "02") {
				mes = "Febrero";
			}
			if (auxMes === "03") {
				mes = "Marzo";
			}
			if (auxMes === "04") {
				mes = "Abril";
			}
			if (auxMes === "05") {
				mes = "Mayo";
			}
			if (auxMes === "06") {
				mes = "Junio";
			}
			if (auxMes === "07") {
				mes = "Julio";
			}
			if (auxMes === "08") {
				mes = "Agosto";
			}
			if (auxMes === "09") {
				mes = "Septiembre";
			}
			if (auxMes === "10") {
				mes = "Octubre";
			}
			if (auxMes === "11") {
				mes = "Noviembre";
			}
			if (auxMes === "12") {
				mes = "Diciembre";
			}

			return d + " de " + mes + " del " + y + " , " + hora + ":" + minutos;

		},

		formatDateCalendar: function (date) {
			var y = date.getFullYear();
			var m = date.getMonth();
			var d = date.getDate();

			var hour = date.getHours();
			var min = date.getMinutes();

			if (m < 10) {
				m = '0' + m;
			}
			if (d < 10) {
				d = '0' + d;
			}
			if (hour < 10) {
				hour = '0' + hour;
			}
			if (min < 10) {
				min = '0' + min;
			}

			var oDate = new Date(y.toString(), m.toString(), d.toString(), hour.toString(), min.toString());

			return oDate;
		},
		
		_showBI: function (value) {
			if (value) {
				BusyIndicator.show(0);
			} else {
				BusyIndicator.hide();
			}
		},

		isEmpty: function (object) {
			if (object === null || object === "" || object === undefined) {
				return true;
			} else {
				return false;
			}
		}

	};
});