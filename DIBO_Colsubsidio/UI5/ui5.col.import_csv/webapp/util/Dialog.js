sap.ui.define([
], function() {
	"use strict";
	
	return {
		
		
		
		
		_onOpenQuickView: function(sQuickView, oContext, oSource) {
			var _oQuickView = "_" + sQuickView;
            if ( !this[_oQuickView] ) {
                this[_oQuickView] = sap.ui.xmlfragment(oContext._getCore()._NAMESPACE + ".view.fragment." + sQuickView, oContext);
                oContext._getView().addDependent(this[_oQuickView]);
            }
            this[_oQuickView].openBy(oSource);
        },
        
        _onCloseQuickView: function(sQuickView) {
            var _oQuickView = "_" + sQuickView;
            if(this[_oQuickView]){
				this[_oQuickView].destroy();
			}
            this[_oQuickView] = undefined;
        },
		
		
		
		
		_onOpenDialog: function(sDialog, oContext, bDontEscape) {
			var _oDialog = "_" + sDialog;
            if ( !this[_oDialog] ) {
                this[_oDialog] = sap.ui.xmlfragment(oContext._getCore()._NAMESPACE + ".view.fragment." + sDialog, oContext);
                if ( bDontEscape ) {
                    this[_oDialog].setEscapeHandler(function(oPromise) {
                        oPromise.reject();
                    });  
                }
                oContext._getView().addDependent(this[_oDialog]);
            }
            this[_oDialog].open();
        },
        
        
        
        _OnCloseDialog: function(sDialog) {
            var _oDialog = "_" + sDialog;
            if(this[_oDialog]){
				this[_oDialog].close();
				this[_oDialog].destroy();
			}
            this[_oDialog] = undefined;
        }
        
        
	};	
});