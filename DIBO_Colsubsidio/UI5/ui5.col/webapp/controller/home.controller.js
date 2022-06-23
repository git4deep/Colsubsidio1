sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/odata/v2/ODataModel",
	"ui5/col/util/util"
], function (Controller, JSONModel, ODataModel, util) {
	"use strict";

	return Controller.extend("ui5.col.controller.home", {

		hanadb: "/hanadb/logical",
        //hanadb: "https://analitica-bi-production-xsjs-dbsl.cfapps.us10.hana.ondemand.com/logical",
		onInit: function () {
			var sRootPath = jQuery.sap.getModulePath("ui5.col.home");
			var oModel = new sap.ui.model.json.JSONModel([sRootPath, "../model/model.json"].join("/"));
			this._getView().setModel(oModel);
			//this._getCore().setModel(oModel);
		},

		onAfterRendering: function () {
			this.getViews();
			//Cambiar petición a más adelante para agilizar inicio
			this.getTables();
		},
		
		onSyncViews: function(){
			this.getViews();
			
			this.getTables();
		},

		getViews: function () {
			var oModel = this._getModel();

			jQuery.ajax({
				url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/get_views.xsjs",
            	method: "GET",
				async: false,
				success: function (oData) {
					if (oData.code === 1) {
						oModel.setProperty("/aViews", oData.data);
						oModel.refresh(true);
					}
				},
				error: function (err) {
					util._showHTML(err);
				}
			});
		},

		getTables: function () {
			var oModel = this._getModel();

			jQuery.ajax({
				url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/get_tables.xsjs",
				method: "GET",
				success: function (oData) {
					if (oData.code === 1) {
						oModel.setProperty("/aTables", oData.data);
						oModel.refresh(true);
					}
				},
				error: function (err) {
					util._showHTML(err);
				}
			});
		},

		moveToTable2: function () {
			var oModel = this._getCore().getModel();
			var tblOrder2 = this._getCore().byId("application-col-display-component---home--wizardOrder--tblOrder2");

			this.getSelectedRowContext("tblOrder1", function (oSelectedRowContext) {
				//Agregar item a la tabla 2
				oModel.getProperty("/ProductCollection2").push(oModel.getProperty(oSelectedRowContext.getPath()));
				//Eliminar item de la tabla 1
				var aNewArray = this.onRemovePosition(oModel.getProperty("/ProductCollection"), oSelectedRowContext.getPath().split("/")[2]);
				oModel.setProperty("/ProductCollection", aNewArray);
				oModel.refresh(true);
				tblOrder2.setModel(oModel);
			});
		},

		moveToTable1: function () {
			
			var oModel = this._getCore().getModel();
			var tblOrder1 = this._getCore().byId("application-col-display-component---home--wizardOrder--tblOrder1");
			this.getSelectedRowContext("tblOrder2", function (oSelectedRowContext) {
				//Agregar item a la tabla 1
				oModel.getProperty("/ProductCollection").push(oModel.getProperty(oSelectedRowContext.getPath()));
				//Eliminar item de la tabla 2
				var aNewArray = this.onRemovePosition(oModel.getProperty("/ProductCollection2"), oSelectedRowContext.getPath().split("/")[2]);
				oModel.setProperty("/ProductCollection2", aNewArray);
				oModel.refresh(true);
				tblOrder1.setModel(oModel);
			});
		},

		onDragStart: function (oEvent) {
			var oDraggedRow = oEvent.getParameter("target");
			var oDragSession = oEvent.getParameter("dragSession");
			oDragSession.setComplexData("draggedRowContext", oDraggedRow.getBindingContext());
		},

		onDropTable1: function (oEvent) {
			//Drag and Drop de tabla 2 a tabla 1
			
			var oModel = this._getCore().getModel();
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");

			var tblOrder2 = this._getCore().byId("application-col-display-component---home--wizardOrder--tblOrder2");

			if (!oDraggedRowContext) {
				return;
			}

			//Agregar item a la tabla 1
			oModel.getProperty("/ProductCollection").push(oModel.getProperty(oDraggedRowContext.getPath()));
			//Eliminar item de la tabla 1
			var aNewArray = this.onRemovePosition(oModel.getProperty("/ProductCollection2"), oDraggedRowContext.getPath().split("/")[2]);
			oModel.setProperty("/ProductCollection2", aNewArray);
			oModel.refresh(true);
			tblOrder2.setModel(oModel);
		},

		onDropTable2: function (oEvent) {
			//Drag and Drop de tabla 1 a tabla 2
			var oModel = this._getCore().getModel();
			var oDragSession = oEvent.getParameter("dragSession");
			var oDraggedRowContext = oDragSession.getComplexData("draggedRowContext");

			var tblOrder2 = this._getCore().byId("application-col-display-component---home--wizardOrder--tblOrder2");

			if (!oDraggedRowContext) {
				return;
			}

			//Validar si ya existe en la tabla 2
			var aDataOrder = oModel.getProperty("/ProductCollection2");
			var oItemDrop = oModel.getProperty(oDraggedRowContext.getPath());
			var bAddItem = true;
			var aNewArray = [];
			for (var i = 0; i < aDataOrder.length; i++) {

				if (aDataOrder[i].RECORD === oItemDrop.RECORD) {
					bAddItem = false;

					var nOldRow = Number(oDraggedRowContext.getPath().split("/")[2]);
					var nNewRow = Number(oDragSession.getDropControl().getCells()[0].getBindingContext().sPath.split("/")[2]);

					aNewArray = this.onOrderColumns(aDataOrder, nOldRow, nNewRow);
					oModel.setProperty("/ProductCollection2", aNewArray);
					oModel.refresh(true);
					tblOrder2.setModel(oModel);

					break;
				}
			}

			if (bAddItem) {
				oModel.getProperty("/ProductCollection2").push(oModel.getProperty(oDraggedRowContext.getPath()));
				//Eliminar item de la tabla 1
				aNewArray = this.onRemovePosition(oModel.getProperty("/ProductCollection"), oDraggedRowContext.getPath().split("/")[2]);
				oModel.setProperty("/ProductCollection", aNewArray);
				oModel.refresh(true);
				tblOrder2.setModel(oModel);
			}
		},

		onRemovePosition: function (aArray, sPath) {
			delete aArray[sPath];

			var aNewArray = [];
			for (var i = 0; i < aArray.length; i++) {
				if (aArray[i] !== undefined) {
					aNewArray.push(aArray[i]);
				}
			}

			return aNewArray;
		},

		getSelectedRowContext: function (sTableId, fnCallback) {
			var oTable = this.byId(sTableId);
			var iSelectedIndex = oTable.getSelectedIndex();

			if (iSelectedIndex === -1) {
				util._onShowMessage("", "Seleccione un item de la tabla", "toast");
				return;
			}             

			var oSelectedContext = oTable.getContextByIndex(iSelectedIndex);
			if (oSelectedContext && fnCallback) {
				fnCallback.call(this, oSelectedContext, iSelectedIndex, oTable);
			}
			return oSelectedContext;
		},

		moveSelectedRow: function (sDirection) {
			var oModel = this._getCore().getModel();
			var tblOrder2 = this._getCore().byId("application-col-display-component---home--wizardOrder--tblOrder2");

			this.getSelectedRowContext("tblOrder2", function (oSelectedRowContext, iSelectedRowIndex, oTable2) {
				var iSiblingRowIndex = iSelectedRowIndex + (sDirection === "Up" ? -1 : 1);
				var oSiblingRowContext = oTable2.getContextByIndex(iSiblingRowIndex);
				if (!oSiblingRowContext) {
					return;
				}

				var aDataTable2 = oModel.getProperty("/ProductCollection2");
				var newRow = this.getDirection(iSelectedRowIndex, sDirection);
				var aDataTable2Aux = this.onOrderColumns(aDataTable2, iSelectedRowIndex, newRow);
				oTable2.setSelectedIndex(newRow);

				oModel.setProperty("/ProductCollection2", aDataTable2Aux);
				oModel.refresh(true);
				tblOrder2.setModel(oModel);
			});
		},

		getDirection: function (iSelectedRowIndex, sDirection) {
			var nNewRow = 0;
			if (sDirection === "Up") {
				if (iSelectedRowIndex !== 0) {
					nNewRow = iSelectedRowIndex - 1;
				}
			} else {
				nNewRow = iSelectedRowIndex + 1;
			}
			return nNewRow;
		},

		moveUp: function () {
			this.moveSelectedRow("Up");
		},

		moveDown: function () {
			this.moveSelectedRow("Down");
		},

		getItemAutomatic: function (sDescriptionView, aViews) {
			var oView;
			for (var i = 0; i < aViews.length; i++) {
				oView = {};
				if (aViews[i].DESCRIPCION === sDescriptionView) {
					oView = aViews[i];
					break;
				}
			}
			return oView;
		},

		onValidateViews: function (oEvent) {
			var oModel = this._getModel();
			var oView;
			var Wizard = this._getCore().byId("application-col-display-component---home--Wizard");
			var pViews = this._getCore().byId("application-col-display-component---home--pViews");
			var pTables = this._getCore().byId("application-col-display-component---home--pTables");
			var pColumns = this._getCore().byId("application-col-display-component---home--pColumns");
			//var pOrder = this._getCore().byId("application-col-display-component---home--pOrder");
			var pMessageViews = this._getCore().byId("application-col-display-component---home--pMessageViews");
			var pMessageTables = this._getCore().byId("application-col-display-component---home--pMessageTables");
			var pMessageColumns = this._getCore().byId("application-col-display-component---home--pMessageColumns");
			//var pMessageOrder = this._getCore().byId("application-col-display-component---home--pMessageColumns");
			var wsView = this._getCore().byId("application-col-display-component---home--wsView");
			var wsTables = this._getCore().byId("application-col-display-component---home--wsTables");
			var wsColumns = this._getCore().byId("application-col-display-component---home--wsColumns");
			//var wsOrders = this._getCore().byId("application-col-display-component---home--wsOrders");
			var tblViews = this._getCore().byId("application-col-display-component---home--wizardViews--tblViews");
			//var tblTables = this._getCore().byId("application-col-display-component---home--wizardTables--tblTables");
			//var tblColumns = this._getCore().byId("application-col-display-component---home--wizardColumns--tblColumns");

			var listItemView = pMessageViews.getContent()[0].getItems()[0];
			var inpAddView = this._getCore().byId("inpAddView");
			var viewConfirm = this._getCore().byId("application-col-display-component---home--wizardConfirm--viewConfirm");

			var iSelectedIndex = tblViews.getSelectedIndex();

			if (oEvent === "goToStep2") {
				//Set Information
				oView = oModel.getProperty("/aResumeView");
				viewConfirm.setValue(oView.DESCRIPCION);
				listItemView.setTitle(oView.DESCRIPCION);
				pViews.setVisible(false);
				pMessageViews.setVisible(true);
				wsView.setValidated(true);

				this._getCore().setModel(oModel);
				this._getCore().getModel().refresh(true);

				Wizard.nextStep();
				this.onCloseConfigViewFragment();
			} else if (oEvent.getId().indexOf("wsTables") !== -1) {
				var oSelectedTable;
				if (oEvent.getId().indexOf("wsTables") !== -1) {
					var sDescriptionView = inpAddView.getValue();
					var aViews = oModel.getProperty("/aViews");
					oSelectedTable = this.getItemAutomatic(sDescriptionView, aViews);
				} else {
					var aDataTblViews = oModel.getProperty("/aViews");
					var aBindingIndices = tblViews.getBinding().aIndices;
					oSelectedTable = aDataTblViews[aBindingIndices[iSelectedIndex]];
				}

				oModel.setProperty("/oSelectedView", oSelectedTable);
				oModel.refresh(true);
				listItemView.setTitle(oSelectedTable.DESCRIPCION);
				viewConfirm.setValue(oSelectedTable.DESCRIPCION);
				this._getCore().setModel(oModel);
				this._getCore().getModel().refresh(true);

				//Ocultar tabla
				pViews.setVisible(false);
				pMessageViews.setVisible(true);
				wsView.setValidated(true);
			} else {
				oView = oModel.getProperty("/aResumeView");
				var sTable = oModel.getProperty("/TABLE_NAME");
				//var sNameColumns = oModel.getProperty("/TABLE_COLUMNS");
				//var aResumeOrderOfRecords = oModel.getProperty("/aResumeOrderOfRecords");

				//Conocer desde que sección quieren editar.
				if (oEvent.getParameters().id.indexOf("resumeTable") !== -1) {
					//Set Information
					viewConfirm.setValue(oView.DESCRIPCION);
					listItemView.setTitle(oView.DESCRIPCION);
					pViews.setVisible(false);
					pMessageViews.setVisible(true);
					wsView.setValidated(true);

					Wizard.nextStep();
					this.onCloseConfigViewFragment();
				}
				if (oEvent.getParameters().id.indexOf("resumeColumns") !== -1) {
					//Set Information
					viewConfirm.setValue(oView.DESCRIPCION);
					listItemView.setTitle(oView.DESCRIPCION);
					oModel.setProperty("/oSelectedTable", {});
					oModel.setProperty("/oSelectedTable/TABLE_NAME", sTable);

					pViews.setVisible(false);
					pMessageViews.setVisible(true);
					pTables.setVisible(false);
					pMessageTables.setVisible(true);
					wsView.setValidated(true);
					wsTables.setValidated(true);

					Wizard.nextStep();
					Wizard.nextStep();
					this.onCloseConfigViewFragment();
				}
				if (oEvent.getParameters().id.indexOf("resumeOrder") !== -1) {
					//Set Information
					viewConfirm.setValue(oView.DESCRIPCION);
					listItemView.setTitle(oView.DESCRIPCION);
					oModel.setProperty("/oSelectedTable", {});
					oModel.setProperty("/oSelectedTable/TABLE_NAME", sTable);

					pViews.setVisible(false);
					pMessageViews.setVisible(true);
					pTables.setVisible(false);
					pMessageTables.setVisible(true);
					pColumns.setVisible(false);
					pMessageColumns.setVisible(true);
					wsView.setValidated(true);
					wsTables.setValidated(true);
					wsColumns.setValidated(true);

					Wizard.nextStep();
					Wizard.nextStep();
					Wizard.nextStep();
					this.onCloseConfigViewFragment();
				}
			}
		},

		onValidateTables: function (oEvent) {
			var oModel = this._getCore().getModel();
			if (!oModel) {
				oModel = this._getModel();
			}
			var pTables = this._getView().byId("pTables");
			var pMessageTables = this._getView().byId("pMessageTables");
			var wsTables = this._getView().byId("wsTables");
			var tblTables = this._getView().byId("wizardTables--tblTables");
			var tblColumns = this._getView().byId("wizardColumns--tblColumns");
			var sTableSelected;
			
			var iSelectedIndex = tblTables.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var aDataTblTables = oModel.getProperty("/aTables");
				var aBindingIndices = tblTables.getBinding().aIndices;
				var oSelectedTable = aDataTblTables[aBindingIndices[iSelectedIndex]];

				sTableSelected = oSelectedTable.TABLE_NAME;

				oModel.setProperty("/oSelectedTable", oSelectedTable);
				oModel.setProperty("/aColumnsByTable", this.getColumnsByTable(sTableSelected));
				oModel.refresh(true);
				tblColumns.setModel(oModel);
				this._getView().setModel(oModel);

				//Ocultar tabla
				pTables.setVisible(false);
				pMessageTables.setVisible(true);
			} else {

				if (oModel.getProperty("/TABLE_NAME")) {
					sTableSelected = oModel.getProperty("/TABLE_NAME");
					oModel.setProperty("/aColumnsByTable", this.getColumnsByTable(sTableSelected));
					oModel.refresh(true);
					tblColumns.setModel(oModel);
					this._getView().setModel(oModel);

					//Ocultar tabla
					pTables.setVisible(false);
					pMessageTables.setVisible(true);
				} else {
					this.onControlStepWizard(wsTables);
					util._onShowMessage("Información", "Seleccione una tabla", "info");
					//Ocultar mensaje - mostrar tabla
					pTables.setVisible(true);
					pMessageTables.setVisible(false);
				}
			}
		},

		getColumnsByTable: function (sTableSelected) {
			var aColumnsByTable = [];
			jQuery.ajax({
				url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/get_columns_table.xsjs?TABLE_NAME='" + sTableSelected + "'",
				method: "GET",
				async: false,
				success: function (oData) {
					if (oData.code === 1) {
						aColumnsByTable = oData.data;
					}
				},
				error: function (err) {
					util._showHTML(err);
				}
			});
			return aColumnsByTable;
		},

		onValidateColumns: function (oEvent) {
			var oModel = this._getCore().getModel();
			if (!oModel) {
				oModel = this._getModel();
			}
			//var tblColumns = this._getView().byId("wizardColumns--tblColumns");
			var tblOrder1 = this._getView().byId("wizardOrder--tblOrder1");
			var wsColumns = this._getView().byId("wsColumns");
			var pColumns = this._getView().byId("pColumns");
			var pMessageColumns = this._getView().byId("pMessageColumns");
			var tblColumns = this._getView().byId("wizardColumns--tblColumns");
			var sColumnSelected;
			var iSelectedIndex = tblColumns.getSelectedIndex();
			if (iSelectedIndex !== -1) {
				var aDataTblColumns = oModel.getProperty("/aColumnsByTable");
				var aBindingIndices = tblColumns.getBinding().aIndices;
				var oSelectedColumn = aDataTblColumns[aBindingIndices[iSelectedIndex]];

				oModel.setProperty("/oSelectedColumnByTable", oSelectedColumn);

				sColumnSelected = oSelectedColumn.TABLE_COLUMNS;
				oModel.setProperty("/ProductCollection", this.getRecordsColumn(sColumnSelected));
				oModel.refresh(true);
				tblOrder1.setModel(oModel);

				this._getView().setModel(oModel);

				//Ocultar tabla - mostrar mensaje
				pColumns.setVisible(false);
				pMessageColumns.setVisible(true);
			} else {

				if (oModel.getProperty("/TABLE_COLUMNS")) {
					sColumnSelected = oModel.getProperty("/TABLE_COLUMNS");
					oModel.setProperty("/oSelectedColumnByTable", {});
					oModel.setProperty("/oSelectedColumnByTable/TABLE_COLUMNS", sColumnSelected);

					oModel.setProperty("/ProductCollection", this.getRecordsColumn(sColumnSelected));
					oModel.refresh(true);
					tblOrder1.setModel(oModel);

					this._getView().setModel(oModel);

					//Ocultar tabla - mostrar mensaje
					pColumns.setVisible(false);
					pMessageColumns.setVisible(true);
				} else {
					util._onShowMessage("Información", "Seleccione una columna", "info");
					this.onControlStepWizard(wsColumns);
					//Ocultar mensaje - mostrar tabla
					pColumns.setVisible(true);
					pMessageColumns.setVisible(false);
				}

			}
		},

		getRecordsColumn: function (sColumnSelected) {
			var oModel = this._getModel();
			var sTableSelected = oModel.getProperty("/oSelectedTable/TABLE_NAME");
			var aRecordsColumn = [];

			jQuery.ajax({
				url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/get_records_column.xsjs?TABLE_NAME=" + sTableSelected + "&COLUMN_NAME=" + sColumnSelected,
				method: "GET",
				async: false,
				success: function (oData) {
					if (oData.code === 1) {
						aRecordsColumn = oData.data;
					}
				},
				error: function (err) {
					util._showHTML(err);
				}
			});
			return aRecordsColumn;
		},

		onValidateAfterOrder: function () {
			var oModel = this._getCore().getModel();
			var wsOrders = this._getView().byId("wsOrders");
			var pOrder = this._getView().byId("pOrder");
			var pMessageOrder = this._getView().byId("pMessageOrder");

			var cmbColumnFilter = this._getCore().byId("application-col-display-component---home--wizardOrder--cmbColumnFilter");
			var cmbColumnOrder = this._getCore().byId("application-col-display-component---home--wizardOrder--cmbColumnOrder");

			var tblOrder2 = this._getCore().byId("application-col-display-component---home--wizardOrder--tblOrder2");
			var aColumns = tblOrder2.getModel().getProperty("/ProductCollection2");

			if (aColumns.length > 0) {
				if (cmbColumnFilter.getSelectedKey() !== "") {
					if (cmbColumnOrder.getSelectedKey() !== "") {
						oModel.setProperty("/columnToFilter", cmbColumnFilter.getSelectedKey());
						oModel.setProperty("/columnToOrder", cmbColumnOrder.getSelectedKey());
						oModel.setProperty("/aOrderOfRecords", aColumns);
						oModel.refresh(true);
						this._getView().setModel(oModel);

						pOrder.setVisible(false);
						pMessageOrder.setVisible(true);
					} else {
						util._onShowMessage("Advertencia", "Seleccione columna para guardar orden", "warn");
						this.onControlStepWizard(wsOrders);

						pOrder.setVisible(true);
						pMessageOrder.setVisible(false);
					}
				} else {
					util._onShowMessage("Advertencia", "Seleccione columna para guardar filtro", "warn");
					this.onControlStepWizard(wsOrders);

					pOrder.setVisible(true);
					pMessageOrder.setVisible(false);
				}

			} else {
				util._onShowMessage("Advertencia", "Especifique el orden a los registros", "warn");
				this.onControlStepWizard(wsOrders);

				pOrder.setVisible(true);
				pMessageOrder.setVisible(false);
			}
		},

		onOpenAddView: function (oEvent) {
			var oModel = this._getCore().getModel();
			if (!this.addViewFragment) {
				this.addViewFragment = sap.ui.xmlfragment("ui5.col.view.fragment.addView", this);
			}

			//Limpiar campo
			var sDescriptionView = this._getCore().byId("inpAddView");
			sDescriptionView.setValue();
			if (oModel) {
				oModel.setProperty("/aResumeView", undefined);
			}

			this.addViewFragment.open();
		},

		onCloseAddViewFragment: function () {
			this.addViewFragment.close();
		},

		onCreateView: function () {
			var that = this;
			var sDescription = this._getCore().byId("inpAddView").getValue();
			var wsTable = that._getCore().byId("application-col-display-component---home--wsTables");
			var oWizard = this._getCore().byId("application-col-display-component---home--Wizard");

			if (sDescription !== "") {
				jQuery.ajax({
					url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/post_views.xsjs",
					method: "POST",
					data: JSON.stringify(sDescription),
					contentType: "application/json",
					async: false,
					success: function (oData) {
						if (oData.code === 1) {
							that.getViews();
							that.onCloseAddViewFragment();
							that.onValidateViews(wsTable);
							oWizard.nextStep();
						} else {
							util._onShowMessage("Error", oData.message, "error");
						}
					},
					error: function (err) {
						util._showHTML(err);
					}
				});
			} else {
				util._onShowMessage("Información", "Ingrese una descripción a la vista", "info");
			}
		},

		onOpenConfigView: function () {
			var oModel = this._getModel();

			if (!this.configViewFragment) {
				this.configViewFragment = sap.ui.xmlfragment("ui5.col.view.fragment.configView", this);
			}

			var tblViews = this._getCore().byId("application-col-display-component---home--wizardViews--tblViews");
			var iSelectedIndex = tblViews.getSelectedIndex();

			if (iSelectedIndex !== -1) {
				var aDataTblViews = oModel.getProperty("/aViews");
				var aBindingIndices = tblViews.getBinding().aIndices;
				var oSelectedTable = aDataTblViews[aBindingIndices[iSelectedIndex]];

				var aResumeView = this.getResumeView(oSelectedTable);
				oModel.setProperty("/aResumeView", oSelectedTable);

				if (aResumeView.length > 0) {
					oModel.setProperty("/TABLE_NAME", aResumeView[0].TABLA);
					oModel.setProperty("/TABLE_COLUMNS", aResumeView[0].COLUMNA);
					oModel.setProperty("/aResumeOrderOfRecords", aResumeView);
					this._getCore().setModel(oModel);

					this.configViewFragment.open();
					oModel.setProperty("/ProductCollection2", []);
				} else {
					util._onShowMessage("Información", "La vista no cuenta con información \n Por favor completar", "info");
					
					this.onValidateViews("goToStep2");
					
				}

			} else {
				util._onShowMessage("Información", "Seleccione una vista", "info");
			}

		},

		getResumeView: function (oSelectedTable) {
			var iView = oSelectedTable.ID_VISTA;
			var aResumeView = [];
			jQuery.ajax({
				url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/get_info_view.xsjs?ID_VISTA=" + iView,
				method: "GET",
				async: false,
				success: function (oData) {
					if (oData.code === 1) {
						aResumeView = oData.data;
					}
				},
				error: function (err) {

				}
			});
			return aResumeView;
		},

		onCloseConfigViewFragment: function () {
			if(this.configViewFragment){
				this.configViewFragment.close();
				this.configViewFragment.destroy();
			}
            this.configViewFragment = undefined;
		},

		onReturnStep: function (oEvent) {
			var oModel = this._getCore().getModel();

			//Paneles
			var pViews = this._getView().byId("pViews");
			var pMessageViews = this._getView().byId("pMessageViews");
			var pColumns = this._getView().byId("pColumns");
			var pMessageColumns = this._getView().byId("pMessageColumns");
			var pOrder = this._getView().byId("pOrder");
			var pMessageOrder = this._getView().byId("pMessageOrder");
			var pTables = this._getView().byId("pTables");
			var pMessageTables = this._getView().byId("pMessageTables");

			//Wizards
			var wsView = this._getView().byId("wsView");
			var wsTables = this._getView().byId("wsTables");
			var wsColumns = this._getView().byId("wsColumns");
			var wsOrders = this._getView().byId("wsOrders");

			var nIdMessageStrip;
			if (oEvent !== "pMessageViews") {
				nIdMessageStrip = oEvent.getSource().getParent().getParent().getId();
			} else {
				nIdMessageStrip = "pMessageViews";
			}
			
			if (nIdMessageStrip.indexOf("pMessageViews") !== -1) {
				oModel.setProperty("/ProductCollection2", []);
				pViews.setVisible(true);
				pMessageViews.setVisible(false);
				pTables.setVisible(true);
				pMessageTables.setVisible(false);
				pColumns.setVisible(true);
				pMessageColumns.setVisible(false);
				pOrder.setVisible(true);
				pMessageOrder.setVisible(false);
				//Mostrar btn validar
				this.onControlStepWizard(wsView);
				wsView.setValidated(false);
			}

			if (nIdMessageStrip.indexOf("pMessageTables") !== -1) {
				oModel.setProperty("/ProductCollection2", []);
				pViews.setVisible(false);
				pMessageViews.setVisible(true);
				pTables.setVisible(true);
				pMessageTables.setVisible(false);
				pColumns.setVisible(true);
				pMessageColumns.setVisible(false);
				pOrder.setVisible(true);
				pMessageOrder.setVisible(false);
				//Mostrar btn validar
				this.onControlStepWizard(wsTables);
			}

			if (nIdMessageStrip.indexOf("pMessageColumns") !== -1) {
				oModel.setProperty("/ProductCollection2", []);
				pViews.setVisible(false);
				pMessageViews.setVisible(true);
				pTables.setVisible(false);
				pMessageTables.setVisible(true);
				pColumns.setVisible(true);
				pMessageColumns.setVisible(false);
				pOrder.setVisible(true);
				pMessageOrder.setVisible(false);
				//Mostrar btn validar
				this.onControlStepWizard(wsColumns);
			}

			if (nIdMessageStrip.indexOf("pMessageOrder") !== -1) {
				var sColumnSelected = oModel.getProperty("/oSelectedColumnByTable/TABLE_COLUMNS");
				oModel.setProperty("/ProductCollection", this.getRecordsColumn(sColumnSelected));
				oModel.setProperty("/ProductCollection2", []);
				oModel.refresh(true);

				pViews.setVisible(false);
				pMessageViews.setVisible(true);
				pTables.setVisible(false);
				pMessageTables.setVisible(true);
				pColumns.setVisible(false);
				pMessageColumns.setVisible(true);
				pOrder.setVisible(true);
				pMessageOrder.setVisible(false);
				//Mostrar btn validar
				this.onControlStepWizard(wsOrders);
			}
		},

		onConfirmProcess: function () {
			var oModel = this._getCore().getModel();
			var iView;
			var sTable;
			var sColumn;
			var oInfoView;
			var sColumnFilter;
			var sColumnOrder;

			if (oModel.getProperty("/aResumeView")) {
				//Editar vista
				if (this.onCreatedOrder()) {
					//2. Modificar en T_COR_VISTA_INFO	
					iView = oModel.getProperty("/aResumeView/ID_VISTA");
					sTable = oModel.getProperty("/oSelectedTable/TABLE_NAME");
					sColumn = oModel.getProperty("/oSelectedColumnByTable/TABLE_COLUMNS");
					sColumnFilter = oModel.getProperty("/columnToFilter");
					sColumnOrder = oModel.getProperty("/columnToOrder");

					oInfoView = {
						ID_VISTA: iView,
						TABLA: sTable,
						COLUMA: sColumn,
						FILTRO: sColumnFilter,
						ORDEN: sColumnOrder
					};

					jQuery.ajax({
						url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/upd_view_info.xsjs",
						method: "POST",
						data: JSON.stringify(oInfoView),
						contentType: "application/json",
						async: false,
						success: function (oData) {
							if (oData.code === 1) {
								util._onShowMessage("Satisfactorio", "Vista modificada", "good");
								//that.onReturnStep("pMessageViews");
							} else {
								util._onShowMessage("Error", oData.message, "error");
							}
						},
						error: function (err) {
							util._showHTML(err);
						}
					});

				} else {
					util._onShowMessage("Error", "No se ha modificado el orden D:", "error");
				}

			} else {
				//Crear vista
				//1. Almacenar el orden seleccionado en T_COR_ORDEN_VISTA.
				if (this.onCreatedOrder()) {

					//2. Almacenar en T_COR_VISTA_INFO	
					iView = oModel.getProperty("/oSelectedView/ID_VISTA");
					sTable = oModel.getProperty("/oSelectedTable/TABLE_NAME");
					sColumn = oModel.getProperty("/oSelectedColumnByTable/TABLE_COLUMNS");
					sColumnFilter = oModel.getProperty("/columnToFilter");
					sColumnOrder = oModel.getProperty("/columnToOrder");

					oInfoView = {
						ID_VISTA: iView,
						TABLA: sTable,
						COLUMA: sColumn,
						FILTRO: sColumnFilter,
						ORDEN: sColumnOrder
					};

					jQuery.ajax({
						url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/post_view_info.xsjs",
						method: "POST",
						data: JSON.stringify(oInfoView),
						contentType: "application/json",
						async: false,
						success: function (oData) {
							if (oData.code === 1) {
								util._onShowMessage("Satisfactorio", "Vista almacenada", "good");
							} else {
								util._onShowMessage("Error", oData.message, "error");
							}
						},
						error: function (err) {
							util._showHTML(err);
						}
					});
				} else {
					util._onShowMessage("Error", "No se ha creado el orden D:", "error");
				}
			}
		},

		onCreatedOrder: function () {
			var oModel = this._getCore().getModel();
			var aLetters = oModel.getProperty("/Letters");
			var bContinue = false;
			var aOrderOfRecords = oModel.getProperty("/aOrderOfRecords");
			var iView = oModel.getProperty("/oSelectedView/ID_VISTA");
			if (!iView) {
				iView = oModel.getProperty("/aResumeView/ID_VISTA");
			}

			var aOrderToCreate = [];
			var oOrderToCreate;

			var sColumnFilter = oModel.getProperty("/columnToFilter");
			var sColumnOrder = oModel.getProperty("/columnToOrder");

			for (var i = 0; i < aOrderOfRecords.length; i++) {
				oOrderToCreate = {};

				oOrderToCreate.ID_VISTA = Number(iView);
				oOrderToCreate.FILTRO_1 = aOrderOfRecords[i].RECORD;
				oOrderToCreate.ORDEN_1 = aLetters[i].letter;

				oOrderToCreate.ORDEN_SELECCIONADO = sColumnOrder;
				oOrderToCreate.FILTRO_SELECCIONADO = sColumnFilter;

				aOrderToCreate.push(oOrderToCreate);
			}
			
			if (aOrderToCreate.length > 0) {
				jQuery.ajax({
					url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/post_orders.xsjs",
					method: "POST",
					data: JSON.stringify(aOrderToCreate),
					contentType: "application/json",
					async: false,
					success: function (oData) {
						if (oData.code === 1) {
							bContinue = true;
						} else {
							util._onShowMessage("Error", oData.message, "error");
						}
					},
					error: function (err) {
						util._showHTML(err);
					}
				});
			}

			return bContinue;
		},

		onModifyOrder: function () {
			var oModel = this._getCore().getModel();
			var bContinue = false;
			var aOrderOfRecords = oModel.getProperty("/aOrderOfRecords");
			var iView = oModel.getProperty("/aResumeView/ID_VISTA");

			var aOrderToCreate = [];
			var oOrderToCreate;

			var sLetter = 0;

			for (var i = 0; i < aOrderOfRecords.length; i++) {
				oOrderToCreate = {};
				sLetter++;
				oOrderToCreate.ID_VISTA = Number(iView);
				oOrderToCreate.FILTRO_1 = aOrderOfRecords[i].RECORD;
				oOrderToCreate.ORDEN_1 = sLetter;

				aOrderToCreate.push(oOrderToCreate);
			}

			if (aOrderToCreate.length > 0) {
				jQuery.ajax({
					url: this.fnBaseURL(this) + this.hanadb + "/xs_service/app/post_orders.xsjs",
					method: 'POST',
					data: JSON.stringify(aOrderToCreate),
					contentType: "application/json",
					async: false,
					success: function (oData) {
						if (oData.code === 1) {
							bContinue = true;
						} else {
							util._onShowMessage("Error", oData.message, "error");
						}
					},
					error: function (err) {
						util._showHTML(err);
					}
				});
			}

			return bContinue;
		},

		onControlStepWizard: function (oStep) {
			var oWizard = this._getCore().byId("application-col-display-component---home--Wizard");
			oWizard.discardProgress(oStep);
			oWizard.goToStep(oStep);
			oStep.setValidated(true);
		},

		onOrderColumns: function (arr, old_index, new_index) {
			while (old_index < 0) {
				old_index += arr.length;
			}
			while (new_index < 0) {
				new_index += arr.length;
			}
			if (new_index >= arr.length) {
				var k = new_index - arr.length;
				while ((k--) + 1) {
					arr.push(undefined);
				}
			}
			arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
			return arr;
		},

		/* _getBundle
		 * @returns {Object} the object model i18n
		 * Convenience method for getting the object resource bundle i18n
		 */
		_getBundle: function () {
			return this._getView().getModel("i18n").getResourceBundle();
		},

		/* _getCore
		 * @returns {sap.ui.core} the core instance
		 * Convenience method for getting the core controller of the application.
		 */
		_getCore: function () {
			return sap.ui.getCore();
		},

		/* _getModel
		 * @returns {sap.ui.model.Model} the model instance
		 * Convenience method for getting the view model by name in every controller of the application.
		 */
		_getModel: function () {
			return this.getView().getModel();
		},

		/* _getView
		 * @returns {sap.ui.model.View} the View instance
		 * Convenience method for getting the view model by name in every controller of the application.
		 */
		_getView: function () {
			return this.getView();
		},

		/* _getController
		 * @returns {sap.ui.model.Controller} the model instance
		 * Convenience method for getting the view model by name in every controller of the application.
		 */
		_getController: function () {
			return this.getView().getController();
		},


        fnBaseURL:function(that){
            var appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
            var appPath = appId.replaceAll(".", "/");
            var appModulePath = jQuery.sap.getModulePath(appPath);
            return appModulePath;
        },

	});
});