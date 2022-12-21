// regex
var letterUperCaseReg   = /[A-Z]/g;
var getValueReg         = ".get";                   var getValueTo = ".getString(";
var setValueReg         = ".set";                   var setValueTo = ".put(";
var getvalueStReg       = /.get+[a-zA-Z0-9]+\(\)/g;
var setvalueStReg       = /.set+[a-zA-Z0-9]+\(/g;
var replaceJson = [
    {from: 'JexDynamicIDOData',     to: 'IDODynamic'},
    {from: 'JexPTCommonUtil',       to: 'WebCommonUtil'},
    {from: 'JexRecordDataList',     to: 'JexDataList'},
    {from: 'CARDRPT_SESSION',       to: 'CARDMIS_SESSION'}, 
]






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

function conVertJexInput(str, include, exclude) {
    var res = convertGetInput(str, include, exclude);
    res = convertSetInput(res, include, exclude);
    return res;
}


