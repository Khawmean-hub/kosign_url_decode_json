function isNull(str) {
    if(str === undefined || str === '' || str === null || str == []){
        return true
    }else
        return false;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


function decode() {
    try{
        var urlStr = $('#url_text').val()
        var str = JSON.stringify(JSON.parse(decodeURIComponent(urlStr)), undefined, 4);
        $('#url_result').html(syntaxHighlight((str)))
        $('#table-container').empty().append(generateJson2Table(JSON.parse(decodeURIComponent(urlStr))));
    }catch(e){
       if($('#url_text').val() != ''){
        onMessage(e, 'error')
       }else{
        $('#url_result').empty()
       }
        
    }
 
}

function save() {
    $('.save1 pre').html(syntaxHighlight( $('#url_result').text()))
}

function checkLiveMode(){
    var live = localStorage.getItem('kosign_live_mode');
    if(live=='true'){
        $('#url_text').on('input',function(){
            decode();
        })
        $('#live_mode').prop('checked', true);
    }else{
        $('#live_mode').prop('checked', false);
        $('#url_text').off()
    }
    
   
}

function copy(str) {
    $('#tem_input').val(JSON.stringify(JSON.parse(str)));
    var copyText = document.getElementById('tem_input');
    copyText.select();
   // copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value);
}


function formatJson(id) {
    var obj = $(id).text()
    if(!isNull(obj)){
        try {
            var str = JSON.stringify(JSON.parse(obj), undefined, 4);
            $(id).html(syntaxHighlight((str)))
            if(id==='#url_result'){
                $('#table-container').empty().append(generateJson2Table(obj));
            }else{
                $('#table-container2').empty().append(generateJson2Table(obj));
            }
        } catch (error) {
            onMessage('Invalid json', 'error')
        }
    }
}


function formatJsonRaw(obj) {
    if(!isNull(obj)){
        try {
            var str = JSON.stringify(JSON.parse(obj), undefined, 4);
            return syntaxHighlight((str));
        } catch (error) {
            onMessage('Invalid json', 'error')
        }
    }
}


function loadData() {
    try {
        var oldData = localStorage.getItem('kosign_save_data')
        if(!isNull(oldData)){
            oldData = JSON.parse(oldData)
            oldData.sort(function(a,b){
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return sortByDate(a, b);
              });

            var html = '';
            $.each(oldData, function(i, v){
                html += `<div class="box" style="background: ${isNull(v['color']) ? '#f5f5f5' : v['color']}">
                        <div class="ui icon left pointing dropdown mini icon_mini btn_box_close">
                            <i class="ellipsis vertical icon"></i>
                            <div class="menu">
                            <div class="item btn_change_color" style="padding: 6px !important;">
                                <i class="dropdown icon"></i>
                                <span class="text"><i class="circle icon pink"></i>
                                    Color</span>
                                    <div class="menu">
                                    <div class="item" style="padding: 6px !important;">
                                       <div class="btn_colors" style="display: grid; grid-template-columns: auto auto auto auto auto; grid-gap: 5px">
                                       <a class="ui red empty circular label" data-color="#ffdede"></a>
                                        <a class="ui orange empty circular label" data-color="#ffcfbf"></a>
                                        <a class="ui yellow empty circular label" data-color="#ffedbf"></a>
                                        <a class="ui olive empty circular label" data-color="#f7ffbf"></a>
                                        <a class="ui green empty circular label" data-color="#ccffbf"></a>
                                        <a class="ui teal empty circular label" data-color="#bfffdf"></a>
                                        <a class="ui blue empty circular label" data-color="#cfe8ff"></a>  
                                        <a class="ui violet empty circular label" data-color="#dfd9ff"></a>
                                        <a class="ui purple empty circular label" data-color="#e9bfff"></a>
                                        <a class="ui pink empty circular label" data-color="#ffbff5"></a>
                                        <a class="ui brown empty circular label" data-color="#ffe0cc"></a>
                                        <a class="ui grey empty circular label" data-color="#f5f5f5"></a>
<!--                                        <a class="ui black empty circular label" data-color="#ffb3b3"></a>-->
                                        </div>
                                    </div>
                                  </div>
                                </div>
                                <div class="item btn_rename" style="padding: 6px !important;">
                                    <i class="edit outline icon blue"></i>
                                    Rename</div>
                                
                                <div class="item btn_delete" style="padding: 6px !important;">
                                    <i class="trash alternate outline icon red"></i>
                                    Delete</div>
                            </div>
                        </div>
                        <div class="btn_box" data-val="${encodeURIComponent(JSON.stringify(v.data))}">
                            <p>${v.name}</p>
                            <div class="ui input mini" style="display: none">
                                <input type="text" placeholder="Rename" value="${v.name}">
                            </div>
                            <div style="margin-top: 3px;"><small>${new moment(v.date.replace('|','')).format('YYYY-MM-DD | hh:mm a')}</small></div></div>
                        <div class="mini_menu" style="display: none">
                            <a class="item btn_done">
                                <i class="check circle outline icon"></i>
                            </a>
                            <a class="item btn_cancel">
                                <i class="close icon red"></i>
                            </a>
                        </div>
                    </div>`
                
            })
            $('#save_data_rec').empty().append(html);
            $('.save1 pre').html('');
            $('#table-container2').empty();
        }else{
            saveNoData();
        }
    } catch (error) {
        
    }
    $('.ui.dropdown')
        .dropdown()
    ;
}

function saveNoData(){
    $('#save_data_rec').empty().append('<div style="padding: 30px;border: 1px solid gainsboro; border-radius: 10px;"><h4 style="color: rgb(146, 146, 146);">No Data</h4></div>');
}


function onRemoveData(index){
    try {
        var oldData = localStorage.getItem('kosign_save_data')
        if(!isNull(oldData)){
            oldData = JSON.parse(oldData)
            oldData.sort(function(a,b){
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return sortByDate(a, b);
            });
            var newList =[] 
            $.each(oldData, function(i, v) {
                if(i !== index){
                    newList.push(v);
                }
            })
            localStorage.setItem('kosign_save_data', JSON.stringify(newList))
        }
    } catch (error) {
        
    }
}

function onMessage(str, type, duration=3000){
    var id = '';
    var size = 7;
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let index = 0; index < size; index++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length-1));
    }
    $('#message-block').append('<div class="message-main" id="'+id+'"></div>')

    var status='';
    switch(type){
        case 'error':
            status = '#fc1e4b'
            break;
        case 'success':
            status = '#456aff'
            break
        default:
            status = '#45ff4b'
            break;
    }

    $('#' +id).text(str);
    $('#' +id).css({'borderLeft': '3px solid' + status})
    $('#' +id).animate({"right": '+=250'});
    setTimeout(function(){
        $('#' +id).animate({"right": '-=250'});
        setTimeout(function(){$('#' +id).remove();}, 300)
    }, duration)
}


