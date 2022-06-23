sap.ui.define([
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"sap/ui/core/BusyIndicator"
], function(MessageBox, MessageToast, BusyIndicator) {
	"use strict";
	
	return {
		
		console : console,
		styleClass : "sapUiSizeCompact",
		
		
		_showBI: function(value){
			if(value){
				BusyIndicator.show(0);
			} else {
				BusyIndicator.hide();
			}
		},
		
		_isEmpty: function(object){
			if(object === null || object === "" || object === undefined){
				return true;
			} else {
				return false;	
			}
		},
		
		_showHTML: function(html){
			try {
				var _text = html.responseText || html.response.body;
				var _message = "\n" + _text.replace(/<[^>]*>?/g, " ") + "\n\n";
				
				if (html.status > 399 && html.status < 600){
					this._onShowMessage(_message, "toast");
				} else {
					this._onShowMessage(_message, "toast");
				}
			} catch (err){
				this.console.warn(err.stack);
			}
		},
		
		_showConsole: function(_message, _type) {
			try{
				if(_message !== undefined && _type !== undefined){
					if (_type === "info") {
						this.console.info(_message);
					} else if (_type === "error") {
						this.console.error(_message);
					} else if (_type === "warn") {
						this.console.warn(_message);
					} else if (_type === "done") {
						this.console.log("%c" + _message , "color: Green ");
					}
				}else{
					this.console.warn("_message or _type are undefined");
				}
			} catch(err){
				this.console.warn(err.stack);
			}
		},
		
		
		_onShowHanaMessage: function(_code, _message) {
			try{
				if(_code !== undefined && _message !== undefined){
					if (_code === 3) {
						MessageBox.error(_message,{
							styleClass: this.styleClass
						});
					} else {
						MessageToast.show(_message);
					}
				}else{
					this.console.warn("mObject are undefined");
				}
			} catch(err){
				this.console.warn(err.stack);
			}
		},
		
		
		_onShowMessage: function(_message, _type) {
			try{
				if(_message !== undefined && _type !== undefined){
					if (_type === "info") {
						MessageBox.information(_message,{
							styleClass: this.styleClass
						});
					} else if (_type === "error") {
						MessageBox.error(_message,{
							styleClass: this.styleClass
						});
					} else if (_type === "warn") {
						MessageBox.warning(_message,{
							styleClass: this.styleClass
						});
					} else if (_type === "toast") {
						MessageToast.show(_message);
					} else if (_type === "done") {
						MessageBox.success(_message,{
							styleClass: this.styleClass
						});
					}
				}else{
					this.console.warn("_message or _type are undefined");
				}
			} catch(err){
				this.console.warn(err.stack);
			}
		},
        
        _currency: function(_number) {
        	var _numm = this._number(_number).toString();
			//return "$ " + _numm.replace(/(\d)(?=(\d{3})+(?:\.\d+)?$)/g, "$1,");  // 12,345.67
			return "$ " + _numm.replace(".", ",").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");  // 12.345,67
		},
		
		_number: function(iNumber, iDecimal){
			var _numm = Number(iNumber);
			if(isNaN(_numm) || _numm === Infinity){
				_numm = 0;
			}
			return Number(_numm.toFixed(iDecimal || 3));
		}
        
        /*_number: function(_number, _decimal){
        	var _aux = (_number || "").toString().replace(",",".");
			var _numm = Number(_aux);
			if(isNaN(_numm) || _numm === Infinity){
				_numm = 0;
			}
			return Number(_numm.toFixed(_decimal || 3));
		}*/
        
	};
	
});