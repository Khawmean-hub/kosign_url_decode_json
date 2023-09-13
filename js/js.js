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
        } catch (error) {
            
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
                return a.name > b.name ? -1 : 1;
              });

            var html = '';
            $.each(oldData, function(i, v){
                html += `<div class="box">
                    <button class="circular ui icon button mini btn_box_close">
                       <i class="close icon"></i>
                    </button>
                       <div class="btn_box" data-val="${encodeURIComponent(JSON.stringify(v.data))}"> <p>${v.name}</p>
                       <small>${v.date}</small></div>
               </div>`
                
            })
            $('#save_data_rec').empty().append(html);
            $('.save1 pre').html('');
        }else{
            saveNoData();
        }
    } catch (error) {
        
    }
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
                return a.name > b.name ? -1 : 1;
            });
            var newList =[] 
            $.each(oldData, function(i, v) {
                if(i != index){
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
        var keys = [];
        if(str.includes('\\n')){
            keys = str.split('\n');
        }
        if (str.includes(',')){
            keys = str.split(',');
        }
        if (str.includes(' ')){
            keys = str.split(' ');
        }
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