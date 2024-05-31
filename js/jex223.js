// regex
const jexRegex = {
    letterUperCaseReg   : /[A-Z]/g,
    getValueReg         : ".get",
    getValueTo          : ".getString(",
    setValueReg         : ".set",
    setValueTo          : ".put(",
    getvalueStReg       : /.get+[a-zA-Z0-9]+\(\)/g,
    setvalueStReg       : /.set+[a-zA-Z0-9]+\(/g,
    jexDataIn           : /D+[a-zA-Z0-9_]+In/gm,
    jexDataOut          : /D+[a-zA-Z0-9_]+Out/gm,
    inputJex            : /\(D+[a-z0-9_]+In\)+[a-zA-Z]+.getInputDomain\(\)/gm,
    resultJex           : /\(D+[a-z0-9_]+Out\)+[a-zA-Z]+.createResultDomain\(/gm,
    resultJex2          : /\(+[A-Za-z0-9_]+\)/,
    idoJexIn            : /\(+[A-Z0-9_]+In+\)+[ a-zA-Z0-9]+.createIDOData+\(+[A-Z0-9_]+In.class+\)/gm,
    idoInName           : /\(+[A-Z0-9_]+In.class+\)/,
    idoInName2          : /\(+[A-Z0-9_]+In+\)/,
    recToJSONObjec      : /D+[a-z0-9_]+REC/,
    recToJSONObjec2     : /D+[a-z0-9_]+REC\(\)/,
}


let activeProjectId = null;
const defaultProject= [
    {
        name: 'CARDRPT',
        id: 'cardrpt',
        replaceData: [
            {from: 'JexDynamicIDOData',     to: 'IDODynamic'},
            {from: 'JexPTCommonUtil',       to: 'WebCommonUtil'},
            {from: 'JexRecordDataList',     to: 'JexDataList'},
            {from: 'CARDRPT_SESSION',       to: 'CARDMIS_SESSION'},
            {from: 'JexDomainUtil',         to: 'DomainUtil'},
            {from: 'JexBIZException',       to: 'JexWebBIZException'},
            {from: 'JexIDOManager',         to: 'JexConnectionManager'},
            {from: 'SessionManager.getUserSession',         to: 'CardmisSessionManager.getSession'}
        ],
        exclude: 'DateTime, cardrptSession, DateTimeUtils, StringUtils, util'
    }
]

let projects = [];



function findUpercase(str) {
    if(str.split('').every(e => e.match(jexRegex.letterUperCaseReg))) return [];
    var res = str.match(jexRegex.letterUperCaseReg);
    if(isNull(res))
        return [];
    else
        return res;
} // return as array
function findGetvalueStReg(str, include, exclude) {
    var newString = getExclude(str, exclude, jexRegex.getvalueStReg)
    var res  = newString.match(jexRegex.getvalueStReg)
    if(isNull(res))
        return [];
    else
        return res;
} // return as array

function findSetvalueStReg(str, include, exclude) {
    var newString = getExclude(str, exclude, jexRegex.setvalueStReg)
    var res  = newString.match(jexRegex.setvalueStReg)
    if(isNull(res))
        return [];
    else
        return res;
} // return as array

function convertToSqlNaming(str) {
    var ls = findUpercase(str);
    var res = ls.filter(function(item, pos) {
        return ls.indexOf(item) === pos;
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
        var getSp = e.replaceAll(jexRegex.getValueReg, jexRegex.getValueTo);
        var getName = getSp.split('(')[1];
        var naming = convertToSqlNaming(getName)
        naming = '"' +naming.replace('_','')+'")'
        str = str.replaceAll(e, jexRegex.getValueTo + naming)
    });
    return str;
}

function convertSetInput(str, include, exclude) {
    let ls = findSetvalueStReg(str, include, exclude);
    ls.forEach(e => {
        var getSp = e.replaceAll(jexRegex.setValueReg, jexRegex.setValueTo);
        var getName = getSp.split('(')[1];
        var naming = convertToSqlNaming(getName)
        naming = '"' +naming.replace('_','')+'", \t\t'
        str = str.replaceAll(e, jexRegex.setValueTo + naming)
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

    var regLs = [jexRegex.inputJex, jexRegex.resultJex]
    regLs.forEach(reg=>{
        var ls = str.match(reg);
        if(!isNull(ls)){
            ls.forEach(v=>{
                var ls2 = v.match(jexRegex.resultJex2);
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
    var ls = str.match(jexRegex.idoJexIn)
    if(!isNull(ls)){
        ls.forEach(v=>{
            var namels = v.match(jexRegex.idoInName)
            var name = namels[0].replace('(D', '').replace('In.class)', '')
            var namels2 = v.match(jexRegex.idoInName2)
            str = str.replaceAll(namels[0], '("'+ name+'")')
            str = str.replaceAll(namels2[0], '')
        })
    }
    return str;
}

// convert to json object
function convertToJsonObject(str) {

    let ls = str.match(jexRegex.recToJSONObjec);
    if(!isNull(ls)){
        ls.forEach(va=>{
            str = str.replaceAll(va, 'JSONObject')
        })
    }

    let ls1 = str.match(jexRegex.recToJSONObjec2);
    if(!isNull(ls1)){
        ls1.forEach(va=>{
            str = str.replaceAll(va, 'JSONObject()')
        })
    }
    return str;
}

function toJexData(str){
    var regex = [jexRegex.jexDataIn, jexRegex.jexDataOut];
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



function changeProjectName(){
    const name = $('#project_drop .text').html();
    $('#replace_management_modal .header').html(name)
}


function replaceAllStr(str) {
    $.each(getCurrentProject().replaceData,function(i, v){
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

    let res = convertGetInput(str, include, exclude);
    res = convertSetInput(res, include, exclude);
    if(isReplace){
        res = replaceAllStr(res);
    }
    
    return res;
}

function onChangeProject(){
    $("#btn_delete_project").removeClass('disabled');
    activeProjectId = $("#project_drop").dropdown("get value");
    buildCheck();
    buildExclude();
    buildReplaceTable();
    changeProjectName();
    onReplaceJex();
}


function buildProjectDrop(){
    projects = getProjectFromLocal();
    const projectsDropList = projects.flatMap(e=>{ return {value: e.id, name: e.name, selected: projects.length === 1}});
    $("#project_drop .menu").empty().append(projectsDropList.map(e=> `<div class="item" data-value="${e.value}">${e.name}</div>`));
    $("#project_drop").dropdown();
    if(isNull(projects) || projects.length === 0){
        $('#project_drop .default.text').html('Please add new project.')
    }else{
        $('#project_drop .default.text').html('Select Project')
        if(projects.length===1){
            activeProjectId = projects[0].id;
            $("#project_drop").dropdown('set selected', activeProjectId);
        }
    }
}

function getProjectFromLocal(){
    let ls = localStorage.getItem('projects_list');
    if(!isNull(ls)){
        return  JSON.parse(ls);
    }
}

function confirmSaveDefault(){
    if(isNull(getProjectFromLocal())){
        // const ask = confirm('Do you want to save default project?')
        // if (!ask) return;
        localStorage.setItem('projects_list', JSON.stringify(defaultProject))
    }
}

function saveProjectToLocal(projects){
    localStorage.setItem('projects_list', JSON.stringify(projects))
}

function generateProjectId(name){
    return Math.floor(Math.random() * (1000 - 100 + 1) + 100) + '_' + name.toLowerCase().replaceAll(' ', '_');
}
function buildCheck(){
    var html='';
     getCurrentProject().replaceData.forEach(v=>{
        html += `<div class="ui checkbox" style="margin-right: 20px">
                    <input type="checkbox" class="m_check" checked>
                    <label>${v.from} => ${v.to}</label>
                </div>`;
    })
    $('#check_con').empty().append(html)
}

function onCheckExcludeSave() {
    try{
        var exclude = localStorage.getItem('my_exclude');
        if (isNull(exclude)){
            exclude = defalutExclude;
            localStorage.setItem('my_exclude', exclude)
        }

    }catch(e){

    }
}

function getCurrentProject(){
    return projects.find(e=> e.id === activeProjectId);
}

function buildExclude(){
    $('#exclude_txt').val(getCurrentProject().exclude)
}


//Save new project
function saveNewProject(){
    const name = $('#new_project_name').val();
    $('#new_project_name').val('')
    const id =generateProjectId(name);
    if(isNull(name)){
        alert('Please fill all field.')
        return;
    }
     const newProject = {
         name: name,
         id: id,
         replaceData: [],
         exclude: ''
     }
    projects.push(newProject);
    saveProjectToLocal(projects);
    buildProjectDrop();
}

//delete project
function deleteProject(){
    if(!confirm('Do you want to delete this project?')) return;
    projects = projects.filter(e=> e.id !== activeProjectId);
    saveProjectToLocal(projects);
    clearAll();
    buildProjectDrop();
    if(projects.length>1){
        $('#project_drop .text').addClass('default').html('Select Project')
        $("#btn_delete_project").addClass('disabled');
        activeProjectId = null;
    }else{
        $('#project_drop .text').addClass('default').html('Please create new project')
        $("#btn_delete_project").addClass('disabled');
        activeProjectId = null;
    }


}

//add project to dropdown

//clear
function clearAll(){
    $('#exclude_txt').val('');
    $('#check_con').empty();
}

//build replace table
function buildReplaceTable(){
    var html = '';
    $.each(getCurrentProject().replaceData, function(i, v){
        html += `<tr>
                    <td>${i+1}</td>
                    <td>${v.from}</td>
                    <td>${v.to}</td>
                    <td><i class="trash alternate outline icon red btn_delete_replace_item" data-value="${i}"></i></td>
                </tr>`
    })
    $('#replace_table tbody').empty().append(html);
}


//on save new replacement
function onSaveNewReplace(){
    const from = $('#from_txt').val();
    const to = $('#to_txt').val();
    if(isNull(from) || isNull(to)){
        alert('Please fill all field.')
        return;
    }
    if(from === to){
        alert('From and To must not be the same.')
        return;
    }
    //is duplicate replace
    const isDuplicate = getCurrentProject().replaceData.find(e=> e.from === from);
    if(!isNull(isDuplicate)){
        alert('This key is already exist.');
        return;
    }
    getCurrentProject().replaceData.push({from: from, to: to});
    saveProjectToLocal(projects);
    buildReplaceTable();
    buildCheck();
    $('#from_txt').val('');
    $('#to_txt').val('');
}


//on delete replace item
function onDeleteReplace(index){
    getCurrentProject().replaceData.splice(index, 1);
    saveProjectToLocal(projects);
    buildReplaceTable();
    buildCheck();
}

// load other replace
function loadOtherReplace(){
    let projectBeside = projects.filter(e=> e.id !== activeProjectId);
    projectBeside = projectBeside.filter(e=> e.replaceData.length > 0)
    let html = '';
    projectBeside.forEach((v, i)=>{
        html += '<h4>'+v.name+'</h4>'
        html += `<table class="ui very compact table small">
                    <tbody>`;
        v.replaceData.forEach((v2, i2)=>{
            html += `<tr>
                        <td>${i2+1}</td>
                        <td>${v2.from}</td>
                        <td>${v2.to}</td>
                        <td style="width: 71.3px">
                        ${isNull(getCurrentProject().replaceData.find(e=> e.from === v2.from)) ?
                        `<button data-value="${v2.from+','+v2.to}" class="ui primary button mini btn_add_key ${isNull(getCurrentProject().replaceData.find(e=> e.from === v2.from)) ? '' : 'disabled' }">
                         Add
                        </button>` : `<a class="ui label" style="background: #e3e3e3">Added</a>`}
                        </td>
                    </tr>`
        });

        html += '</tbody></table>';
    })
    $('#loard_other_replace .content').empty().append(html);
}

// onAddKey
function onSaveReplace(value){
    const from = value.split(',')[0];
    const to = value.split(',')[1];
    getCurrentProject().replaceData.push({from: from, to: to});
    projects.forEach((v, i)=>{
        if(v.id === activeProjectId){
            v.replaceData = getCurrentProject().replaceData;
        }
    })
    saveProjectToLocal(projects);
    buildReplaceTable();
    buildCheck();
    loadOtherReplace();
}
