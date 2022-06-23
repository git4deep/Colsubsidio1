let oConection = $.import("logical.model.util", "conection");


function getCSRFToken(oDest, oClient){
    let sCSRF = null;
    //console.log("before xcsrf token");
    let oRequest = new $.web.WebRequest($.net.http.GET, encodeURI("ODATA_DIBOS/T_COR_INGRESOS.xsodata"));
    oRequest.headers.set("x-csrf-token", "fetch");
    oClient.request(oRequest, oDest);
    
    let oResponse = oClient.getResponse();
    
    if(oResponse.status === 200){
        sCSRF = oResponse.headers.get("x-csrf-token");   
       // console.log(sCSRF);
      // console.log("scsrf token success");
    } else {
        let message = "HTTP Error: " + oResponse.headers[2].value + " " +  oResponse.headers[3].value;
        
        if ( oResponse.body ) {
            message = message + " - " + oResponse.body.asString();
        //    console.log(message);
        }
        throw { message: message };
    }
    return sCSRF;
}


function toInfo(mService){
    let sInfo = "";
    
    let oRequest, oResponse;
    
    let oDestination = oConection.getHanaBMPDestionation();
    
    let oClient = new $.net.http.Client();
    let sURL;
    
    if ( mService.METHOD === "GET" ) {
        
        sURL = "ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
        
        oRequest = new $.web.WebRequest($.net.http.GET, encodeURI(sURL));
        oRequest.headers.set("Content-Type","application/json");
        oRequest.headers.set("accept","application/json");
        
        oClient.request(oRequest, oDestination);
        oResponse = oClient.getResponse();
    
        if(oResponse.status === 200){
            let aObjects = JSON.parse(oResponse.body.asString()).d;
            sInfo = aObjects;
            
        }  else {
            let message = "HTTP Error: " + oResponse.headers[2].value + " " +  oResponse.headers[3].value;
        
            if ( oResponse.body ) {
                message = message + " - " + oResponse.body.asString();
            }
            throw { message: message };
        }
    } 
    
    return sInfo;
}


function sendRequest(mService){
    let mData = [];
    
    let oRequest, oResponse;
    
    let oDestination = oConection.getHanaBMPDestionation();
  //  console.log("oDestination");
   // console.log(oDestination);
    let oClient = new $.net.http.Client();
    let sURL;
    
    if ( mService.METHOD === "GET" ) {
     //   console.log("In GET of sendRequest");
        
        sURL = "ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
     //   console.log("SURL:"+sURL);
        oRequest = new $.web.WebRequest($.net.http.GET, encodeURI(sURL));
        oRequest.headers.set("Content-Type","application/json");
        oRequest.headers.set("accept","application/json");
      //  console.log("Before Client Request");     
      //  console.log(oRequest);   
        oClient.request(oRequest, oDestination);
       // console.log("After Client Request");
        oResponse = oClient.getResponse();
       // console.log("oResponse: "+oResponse);
        if(oResponse.status === 200){
            let aObjects = JSON.parse(oResponse.body.asString()).d.results;
        //    console.log(aObjects);
            aObjects.forEach(function(mObject){
                mData.push(mObject);
            });
            
        }  else {
            let message = "HTTP Error: " + oResponse.headers[2].value + " " +  oResponse.headers[3].value;
        
            if ( oResponse.body ) {
                message = message + " - " + oResponse.body.asString();
               // console.log("GET Message: "+ message);
            }
            throw { message: message };
        }
    } 
    
    if ( mService.METHOD === "POST" ) {
        
        sURL = "ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
        
        let sCSRF = getCSRFToken(oDestination, oClient);
        oRequest = new $.web.WebRequest($.net.http.POST, encodeURI(sURL));
        
        oRequest.headers.set("x-csrf-token", sCSRF);
        oRequest.headers.set("Content-Type","application/json");
        oRequest.headers.set("accept","application/json");
        oRequest.setBody(JSON.stringify({d: mService.OBJECT}));
        
        oClient.request(oRequest, oDestination);
        oResponse = oClient.getResponse();
        
        if(oResponse.status === 201){
            mData = JSON.parse(oResponse.body.asString()).d;
        } else {
            message = "HTTP Error: " + oResponse.headers[2].value + " " +  oResponse.headers[3].value;
        
            if ( oResponse.body ) {
                message = message + " - " + oResponse.body.asString();
            }
            throw { message: message };
        }
        
    } 
    
    oClient.close();
    
    return mData;
}


function sendRequestXML(mService){
    let sResponse = "";
    
    let oRequest, oResponse;
    
    let oDestination = oConection.getHanaBMPDestionation();
    
    let oClient = new $.net.http.Client();
    let sURL;
    
    if ( mService.METHOD === "GET" ) {
        
        sURL = "ODATA_DIBOS/" + mService.ENTITY + "/" + mService.SET + "";
        
        oRequest = new $.web.WebRequest($.net.http.GET, encodeURI(sURL));
        oRequest.headers.set("Content-Type","application/json");
        
        oClient.request(oRequest, oDestination);
        oResponse = oClient.getResponse();
    
        if(oResponse.status === 200){
            sResponse = oResponse.body.asString();
        }  else {
            let message = "HTTP Error: " + oResponse.headers[2].value + " " +  oResponse.headers[3].value;
        
            if ( oResponse.body ) {
                message = message + " - " + oResponse.body.asString();
            }
            throw { message: message };
        }
    } 
    return sResponse;
}