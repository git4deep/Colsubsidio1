
let oUtil = $.import("logical.model.util", "util");
let oService = $.import("logical.model.bw", "service");
let oImport = $.import("logical.xs_service.import", "im_planos");

var METHOD = $.request.method;
var iRow = 1;

function get() {
	var mResponse = {}; var data = [];
	
	mResponse.code = 1;
	mResponse.data = data;
	mResponse.message = "get not implemented yet.";
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}

function searchTable(mBusqueda){
    var contains = function(needle) {
        // Per spec, the way to identify NaN is that it is not equal to itself
        var findNaN = needle;//!== needle;
        var indexOf;
    
        if(!findNaN && typeof Array.prototype.indexOf === 'function') {
            indexOf = Array.prototype.indexOf;
        } else {
            indexOf = function(needle1) {
                var i = -1, index = -1;
    
                for(i = 0; i < this.length; i++) {
                    var item = this[i];
    
                    if((findNaN && item !== item) || item === needle1) {
                        index = i;
                        break;
                    }
                }
    
                return index;
            };
        }
    
        return indexOf.call(this, needle) > -1;
    };


    var myArray = [ 'logical.data::T_COR_EGRESO_PLANO',
                	'logical.data::T_COR_FONDO_CREDITO_PLANO',
                	'logical.data::T_COR_FONDOS_PLANO',
                	'logical.data::T_COR_INGRESO_CET',
                	'logical.data::T_COR_INGRESO_PLANO',
                	'logical.data::T_COR_INVERSIONES',
                	'logical.data::T_COR_PROY_INVERSION',
                	'logical.data::T_COR_PROYECTO',
                	'logical.data::T_COR_REINTEGRO_VIVIENDA'],

        mIndice = contains.call(myArray, mBusqueda);
        return mIndice;
}

function toDeleteContent(mImport){

    if ( searchTable(mImport.table) ) {
        
    	let conn = $.db.getConnection();
    	let sql; let pstmt;

	    sql = "DELETE FROM \"" + mImport.table + "\" ;";
        pstmt = conn.prepareStatement(sql);
        
        pstmt.execute();
        conn.commit();
        
        pstmt.close();    
        conn.close();
    }
}

function toDeleteFact(mImport){

    if ( searchTable(mImport.table) ) {
        
    	let conn = $.db.getConnection();
    	let sql; let pstmt;
    	
    	sql = "SELECT 1 FROM DUMMY;";
        if (mImport.table === 'logical.data::T_COR_PROY_INVERSION') {
            sql = "TRUNCATE TABLE \"logical.data::T_COR_INVERSIONES\";";
    	}
    	if (mImport.table === 'logical.data::T_COR_PROYECTO') {
            sql = "TRUNCATE TABLE \"logical.data::T_COR_REINTEGRO_VIVIENDA\";";
    	}
        pstmt = conn.prepareStatement(sql);
        
        pstmt.execute();
        conn.commit();
        
        pstmt.close();    
        conn.close();
    }
}



function isValidDate(date){
	var IsoDateRe = new RegExp("^([0-9]{4})-([0-9]{2})-([0-9]{2})$");
	var matches = IsoDateRe.exec(date);
	if (!matches) {
		return false;
	} 

	var composedDate = new Date(matches[1], (matches[2] - 1), matches[3]);
	
	return ((composedDate.getMonth() === (oUtil._number(matches[2]) - 1)) && 
			(composedDate.getDate() === oUtil._number(matches[3])) &&
			(composedDate.getFullYear() === oUtil._number(matches[1])));
}

