sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("ui5.col.portal.controller.home", {
		onInit: function () {

		},
		
		
		onAppOrder: function(){
			sap.m.URLHelper.redirect("https://appordenamientos-dae824620.dispatcher.us2.hana.ondemand.com/index.html?hc_reset", true);
		},
		
		onAppImport: function(){
			sap.m.URLHelper.redirect("https://appimportcsv-dae824620.dispatcher.us2.hana.ondemand.com/index.html?hc_reset", true);
		}
		
	});
});