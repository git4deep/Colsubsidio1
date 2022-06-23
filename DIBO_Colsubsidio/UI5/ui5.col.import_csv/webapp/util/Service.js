sap.ui.define([
	"ui5/col/importcsv/util/Util"
], function(Util) {
	"use strict";


	return {
		
		
		hanadb: "/hanadb/logical",
		oView: null,
		
		
		
		Service: function(){},
		
		
		
		getFilters: function(mService){
			var sFilter = "";
			
			if(mService.FILTERS){
				var bFirst = true;
				
				mService.FILTERS.forEach(function(mFilter){
                    if ( mFilter.filter ) {
                        if ( bFirst ) {
                            sFilter += "?" + mFilter.filter + "";
                            bFirst = false;
                        } else {
                            sFilter += "&" + mFilter.filter + "";
                        }
                    }
				});
			}
		    return sFilter;
		},
		
		
		
		
		// *******************************  On Send Request  ******************************* //
		sendRequest: function(basepath,mService){
            var sUrl;
            var bAsync = true;
            
            if ( mService.ASYNC === false ) {
                bAsync = false;
            }
            
			if ( mService.METHOD === "GET" ) {
				
				sUrl = basepath + this.hanadb + "/xs_service/" + mService.PACKAGE + "/" + mService.SERVICE + this.getFilters(mService);
				
				Util._showBI(true);
				jQuery.ajax({
					url: sUrl,
					async: bAsync,
					method: "GET",
					success: function (data) {
						if (data.code === 1) {
						    var fnCallBack = mService.CALLBACK;
							fnCallBack(data);
						} else {
							var fnCallErrorBack = mService.ERROR_CALLBACK;
							if ( fnCallErrorBack ) {
								fnCallErrorBack(data);
							} else {
								Util._onShowHanaMessage(data.code, data.message);
							}
						}
						Util._showBI(false);
					},
					error: function (err) {
						Util._showHTML(err);
						Util._showBI(false);
					}
				});
			}
			if ( mService.METHOD === "POST" ) {
                
				sUrl = basepath + this.hanadb + "/xs_service/" + mService.PACKAGE + "/" + mService.SERVICE;
				
				Util._showBI(true);
				jQuery.ajax({
					url: sUrl,
					async: bAsync,
					method: "POST",
					contentType: "application/json",
                    data: JSON.stringify(mService.OBJECT),
					success: function (data) {
						if (data.code === 1) {
						    var fnCallBack = mService.CALLBACK;
							fnCallBack(data);
						} else {
							var fnCallErrorBack = mService.ERROR_CALLBACK;
							if ( fnCallErrorBack ) {
								fnCallErrorBack(data);
							} else {
								Util._onShowHanaMessage(data.code, data.message);
							}
						}
						Util._showBI(false);
					},
					error: function (err) {
						Util._showHTML(err);
						Util._showBI(false);
					}
				});
			}
			if ( mService.METHOD === "PUT" ) {
			    
				sUrl = basepath + this.hanadb + "/xs_service/" + mService.PACKAGE + "/" + mService.SERVICE;
				
				Util._showBI(true);
				jQuery.ajax({
					url: sUrl,
					async: bAsync,
					method: "PUT",
					contentType: "application/json",
				    data: JSON.stringify(mService.OBJECT),
					success: function (data) {
						if (data.code === 1) {
						    var fnCallBack = mService.CALLBACK;
							fnCallBack(data);
						} else {
							var fnCallErrorBack = mService.ERROR_CALLBACK;
							if ( fnCallErrorBack ) {
								fnCallErrorBack(data);
							} else {
								Util._onShowHanaMessage(data.code, data.message);
							}
						}
						Util._showBI(false);
					},
					error: function (err) {
						Util._showHTML(err);
						Util._showBI(false);
					}
				});
			}
		}
		// *******************************  On Send Request  ******************************* //
		
		
		
		
		
		
	};
});