function toValidColumn(mColumn, value){
		
	if ( mColumn.DATA_TYPE_NAME === "DATE" ) {
		if ( !isValidDate(value) ) {
			throw { message: "Fila " + iRow + ", " + value + ": No es una fecha valida el formato es YYYY-MM-DD" };
		}
	}
	if ( mColumn.DATA_TYPE_NAME === "INT" || mColumn.DATA_TYPE_NAME === "INTEGER" ) {
		if ( isNaN(Number(value)) ) {
			throw { message: "Fila " + iRow + ", " + value + ": No es un INT" };
		}
	}
	if ( mColumn.DATA_TYPE_NAME === "DECIMAL" ) {
		if ( isNaN(Number(value)) ) {
			throw { message: "Fila " + iRow + ", " + value + ": No es un DECIMAL" };
		} else {
			var aValue = value.split(".");
			if ( aValue.length > 0 ) {
				if ( aValue[0].length > mColumn.LENGTH ) {
					throw { message: "Fila " + iRow + ", " + value + ": Supera su longitud de " + mColumn.LENGTH };
				}
			}
		}
	}
	if ( mColumn.DATA_TYPE_NAME === "VARCHAR" || mColumn.DATA_TYPE_NAME === "NVARCHAR" ) {
		if ( value === null || typeof value !== "string" ) {
			throw { message: "Fila " + iRow + ", " + value + ": No es un NVARCHAR" };
		}
		if ( value.length > mColumn.LENGTH ) {
			throw { message: "Fila " + iRow + ", " + value + ": Supera su longitud de " + mColumn.LENGTH };
		}
	}
}

function toCreateSql(sTable, aInfo, mRow){
	var sParameters = "";
	var sValues = "";
	
	aInfo.forEach(function(mInfo){
		sParameters += mInfo.COLUMN_NAME + ", ";
	});
	sParameters = sParameters.substring(0, sParameters.length - 2);
	
	for (var k = 0; k < mRow.length; k++) {
		if ( !oUtil._isEmpty(mRow[k].trim()) ){
			
			if  ( aInfo[k].DATA_TYPE_NAME === "INT" || aInfo[k].DATA_TYPE_NAME === "INTEGER" || aInfo[k].DATA_TYPE_NAME === "DECIMAL" ) {
				sValues += oUtil._number(mRow[k]) + ", ";
			} else {
				sValues += "'" + mRow[k] + "', ";
			}
			
		} else {
			sValues += "null, ";
		}
	}
	sValues = sValues.substring(0, sValues.length - 2);
	
	var sSql =  "INSERT INTO \"" + sTable + "\"( " + sParameters + " ) VALUES ( " + sValues + " );";
	
	return sSql;
}




function toCkech(mImport){
	var aSql = [];
	var sTable = mImport.table;
	var aInfo = mImport.info;
	var aRows = mImport.rows;
    //console.log("mIMport:" + mImport);
	//console.log("inside tocheck");
	aRows.forEach(function(mRow){
        if ( aInfo.length !== mRow.length ) {
        	throw { message: "Fila " + iRow + ", la longitud de la fila no corresponde: " + JSON.stringify(mRow) };
        }
		for (var k = 0; k < mRow.length; k++) {
			if ( !oUtil._isEmpty(mRow[k]) ){
				toValidColumn(aInfo[k], mRow[k]);
			}
		}
		var sSql = toCreateSql(sTable, aInfo, mRow);
		aSql.push(sSql);
		iRow ++;
	});
	return aSql;
}


function toInsert(aSql){
	var conn = $.db.getConnection();
	
    //console.log("inside insert");

	aSql.forEach(function(mSql){
		var pstmt = conn.prepareStatement(mSql);
		pstmt.execute();
        //console.log("executed" +pstmt );
		pstmt.close();
	});
	
	conn.commit();
	conn.close();
}


function post() {
	var mJson = JSON.parse($.request.body.asString());
	
	var mResponse = {}; var mData = {};
	
	try {
		 if( mJson ){
			var mImport = mJson;
			//console.log("mImport: " + mImport);
			var aSql = toCkech(mImport);
			
           // console.log("aSQL :" + aSql);
			if ( mImport.delete ) {
			    toDeleteFact(mImport);
				toDeleteContent(mImport);
			}
			
			toInsert(aSql);
			oImport.exportData(mImport);
			
			mResponse.code = 1;
			mResponse.data = mData;
			mResponse.message = "Transaction completed";
			
		} else {
			mResponse.code = 2;
			mResponse.data = mData;
			mResponse.message = "Parameter not valid";
		}
	} catch (ex) {
		mResponse.code = 3;
		mResponse.data = mData;
		mResponse.message = ex.message;
	}
	
	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify(mResponse));
}

switch (METHOD) {
  case $.net.http.GET:
	get();
	break;

  case $.net.http.POST:
	post();
	break;
}