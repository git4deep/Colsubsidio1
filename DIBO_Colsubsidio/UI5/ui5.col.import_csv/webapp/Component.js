sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ui5/col/importcsv/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("ui5.col.importcsv.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			sap.ui.getCore()._NAMESPACE =  this.getMetadata()._sComponentName ? 
				this.getMetadata()._sComponentName : this.getMetadata()._oMetadata._sComponentName;
				
		}
	});
});