// regex
var letterUperCaseReg   = /[A-Z]/g;
var getValueReg         = ".get";                   
var getValueTo          = ".getString(";
var setValueReg         = ".set";                   
var setValueTo          = ".put(";
var getvalueStReg       = /.get+[a-zA-Z0-9]+\(\)/g;
var setvalueStReg       = /.set+[a-zA-Z0-9]+\(/g;
var jexDataIn           = /D+[a-zA-Z0-9_]+In/gm
var jexDataOut          = /D+[a-zA-Z0-9_]+Out/gm;
// var jexDataIdoIn        = /D+[a-z0-9_]+In/gm                                                                                                                                                                      = /D+[a-z0-9_]+Out/gm;
var inputJex            = /\(D+[a-z0-9_]+In\)+[a-zA-Z]+.getInputDomain\(\)/gm;
var inputJexTo          = '.getInputDomain()';
var resultJex           = /\(D+[a-z0-9_]+Out\)+[a-zA-Z]+.createResultDomain\(/gm;
var resultJexTo         = '.createResultDomain()';
var resultJex2          = /\(+[A-Za-z0-9_]+\)/
var idoJexIn            = /\(+[A-Z0-9_]+In+\)+[ a-zA-Z0-9]+.createIDOData+\(+[A-Z0-9_]+In.class+\)/gm;
var idoInName           = /\(+[A-Z0-9_]+In.class+\)/;
var idoInName2           = /\(+[A-Z0-9_]+In+\)/;
var idoVariIn           = /D+[A-Z0-9_]+In/gm;
var idoVariOut          = /D+[A-Z0-9_]+Out/gm;
var recToJSONObjec      = /D+[a-z0-9_]+REC/;
var recToJSONObjec2     = /D+[a-z0-9_]+REC\(\)/;

var replaceJson = [
    {from: 'JexDynamicIDOData',     to: 'IDODynamic'},
    {from: 'JexPTCommonUtil',       to: 'WebCommonUtil'},
    {from: 'JexRecordDataList',     to: 'JexDataList'},
    {from: 'CARDRPT_SESSION',       to: 'CARDMIS_SESSION'},
    {from: 'JexDomainUtil',         to: 'DomainUtil'},
    {from: 'JexBIZException',       to: 'JexWebBIZException'},
    {from: 'JexIDOManager',         to: 'JexConnectionManager'},
    {from: 'SessionManager.getUserSession',         to: 'CardmisSessionManager.getSession'}
    
]
var defalutExclude = 'DateTime, cardrptSession, DateTimeUtils, StringUtils, util';





function findUpercase(str) {
    var res = str.match(letterUperCaseReg);
    if(isNull(res))
        return [];
    else
        return res;
} // return as array
function findGetvalueStReg(str, include, exclude) {
    var newString = getExclude(str, exclude, getvalueStReg)
    var res  = newString.match(getvalueStReg)
    if(isNull(res))
        return [];
    else
        return res;
} // return as array

function findSetvalueStReg(str, include, exclude) {
    var newString = getExclude(str, exclude, setvalueStReg)
    var res  = newString.match(setvalueStReg)
    if(isNull(res))
        return [];
    else
        return res;
} // return as array

function convertToSqlNaming(str) {
    var ls = findUpercase(str);
    var res = ls.filter(function(item, pos) {
        return ls.indexOf(item) == pos;
    })
    res.forEach(e => {
        str = str.replaceAll(e, '_' + e);
    });
    if(isNull(res))
        return str;
    else
        return str.toUpperCase();
    
}


function convertGetInput(str,include ,exclude) {
    var ls = findGetvalueStReg(str, include, exclude);
    ls.forEach(e => {
        var getSp = e.replaceAll(getValueReg, getValueTo);
        var getName = getSp.split('(')[1];
        var naming = convertToSqlNaming(getName)
        naming = '"' +naming.replace('_','')+'")'
        str = str.replaceAll(e, getValueTo + naming)
    });
    return str;
}

function convertSetInput(str, include, exclude) {
    var ls = [];
    ls = findSetvalueStReg(str, include, exclude);
    ls.forEach(e => {
        var getSp = e.replaceAll(setValueReg, setValueTo);
        var getName = getSp.split('(')[1];
        var naming = convertToSqlNaming(getName)
        naming = '"' +naming.replace('_','')+'", \t\t'
        str = str.replaceAll(e, setValueTo + naming)
    });
    return str;
}


const stringToRegex = str => {
    // Main regex
    const main = str.match(/\/(.+)\/.*/)[1]
    
    // Regex options
    const options = str.match(/\/.+\/(.*)/)[1]
    
    // Compiled regex
    return new RegExp(main, options)
}


function getExclude(str, exclude, filter){
    if(!isNull(exclude)){
        var exls = exclude.split(',')
        exls = exls.map(e=> e.trim());
        exls.forEach((ex)=>{
            if(!isNull(ex)){
                var nF = filter+'';
                nF = nF.replace('/','/' + ex);
                var newFilter = stringToRegex(nF);
                var ls = str.match(newFilter);
                if(!isNull(ls)){
                    ls.forEach(e => {
                        str = str.replaceAll(e, '')
                    })
                }
            }
        })
    }
    
    return str;
}

function findObjexToJexData(str){

}

// change from Dcardrpt_0041_02_r001In input  => util.getInputDomain();
function changeInputAndResult(str) {

    var regLs = [inputJex, resultJex]
    regLs.forEach(reg=>{
        var ls = str.match(reg);
        if(!isNull(ls)){
            ls.forEach(v=>{
                var ls2 = v.match(resultJex2);
                if(!isNull(ls2)){
                    ls2.forEach(v2=>{
                        str = str.replaceAll(v2, '')
                    })
                }
               
            })
        }
        
    })
    return str;
}

// change IDOIn
function changeIdoIn(str) {
    var ls = str.match(idoJexIn)
    console.log(ls)
    if(!isNull(ls)){
        ls.forEach(v=>{
            var namels = v.match(idoInName)
            var name = namels[0].replace('(D', '').replace('In.class)', '')
            var namels2 = v.match(idoInName2)
            str = str.replaceAll(namels[0], '("'+ name+'")')
            str = str.replaceAll(namels2[0], '')
        })
    }
    return str;
}

// convert to json object
function convertToJsonObject(str) {

    var ls = str.match(recToJSONObjec);
    if(!isNull(ls)){
        ls.forEach(va=>{
            str = str.replaceAll(va, 'JSONObject')
        })
    }

    var ls = str.match(recToJSONObjec2);
    if(!isNull(ls)){
        ls.forEach(va=>{
            str = str.replaceAll(va, 'JSONObject()')
        })
    }
    return str;
}

function toJexData(str){
    var regex = [jexDataIn, jexDataOut];
    regex.forEach(v=>{
       var ls =  str.match(v);
       if(!isNull(ls)){
            ls.forEach(va=>{
                str = str.replaceAll(va, 'JexData')
            })
       }
    })
    return str;
}






function replaceAllStr(str) {
    $.each(replaceJson,function(i, v){
        if($('.m_check').eq(i).prop('checked')){
            str = str.replaceAll(v.from, v.to);
        }
    })
    return str;
}


function conVertJexInput(str, include, exclude, isReplace) {

    //convert input object
    str = changeInputAndResult(str);

    //convert ido in
    str = changeIdoIn(str)

    //convert to JSONObject
    str = convertToJsonObject(str);

    //convert to JexData class
    str = toJexData(str)

    var res = convertGetInput(str, include, exclude);
    res = convertSetInput(res, include, exclude);
    if(isReplace){
        res = replaceAllStr(res);
    }
    
    return res;
}


