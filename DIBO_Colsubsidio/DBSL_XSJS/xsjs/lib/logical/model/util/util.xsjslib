function getLastMonth(){
    
    var oLastPeriod = new Date();
    var oPeriod = new Date();
    
    oLastPeriod.setHours(oLastPeriod.getHours() - 5);
    oLastPeriod.setHours(0,0,0,0);
    oLastPeriod.setMonth(oLastPeriod.getMonth() - 1);
    
    oPeriod.setHours(oPeriod.getHours() - 5);
    oPeriod.setHours(0,0,0,0);
    
    // sLastPeriod
    var sLYear = oLastPeriod.getFullYear();
    var sLMonth = (oLastPeriod.getMonth() + 1) < 10 ? "0" + (oLastPeriod.getMonth() + 1) : (oLastPeriod.getMonth() + 1);
    var sLDate = "01";
    var sLastPeriod = sLYear + "-" + sLMonth + "-" + sLDate;
    //var sLastPeriod = '2022-01-01';
    
    return sLastPeriod;
}

function getPenultimateMonth(){
    
    var oLastPeriod = new Date();
    var oPeriod = new Date();
    
    oLastPeriod.setHours(oLastPeriod.getHours() - 5);
    oLastPeriod.setHours(0,0,0,0);
    oLastPeriod.setMonth(oLastPeriod.getMonth() - 2);
    
    oPeriod.setHours(oPeriod.getHours() - 5);
    oPeriod.setHours(0,0,0,0);
    
    // sLastPeriod
    var sLYear = oLastPeriod.getFullYear();
    var sLMonth = (oLastPeriod.getMonth() + 1) < 10 ? "0" + (oLastPeriod.getMonth() + 1) : (oLastPeriod.getMonth() + 1);
    var sLDate = "01";
    var sLastPeriod = sLYear + "-" + sLMonth + "-" + sLDate;
    
    return sLastPeriod;
}

function getFirstMonth(){
    
    var oLastPeriod = new Date();
    var oPeriod = new Date();
    
    oLastPeriod.setHours(oLastPeriod.getHours() - 5);
    oLastPeriod.setHours(0,0,0,0);
    oLastPeriod.setMonth(oLastPeriod.getMonth() - 1);
    
    oPeriod.setHours(oPeriod.getHours() - 5);
    oPeriod.setHours(0,0,0,0);
    
    // sLastPeriod
    var sLYear = oLastPeriod.getFullYear();
    var sLMonth = "01";
    var sLDate = "01";
    var sLastPeriod = sLYear + "-" + sLMonth + "-" + sLDate;
    
    return sLastPeriod;
}


function getLastThreeMonths(){
    
    var oLastPeriod = new Date();
    var oPeriod = new Date();
    
    oLastPeriod.setHours(oLastPeriod.getHours() - 5);
    oLastPeriod.setHours(0,0,0,0);
    oLastPeriod.setMonth(oLastPeriod.getMonth() - 3);
    
    oPeriod.setHours(oPeriod.getHours() - 5);
    oPeriod.setHours(0,0,0,0);
    
    // sLastPeriod
    var sLYear = oLastPeriod.getFullYear();
    var sLMonth = (oLastPeriod.getMonth() + 1) < 10 ? "0" + (oLastPeriod.getMonth() + 1) : (oLastPeriod.getMonth() + 1);
    var sLDate = "01";
    var sLastPeriod = sLYear + "-" + sLMonth + "-" + sLDate;
    
    return sLastPeriod;
}


