sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"ui5/col/importcsv/util/Util",
	"ui5/col/importcsv/util/Dialog",
	"ui5/col/importcsv/util/Service",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV"
], function (Controller, Util, Dialog, Service, JSONModel, Export, ExportTypeCSV) {
	"use strict";

	return Controller.extend("ui5.col.importcsv.controller.home", {
		
		
		split: ";",
		
		
		onInit: function () {
			var sRootPath = jQuery.sap.getModulePath("ui5.col.importcsv");
			var oModel = new JSONModel([sRootPath, "/model/model.json"].join("/"));
			
			oModel.setSizeLimit(99999);
			this._getView().setModel(oModel);
		},
		
		
		// *******************************  To load info table  ******************************* //
		onChangeTable: function(oEvent){
			var oSource = oEvent.getSource();
			var sTable = oSource.getSelectedItem().getText();
			
			var aFilters = [];
			aFilters.push({ filter: "table=" + sTable });
			
			var that = this;
			var mService = {
				METHOD: "GET",
				PACKAGE: "import",
				SERVICE: "im_table.xsjs",
				FILTERS: aFilters,
				CALLBACK: function(data){
					that._getModel().setProperty("/table", sTable);
					that._getModel().setProperty("/info", data.data);
				}
			};
			var basepath = this.fnBaseURL(this);
			Service.sendRequest(basepath,mService);
		},
		// *******************************  To load info table ******************************* //
		
		
		
		
		// *******************************  On delete data ******************************* //
		onChangeDeleteData: function(oEvent){
			var oSource = oEvent.getSource();
			oSource.setEnabled(false);
		},
		
		onDeleteData: function(){
			var aInfo = this._getModel().getProperty("/info");
			
			if (aInfo && aInfo.length > 0 ) {
				this.onOpenDeleteData();
			}
		},
		
		onCancelDeleteData: function(){
			this.onCloseDeleteData();
		},
		
		onConfirmDeleteData: function(){
			var oSwtDeleteData = this._getView().byId("swtDeleteData");
			var oInPDeleteData = this._getCore().byId("inpDeleteData");
			if ( oInPDeleteData.getValue() === "deletedata" ) {
				oSwtDeleteData.setState(true);
				oSwtDeleteData.setEnabled(true);
				this.onCloseDeleteData();
			}
		},
		
		onOpenDeleteData: function() {
			Dialog._onOpenDialog("deletedata", this);
        },
        
        onCloseDeleteData: function() {
        	Dialog._OnCloseDialog("deletedata");
        },
        
		// *******************************  On delete data ******************************* //
		
		
		
		
		// *******************************  On import data  ******************************* //
		handleUploadComplete: function(oEvent) {
			var oFileUploader = oEvent.getSource();
			
			var that = this;
			
			if (oFileUploader.oFileUpload.files.length > 0){
				
				var oFile = oFileUploader.oFileUpload.files[0];
				var oReader = new FileReader();
				
				oReader.readAsText(oFile); //like text 
				//oReader.readAsBinaryString(oFile); // like binary 
				//oReader.readAsDataURL(oFile); // like base64 
				
				oReader.onload = function (event) {
					var sAllData = event.target.result;
					var aRows = [];
					
					var aLines = sAllData.split("\n");
					delete aLines[0];
					
					aLines.forEach(function(mLine){
						var aColumns = mLine.split(that.split);
						
						if ( aColumns.length > 1 ) {
							aRows.push(aColumns);
						}
					});
					that.toSendImport(aRows);
					Util._showConsole("Total lines: " + aLines.length, "done");
				};
			}
		},
		
		toSendImport: function (aRows){
			var oSwtDeleteData = this._getView().byId("swtDeleteData");
			var sTable = this._getModel().getProperty("/table");
			var aInfo = this._getModel().getProperty("/info");
			
			var mImport = {
				table: sTable,
				info: aInfo,
				rows: aRows,
				delete: oSwtDeleteData.getState()
			};
			
			var that = this;
			var mService = {
				METHOD: "POST",
				PACKAGE: "import",
				SERVICE: "im_import.xsjs",
				OBJECT: mImport,
				CALLBACK: function(data){
					Util._onShowMessage(that._getBundle().getText("imported"), "done");
					that.toCleanForm();
				},
				ERROR_CALLBACK: function(data){
					Util._onShowHanaMessage(data.code, data.message);
					that.toCleanForm();
				}
			};
            var basepath = this.fnBaseURL(this);
			Service.sendRequest(basepath,mService);
		},
		
		
		toCleanFile: function(){
			var oFileUploader = this._getView().byId("fileUploader");
			oFileUploader.clear(); 
		},
		
		toCleanForm: function(){
			var oSltTables = this._getView().byId("sltTables");
			var oSwtDeleteData = this._getView().byId("swtDeleteData");
			var oFileUploader = this._getView().byId("fileUploader");
			oFileUploader.clear(); 
			oSwtDeleteData.setState(false);
			oSwtDeleteData.setEnabled(false);
			oSltTables.setSelectedItem(null);
			
			this._getModel().setProperty("/table", null);
			this._getModel().setProperty("/info", null);
			this._getModel().updateBindings();
		},
		
		
		handleUploadPress: function(oEvent) {
			var aInfo = this._getModel().getProperty("/info");
			var oFileUploader = this._getView().byId("fileUploader");
			
			if (aInfo && aInfo.length > 0 ) {
				if ( oFileUploader.oFileUpload.files.length ) {
					oFileUploader.upload();
				}
			} else {
				Util._onShowMessage(this._getBundle().getText("noFile"), "warn");
			}
		},
		// *******************************  On import data  ******************************* //
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		// *******************************  On Download excel  ******************************* //
		onDownloadFormat: function(){
			var aInfo = this._getModel().getProperty("/info");
			
			if (aInfo && aInfo.length > 0 ) {
				
				var aColumns = [];
				
				aInfo.forEach(function(mInfo){
					var sTitle = mInfo.COLUMN_NAME + " " + mInfo.DATA_TYPE_NAME + " (" + mInfo.LENGTH + ")";
					aColumns.push({
						name : sTitle,
						template : {
							content : ""
						}
					});
				});
				
				var oExport = new Export({

					// Type that will be used to generate the content. Own ExportType's can be created to support other formats
					exportType : new ExportTypeCSV({
						separatorChar : this.split
					}),
	
					// Pass in the model created above
					models : this._getModel(),
	
					// binding information for the rows aggregation
					rows : { path : "/info" },
	
					// column definitions with column name and binding info for the content
	
					columns : aColumns
				});
	
				// download exported file
				oExport.saveFile().catch(function(oError) {
					//MessageBox.error("Error when downloading data. Browser might not be supported!\n\n" + oError);
				}).then(function() {
					oExport.destroy();
				});
			}
		},
		// *******************************  On Download excel  ******************************* //
		
		
		// *******************************  Default methods  ******************************* //
		
		/* _getUserId
		 * @returns {sId} the String user id
		 * Convenience method for getting the id of usre login of the application.
		 */
		_getUserId: function(){
			var oUserModel = this._getModel().getProperty("/user");
			return oUserModel.getData().name;
		},
		
		/* _getBundle
		 * @returns {jQuery.sap.util.ResourceBundle} the ResourceBundle instance
		 * Convenience method for getting the ResourceBundle  of the application.
		 */
		_getBundle: function(){
			return this._getView().getModel("i18n").getResourceBundle();
		},
		
		/* _getCore
		 * @returns {sap.ui.core} the core instance
		 * Convenience method for getting the core controller of the application.
		 */
		_getCore: function() {
			return sap.ui.getCore();
		},
		
		/* _getModel
		 * @returns {sap.ui.model.Model} the model instance
		 * Convenience method for getting the view model by name in every controller of the application.
		 */
		_getModel: function() {
			return this.getView().getModel();
			//return sap.ui.getCore().getModel();
		},
		
		/* _getView
		 * @returns {sap.ui.model.View} the View instance
		 * Convenience method for getting the view model by name in every controller of the application.
		 */
		_getView: function() {
			return this.getView();
		},

        fnBaseURL:function(that){
            var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            return appModulePath;
        },

		
	});
});