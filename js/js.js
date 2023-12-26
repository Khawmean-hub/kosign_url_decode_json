function isNull(str) {
    if(str === undefined || str === '' || str === null || str === []){
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
        $('#table-container').empty().append(jsonToTable(JSON.parse(decodeURIComponent(urlStr))));
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
                $('#table-container').empty().append(jsonToTable(obj));
            }else{
                $('#table-container2').empty().append(jsonToTable(obj));
            }
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
            console.log(newList)
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

//JSON to Table
function jsonToTable(json) {
    if(isNull(json)){
        return;
    }
    if(typeof json === 'string'){
        json = JSON.parse(json);
    }
    let html = '<table class="ui celled table small compact striped"><tbody>';
    html += buildObjectTable(json);
    html += '</tbody></table>'
    return html;
}


function buildObjectTable(obj){
    let html = '';

    if(Array.isArray(obj)){
        // isArrayObject
        if(typeof obj[0] === 'object'){
            html += buildArrayTable(obj);
        }else if(typeof obj[0] === 'string' || typeof obj[0] === 'number' || typeof obj[0] === 'boolean'){
            html += '<tr><td>' + obj.join('</td><td>') + '</td></tr>'
        }

    }else{
        $.each(obj, function(i, v){
            if(typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean'){
                html += `<tr><td>${i}</td><td>${v}</td></tr>`
            }else if(typeof v === 'object'){
                html += `<tr><td colspan="2">${i}</td></tr>${buildObjectTable(v)}</tr>`
            }
        })
    }

    return html;
}

function buildArrayTable(arr){
    let html = '<table class="ui celled table small compact striped"><thead>';
    $.each(arr[0], function(i, v){
        html += `<th>${i}</th>`
    })
    html += '</thead><tbody>'
    $.each(arr, function(i, v){
        html += '<tr>'
        $.each(v, function(i, v){
            if(typeof v === 'object'){
                html += `<td>${buildObjectTable(v)}</td>`
            }else if(Array.isArray(v)){
                html += `<td>${buildArrayTable(v)}</td>`
            }else{
                html += `<td>${v}</td>`
            }
        })
        html += '</tr>'
    })
    html += '</tbody></table>'
    return html;
}

function isNotJson(str){
    try{
        JSON.parse(str);
        return false;
    }catch(e){
        return true;
    }
}