function getLastPeriod(){
    var aObjects = [];
    
    var oLastPeriod = new Date();
    var oPeriod = new Date();
    
    oLastPeriod.setHours(oLastPeriod.getHours() - 5);
    oLastPeriod.setHours(0,0,0,0);
    oLastPeriod.setMonth(oLastPeriod.getMonth() - 1);
    
    
    oPeriod.setHours(oPeriod.getHours() - 5);
    oPeriod.setHours(0,0,0,0);
    
    // sLastPeriod
    var sLYear = oLastPeriod.getFullYear();
    var sLMonth = (oLastPeriod.getMonth() + 1) < 10 ? "0" + (oLastPeriod.getMonth() + 1) : (oLastPeriod.getMonth() + 1);
    var sLDate = "01";
    //var sLDate = oLastPeriod.getDate() < 10 ? "0" + (oLastPeriod.getDate()) : (oLastPeriod.getDate());
    
    var sLastPeriod = sLYear + "-" + sLMonth + "-" + sLDate;
    aObjects.push({date: sLastPeriod});
    
    
    // sPeriod
    var sYear = oPeriod.getFullYear();
    var sMonth = (oPeriod.getMonth() + 1) < 10 ? "0" + (oPeriod.getMonth() + 1) : (oPeriod.getMonth() + 1);
    var sDate = "01";
    //var sDate = oPeriod.getDate() < 10 ? "0" + (oPeriod.getDate()) : (oPeriod.getDate());
    
    var sPeriod = sYear + "-" + sMonth + "-" + sDate;
    aObjects.push({date: sPeriod});
    
    return aObjects;
}


function getPeriods(sStartDate){
    var aObjects = [];
    
    var oStartDate = new Date(sStartDate);
    var oTodayDate = new Date();
    
    oStartDate.setHours(0,0,0,0);
    oTodayDate.setHours(0,0,0,0);
    oTodayDate.setHours(oTodayDate.getHours() - 5);
    
    var bNext = true;
    
    if ( oStartDate.getTime() > oTodayDate.getTime() ) {
        throw {message: "start date it's future date" };
    }
    
    while ( bNext ) {
        if ( oStartDate.getTime() > oTodayDate.getTime() ) {
            bNext = false;
        }
        var sYear = oStartDate.getFullYear();
        var sMonth = (oStartDate.getMonth() + 1) < 10 ? "0" + (oStartDate.getMonth() + 1) : (oStartDate.getMonth() + 1);
        var sDate = oStartDate.getDate() < 10 ? "0" + (oStartDate.getDate()) : (oStartDate.getDate());
        
        var sFullDate = sYear + "-" + sMonth + "-" + sDate;
        
        aObjects.push({date: sFullDate});
        oStartDate.setMonth(oStartDate.getMonth() + 1);
    }
    
    return aObjects;
}


function _ERPFormatDate(date) {
	var oDate = new Date();
	
	if (date) {
	    var ds = date.substring(0, 10);
        var dt = ds.split("-");
        var dy = Number(dt[0]);
        var dm = Number(dt[1]) - 1;
        var dd = Number(dt[2]);
        
        oDate.setFullYear(dy);
        oDate.setMonth(dm);
        oDate.setDate(dd);
	}
	
	var sYear  = oDate.getUTCFullYear(); 
	var sMonth = ("00" + (oDate.getUTCMonth() + 1)).slice(-2); 
	var sDay   = ("00" + oDate.getUTCDate()).slice(-2);
	var sDate = sYear + "-" + sMonth + "-" + sDay + "T00:00:00";
	
	return sDate;
}


function _isEmpty(object){
	if(object === null || object === '' || object === "" || object === undefined){
		return true;
	} else {
		return false;	
	}
}


function _toSeconds(sHour){
	let aHour = sHour.split(":"),
		oDate = new Date();
        
	oDate.setHours(Number(aHour[0]), Number(aHour[1]), Number(aHour[2]));
	
	let iTotalSeconds = ( oDate.getHours() * 3600 ) + 
	    ( oDate.getMinutes() * 60 ) + ( oDate.getSeconds() );
	
	return this._number(iTotalSeconds / 3600);
}


function _number(iNumber, iDecimal){
	let _numm = Number(iNumber);
	if(isNaN(_numm) || _numm === Infinity){
		_numm = 0;
	}
	return Number(_numm.toFixed(iDecimal || 3));
}


function _decimal(iNumber, iDecimal){
	let _numm = Number(iNumber);
	if(isNaN(_numm) || _numm === Infinity){
		_numm = 0;
	}
	return Number(_numm.toFixed(iDecimal || 8));
}


function _toFormatDate(sDate){
    
    if(sDate){
        var _num = parseInt(sDate.substr(6), 10);
        var _date = new Date(_num);
        _date.setHours(_date.getHours() + 5);
        var month = _date.getMonth() + 1;
        if(month < 10){
            month = "0" + month;
        }
        
        sDate = _date.getFullYear() + "-" + (month) + "-" + _date.getDate();
    } else {
        return null;
    }
    return sDate;
}