function change_theme(dark_mode) {
	if (dark_mode) {
		// for contrast with child segments
		$("#body_container").css("background-color", "#121212");
		// most Semantic UI elements have the "ui" class
		// useful to skip over elements with some class, such as "ignore_dark_mode"
		$(".ui").not(".ignore_dark_mode").addClass("inverted");
		// change the state of all dark mode toggle buttons
		$(".dark_mode_toggle:checkbox").prop("checked", true);
	} else {
		$("#body_container").css("background-color", "");
		$(".inverted").not(".ignore_dark_mode").removeClass("inverted");
		$(".dark_mode_toggle:checkbox").prop("checked", false);
	}
}

function camelToSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toUpperCase();
}
function snakeToCamelCase(str) {
    return str.toLowerCase().replace(/_([a-z])/g, function(match) {
        return match[1].toUpperCase();
    });
}
function findKey(jsonString){
    const regex = /"([^"]+)":/g;
    const keys = [];
    let matches = regex.exec(jsonString);
    while (matches !== null) {
        keys.push(matches[1]);
        matches = regex.exec(jsonString);
    }
    return keys;
}

function replaceAllToCamelCase(str){
    var keys = findKey(str);
    keys.forEach(v=>{
        if(isSnakeCase(v)){
            str = str.replaceAll('"'+v+'"', '"'+snakeToCamelCase(v)+'"')
        }else if(isUpperCase(v)){
            str = str.replaceAll('"'+v+'"', '"'+v.toLowerCase()+'"')
        }
    })
    return str;
}

function replaceAllToSnakeCase(str){
    var keys = findKey(str);
    keys.forEach(v=>{
        if(isLowerCase(v)){
            str = str.replaceAll('"'+v+'"', '"'+v.toUpperCase()+'"')
        }else if(isCamelCase(v) && !isUpperCase(v)){
            str = str.replaceAll('"'+v+'"', '"'+camelToSnakeCase(v)+'"')
        }
    })
    return str;
}


function isSnakeCase(str) {
    return str.indexOf('_') !== -1;
}
function isCamelCase(str) {
    return str.indexOf('_') === -1;
}

function isUpperCase(str) {
    return str === str.toUpperCase();
}
function isLowerCase(str) {
    return str === str.toLowerCase();
}


function onlyKeyToJson(str){

    try {
        JSON.parse(str);
        return str;
    }catch (e){
        var keys = str.match(/\w+/g)
        if (keys.length === 0) return;
        var jsonString = '{';
        keys.forEach(v=>{
            v= v.trim();
            if(v !== ''){
                jsonString += '"'+v+'": "",'
            }
        })
        jsonString = jsonString.substring(0, jsonString.length - 1);
        return jsonString + '}';
    }
}

function getLastName(str){
    var ls = str.split('|');
    return ls[ls.length - 1];
}

function sortByDate(a, b){
    return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
}

function onRename(parent){
    var index = $(parent).index()
    if(isNull($(parent).find('.btn_box .input input').val())){
        return;
    }
    var oldData = localStorage.getItem('kosign_save_data')
    if(!isNull(oldData)){
        oldData = JSON.parse(oldData)
        oldData.sort(function(a,b){
            return sortByDate(a, b);
        });
        oldData[index].name = $(parent).find('.btn_box .input input').val();
        $(parent).find('.btn_box p').text($(parent).find('.btn_box .input input').val())
        localStorage.setItem('kosign_save_data', JSON.stringify(oldData))
    }
    onCancel($(parent))
    // loadData()
}


const type = {
    isObject: (obj) => Object.prototype.toString.call(obj) === '[object Object]',
    isArray: (arr) => Object.prototype.toString.call(arr) === '[object Array]',
    isString: (str) => Object.prototype.toString.call(str) === '[object String]',
    isNumber: (num) => Object.prototype.toString.call(num) === '[object Number]',
}


const tableString = {
    table: () => '<table class="ui celled table small compact striped">',
    table2: (val) => '<table class="ui celled table small compact striped">' + val + '</table>',
    thead: () => '<thead>',
    tbody: () => '<tbody>',
    tr: () => '<tr>',
    tr1: (val) => '<tr>' + val + '</tr>',
    td: () => '<td>',
    th: () => '<th>',
    td: (val, col) => '<td colspan="' + col + '">' + val + '</td>',
    th: (val) => '<th>' + val + '</th>',
    tableEnd: () => '</table>',
    theadEnd: () => '</thead>',
    tbodyEnd: () => '</tbody>',
    trEnd: () => '</tr>',
    tdEnd: () => '</td>',
    thEnd: () => '</th>'
}

function generateJson2Table(json){
    let html = tableString.table();
    if(type.isObject(json)){
        html += builder.objectBuilder(json);
    }else if(type.isArray(json)){
        html += builder.arrayBuilder(json);
    }
    html += tableString.tableEnd();
    return html;
}

const builder = {
    objectBuilder: (obj) => {
        let html = '';
        $.each(obj, (key, value) => {
            if(type.isObject(value)){
                html += builder.objectObjectBuilder(key, value);
            }else if(type.isArray(value)){
                html += builder.objectArrayBuilder(key, value);
            }else{
                html += builder.stringBuilder(key, value);
            }
        })
        return html;
    },
    arrayBuilder: (arr) => {
        let html = '';
        if(arr.length===0) return '';
        if(type.isObject(arr[0])){
            html += builder.arrayObjectBuilder(arr);
        }else if(type.isArray(arr[0])){
            html += builder.arrayArrayBuilder(arr);
        }else{
            html += builder.arrayStringBuilder(arr);
        }
        return html;
    },
    objectObjectBuilder: (key, value) => {
        let html = '';
        html += tableString.tr();
        html += tableString.td(key);
        html += tableString.td(builder.objectBuilder(value));
        html += tableString.trEnd();
        return html;
    },
    objectArrayBuilder: (key, value) => {
        let html = '';
        html += tableString.tr();
        html += tableString.td('<b>'+key+'</b>', 2);
        //html += tableString.td(builder.arrayBuilder(value));
        html += tableString.tr1(tableString.td(builder.arrayBuilder(value),2));
        html += tableString.trEnd();
        return html;
    },
    objectStringBuilder: (obj) => {
        let html = '';
        $.each(obj, (key, value) => {
            html += builder.stringBuilder(value);
        })
        return html;
    },
    arrayObjectBuilder: (obj) => {
        let html = tableString.table();
        html += tableString.thead();
        html += tableString.tr();
        $.each(obj[0], (k, v) => {
            html += tableString.th(k);
        })
        html += tableString.trEnd();
        html += tableString.theadEnd();
        html += tableString.tbody();
        $.each(obj, (k, v) => {
            html += tableString.tr();
            $.each(v, (key, value) => {
                if(type.isObject(value)){
                    html += tableString.td(tableString.table2(builder.objectBuilder(value)));
                }else if(type.isArray(value)){
                    html += tableString.td(builder.arrayBuilder(value));
                }else{
                    html += tableString.td(value);
                }
            })
            html += tableString.trEnd();
        })
        html += tableString.tbodyEnd();
        html += tableString.tableEnd();
        return html;
    },
    arrayArrayBuilder: (obj) => {
        let html = tableString.table();
        $.each(obj, (k, v) => {
            html += tableString.tr();
            html += tableString.td(builder.arrayBuilder(v));
            html += tableString.trEnd();
        })
        html += tableString.tableEnd();
        return html;
    },
    arrayStringBuilder: (obj) => {
        let html = tableString.table();
        html += tableString.tbody();
        $.each(obj, (k, v) => {
            html += tableString.tr();
            html += tableString.td(v);
            html += tableString.trEnd();
        })
        html += tableString.tbodyEnd();
        html += tableString.tableEnd();
        return html;
    },
    stringBuilder: (key, value) => {
        let html = tableString.tr();
        html += tableString.td(key);
        html += tableString.td(value);
        html += tableString.trEnd();
        return html;
    },
}

function isNotJson(str){
    try{
        JSON.parse(str);
        return false;
    }catch(e){
        return true;
    }
}


function createDragBox(data){
    const id ='drage_box_id_'+ Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal
    const html = `<div id="${id}" class="ui-widget-content draggable" style="border-radius: 10px;">
            <div id="${id+'_resize'}" class="ui-widget-content" style="border-radius: 10px; min-width: 210px; min-height: 80px; max-height: 100vh; height: 300px;">
                <h3 class="ui-widget-header" style="display: grid; grid-template-columns: auto 25px; border-radius: 10px 10px 0 0; margin: 0;">
                    <div style="padding-left: 10px;">
                        <span class="mini_btn btn_mini_format"><i class="quidditch icon small"></i></span>
                        <span class="mini_btn btn_mini_copy"><i class="copy icon small"></i></span>
                    </div>
                    <div style="padding-top: 2px;">
                        <i class="times circle outline icon btn_detroy" style="color: #bbb9b9; cursor: pointer;"></i>
                    </div>
                </h3>
                <div style="background: rgb(244 244 244); height: calc(100% - 26px);border-radius: 0 0 10px 10px; padding: 10px">
                    <div style="height: 100%; ">
                        <pre contenteditable="true" style="margin: 0; height: 100%; overflow: auto;" spellcheck="false">
                        </pre>
                    </div>
                </div>
            </div>
        </div>`
    $('.all_drage_box').append(html);
    $('#'+id+'_resize pre').html(formatJsonRaw(data))
    $('#'+id).css({position: "absolute", zIndex: 999999})
    $( "#"+id ).draggable({ handle: ".ui-widget-header",});
    $( "#"+id+'_resize' ).resizable();
}