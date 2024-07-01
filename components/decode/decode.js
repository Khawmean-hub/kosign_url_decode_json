//====================== Variable =======================
$rightBox = $('#right_part')
$leftBox = $('#left_part')
$urlInput = $('#url_text')
$decodeResult = $('#url_result')
$saveBoxResult = $('.save1 pre')
const resizeOption = {
    handles: 'e',
    resize: function (event, ui) {
        const containerWidth = $("#layout").width();
        const leftWidth = ui.size.width;
        const rightWidth = containerWidth - leftWidth;
        $("#right_part").width(rightWidth);
    }
}


//===================================================== Events ==================================================
$(document).on('click', '.btn_show_right', onShowRightBox);
$("#left_part").resizable(resizeOption);
$(document).on('click', '.btn_decode', onDecode)
$(document).on('input', '#url_text', onDecode)
$(document).on('click', '#btn_paste_url', onPasteUrl)
$(document).on('click', '.btn_save', onSave)
$(document).on('click', '#btn_make_drag_box', onMakeNewDrage)
$(document).on('click','.btn_mini_format', function () {
    $(this).parents('.draggable').find('pre').html(formatJsonRaw($(this).parents('.draggable').find('pre').text()))
})
$(document).on('click','.btn_mini_copy', function () {
    copyToClipboard($(this).parents('.draggable').find('pre').text())
})
$(document).on('click','.btn_detroy', function () {
    $(this).parents('.draggable').remove();
})
$('.btn_keys_json').click(function (){
    $decodeResult.text(onlyKeyToJson($decodeResult.text()))
    formatJson('#url_result')
})
$('.btn_format').click(function () {
    formatJson('#url_result');
})
$('.btn_format2').click(function () {
    formatJson('.save1 pre');
})
$('.btn_copy').click(function () {
    copyToClipboard($decodeResult.text())
    
})
$('.btn_copy2').click(function () {
    copyToClipboard($saveBoxResult.text())
})




//===================================================== Functions ==================================================
/**
 * On Save json to local storage
 */
function onSave() {
    let $result = $decodeResult;
    try {
        $saveBoxResult.html(syntaxHighlight($result.text()))
        const newObj = {
            name: Object.keys(JSON.parse($result.text()))[0],
            date: moment().format('YYYY-MM-DD | hh:mm:ss a'),
            data: JSON.parse($result.text())
        };

        let oldData = localStorage.getItem('kosign_save_data');
        if (oldData) {
            oldData = JSON.parse(oldData)
            oldData.sort(function (a, b) {
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return sortByDate(a, b);
            });

            // newObj.name = 'Save ' + rank++;
            oldData.push(newObj)
            localStorage.setItem('kosign_save_data', JSON.stringify(oldData))
        } else {
            const ls = [];
            ls.push(newObj);
            localStorage.setItem('kosign_save_data', JSON.stringify(ls))
        }
        loadData();
    } catch (error) {
        toastr.error(MSG.NO_DATA)
    }
}


function onShowRightBox() {
    if ($rightBox.css('display') === 'block') {
        $rightBox.hide()
        $leftBox.css('width', '100%')
    } else {
        $leftBox.css('width', '70%')
        $rightBox.css('width', '30%').show()
    }
}

/**
 * On Paste text to input
 */
async function onPasteUrl() {
    const text = await navigator.clipboard.readText();
    $urlInput.val(text)
    onDecode()
}




function isNull(str) {
    if (str === undefined || str === '' || str === null || str == []) {
        return true
    } else
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


function onDecode() {
    var urlStr = $urlInput.val()
    if (!urlStr) {
        toastr.error(MSG.ERROR_NO_COPIED)
    }
    else if (isJsonOrEncodeUrl(urlStr)) {
        try {
            var str = JSON.stringify(JSON.parse(decodeURIComponent(urlStr)), undefined, 4);
            $decodeResult.html(syntaxHighlight((str)))
            $('#table-container').empty().append(generateJson2Table(JSON.parse(decodeURIComponent(urlStr))));
        } catch (e) {
            toastr.error(MSG.ERROR_JSON_PARSE)
        }
    }
    else {
        toastr.error(MSG.NOT_VALID_INPUT)
        $urlInput.val('')
    }
}


function checkLiveMode() {
    var live = localStorage.getItem('kosign_live_mode');
    if (live == 'true') {
        $urlInput.on('input', function () {
            decode.onDecode();
        })
        $('#live_mode').prop('checked', true);
    } else {
        $('#live_mode').prop('checked', false);
        $urlInput.off()
    }


}




function formatJson(id) {
    const obj = $(id).text();
    if (obj) {
        try {
            const str = JSON.stringify(JSON.parse(obj), undefined, 4);
            $(id).html(syntaxHighlight((str)))
            if (id === '#url_result') {
                $('#table-container').empty().append(generateJson2Table(obj));
            } else {
                $('#table-container2').empty().append(generateJson2Table(obj));
            }
        } catch (error) {
            onMessage('Invalid json', 'error')
        }
    }
}


function formatJsonRaw(obj) {
    if (obj) {
        try {
            const str = JSON.stringify(JSON.parse(obj), undefined, 4);
            return syntaxHighlight((str));
        } catch (error) {
            onMessage('Invalid json', 'error')
        }
    }
}


function loadData() {
    try {
        var oldData = localStorage.getItem('kosign_save_data')
        if (!isNull(oldData) && JSON.parse(oldData).length > 0) {
            oldData = JSON.parse(oldData)
            oldData.sort(function (a, b) {
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return sortByDate(a, b);
            });

            var html = '';
            $.each(oldData, function (i, v) {
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
                                        <!-- <a class="ui black empty circular label" data-color="#ffb3b3"></a>-->
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
                            <div style="margin-top: 3px;"><small>${new moment(v.date.replace('|', '')).format('YYYY-MM-DD | hh:mm a')}</small></div></div>
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
            $saveBoxResult.html('');
            $('#table-container2').empty();
        } else {
            saveNoData();
        }
    } catch (error) {

    }
    $('.ui.dropdown')
        .dropdown()
        ;
}

function saveNoData() {
    $('#save_data_rec').empty().append('<div style="padding: 30px;background: #f7f7f7; border-radius: 10px;"><h4 style="color: rgb(146, 146, 146);">No Data</h4></div>');
}


function onRemoveData(index) {
    try {
        var oldData = localStorage.getItem('kosign_save_data')
        if (!isNull(oldData)) {
            oldData = JSON.parse(oldData)
            oldData.sort(function (a, b) {
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return sortByDate(a, b);
            });
            var newList = []
            $.each(oldData, function (i, v) {
                if (i !== index) {
                    newList.push(v);
                }
            })
            localStorage.setItem('kosign_save_data', JSON.stringify(newList))
        }
    } catch (error) {

    }
}

function onMessage(str, type, duration = 3000) {
    var id = '';
    var size = 7;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (let index = 0; index < size; index++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length - 1));
    }
    $('#message-block').append('<div class="message-main" id="' + id + '"></div>')

    var status = '';
    switch (type) {
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

    $('#' + id).text(str);
    $('#' + id).css({ 'borderLeft': '3px solid' + status })
    $('#' + id).animate({ "right": '+=250' });
    setTimeout(function () {
        $('#' + id).animate({ "right": '-=250' });
        setTimeout(function () { $('#' + id).remove(); }, 300)
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
    return str.toLowerCase().replace(/_([a-z])/g, function (match) {
        return match[1].toUpperCase();
    });
}
function findKey(jsonString) {
    const regex = /"([^"]+)":/g;
    const keys = [];
    let matches = regex.exec(jsonString);
    while (matches !== null) {
        keys.push(matches[1]);
        matches = regex.exec(jsonString);
    }
    return keys;
}

function replaceAllToCamelCase(str) {
    var keys = findKey(str);
    keys.forEach(v => {
        if (isSnakeCase(v)) {
            str = str.replaceAll('"' + v + '"', '"' + snakeToCamelCase(v) + '"')
        } else if (isUpperCase(v)) {
            str = str.replaceAll('"' + v + '"', '"' + v.toLowerCase() + '"')
        }
    })
    return str;
}

function replaceAllToSnakeCase(str) {
    var keys = findKey(str);
    keys.forEach(v => {
        if (isLowerCase(v)) {
            str = str.replaceAll('"' + v + '"', '"' + v.toUpperCase() + '"')
        } else if (isCamelCase(v) && !isUpperCase(v)) {
            str = str.replaceAll('"' + v + '"', '"' + camelToSnakeCase(v) + '"')
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


function onlyKeyToJson(str) {

    try {
        JSON.parse(str);
        return str;
    } catch (e) {
        var keys = str.match(/\w+/g)
        if (keys.length === 0) return;
        var jsonString = '{';
        keys.forEach(v => {
            v = v.trim();
            if (v !== '') {
                jsonString += '"' + v + '": "",'
            }
        })
        jsonString = jsonString.substring(0, jsonString.length - 1);
        return jsonString + '}';
    }
}

function getLastName(str) {
    var ls = str.split('|');
    return ls[ls.length - 1];
}

function sortByDate(a, b) {
    return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
}

function onRename(parent) {
    var index = $(parent).index()
    if (isNull($(parent).find('.btn_box .input input').val())) {
        return;
    }
    var oldData = localStorage.getItem('kosign_save_data')
    if (!isNull(oldData)) {
        oldData = JSON.parse(oldData)
        oldData.sort(function (a, b) {
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

/**
 * Generate Json to Table
 * @param {JSON} json 
 * @returns 
 */
function generateJson2Table(json) {
    let html = tableString.table();
    if (type.isObject(json)) {
        html += builder.objectBuilder(json);
    } else if (type.isArray(json)) {
        html += builder.arrayBuilder(json);
    }
    html += tableString.tableEnd();
    return html;
}

const builder = {
    objectBuilder: (obj) => {
        let html = '';
        $.each(obj, (key, value) => {
            if (type.isObject(value)) {
                html += builder.objectObjectBuilder(key, value);
            } else if (type.isArray(value)) {
                html += builder.objectArrayBuilder(key, value);
            } else {
                html += builder.stringBuilder(key, value);
            }
        })
        return html;
    },
    arrayBuilder: (arr) => {
        let html = '';
        if (arr.length === 0) return '';
        if (type.isObject(arr[0])) {
            html += builder.arrayObjectBuilder(arr);
        } else if (type.isArray(arr[0])) {
            html += builder.arrayArrayBuilder(arr);
        } else {
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
        html += tableString.td('<b>' + key + '</b>', 2);
        //html += tableString.td(builder.arrayBuilder(value));
        html += tableString.tr1(tableString.td(builder.arrayBuilder(value), 2));
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
                if (type.isObject(value)) {
                    html += tableString.td(tableString.table2(builder.objectBuilder(value)));
                } else if (type.isArray(value)) {
                    html += tableString.td(builder.arrayBuilder(value));
                } else {
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


/**
 * create drag box
 * @param {Object} data 
 */
function createDragBox(data) {
    const id = 'drage_box_id_' + Math.floor(Math.random() * (1000 - 100 + 1) + 100) // Generate ID for modal
    const html = `<div id="${id}" class="ui-widget-content draggable" style="border-radius: 10px;">
            <div id="${id + '_resize'}" class="ui-widget-content" style="border-radius: 10px; min-width: 210px; min-height: 80px; max-height: 100vh; height: 300px;">
                <h3 class="ui-widget-header" style="display: grid; grid-template-columns: auto 25px; border-radius: 10px 10px 0 0; margin: 0;">
                    <div style="padding-left: 10px;">
                        <span data-tooltip="Format" data-inverted="" class="mini_btn btn_mini_format"><i class="magic icon small"></i></span>
                        <span data-tooltip="Copy" data-inverted="" class="mini_btn btn_mini_copy"><i class="copy icon small"></i></span>
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
    $('#' + id + '_resize pre').html(formatJsonRaw(data))
    $('#' + id).css({ position: "absolute", zIndex: 999999 })
    $("#" + id).draggable({ handle: ".ui-widget-header", });
    $("#" + id + '_resize').resizable();
}

// Drage box 
// ================================================================================
/**
 * Make new drag box
 * @returns 
 */
function onMakeNewDrage() {
    if (!isNull($saveBoxResult.text())) {

        var timer = setTimeout(function () {
            if ($('.draggable').length < 10) {
                createDragBox($saveBoxResult.text());
            } else {
                onMessage('You can only have 10 popup box.')
                return;
            }
        }, 200);

        $(this).on('dblclick', function () {
            clearTimeout(timer);
            // Double click logic here
            try {
                const json = JSON.parse($saveBoxResult.text());
                let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                width=600,height=300,left=100,top=100`;

                open('popup.html?_JSON_=' + JSON.stringify(json), 'test', params);
            } catch (e) {
                onMessage(e.message)
                return;
            }
        });
    } else {
        toastr.error(MSG.NO_TEXT_TO_SHOW)
        return;
    }
}


const iconTable = `<i class="table icon"></i>`
const iconList  = `<i class="list ul icon"></i>`

$(".btn_2table2").click(function () {
    onAppendJsonToTable($('#table-container2'), $saveBoxResult)
    if($(this).html() === iconList){
        $(this).attr('data-tooltip', 'View as table')
        $(this).empty().append(iconTable)
        $('#table-container2').hide();
        $saveBoxResult.show();
    }else{
        $(this).attr('data-tooltip', 'View as json')
        $(this).empty().append(iconList)
        $('#table-container2').show();
        $saveBoxResult.hide();
    }
})

$(".btn_2table").click(function () {
    onAppendJsonToTable($('#table-container'), $decodeResult)
    if($(this).html() === iconList){
        $(this).attr('data-tooltip', 'View as table')
        $(this).empty().append(iconTable)
        $('#table-container').hide();
        $decodeResult.show();
    }else{
        $(this).attr('data-tooltip', 'View as json')
        $(this).empty().append(iconList)
        $('#table-container').show();
        $decodeResult.hide();
    }
})


function onAppendJsonToTable($to, $from){
    if($from.text()){
        try{
            $to.empty().append(generateJson2Table(JSON.parse($from.text())));
        }catch(e){
            toastr.error(MSG.ERROR_JSON_PARSE)
        }
    }else{
        toastr.error(MSG.NO_TEXT_TO_SHOW)
    }
}


$('#code_pre, #exclude_txt').on('input',function(){
    onReplaceJex()
})

$('#btn_save_ex').click(function () {
    if(isNull(activeProjectId)){
        onMessage('Please select project.', 'error')
        return;
    }
    projects.forEach((v, i)=>{
        if(v.id === activeProjectId){
            v.exclude = $('#exclude_txt').val();
        }
    })
    saveProjectToLocal(projects);
    onMessage('Save exclude done.')
})

$('.btn_camel_case').click(function (){
    $decodeResult.text(replaceAllToCamelCase($decodeResult.text()))
    formatJson('#url_result')
})

$('.btn_snake_case').click(function (){
    $decodeResult.text(replaceAllToSnakeCase($decodeResult.text()))
    formatJson('#url_result')
})

$(document).on('keyup','.btn_box .input input' ,function(e) {
    if(e.which == 13) {
        onRename($(this).parent().parent().parent());
    }else if (e.key === 'Escape'){
        onCancel($(this).parent().parent().parent())
    }
});


$(document).on('click','.btn_rename', function () {
    onCancel($(this).parent().parent().parent().parent())
    $(this).parent().parent().parent().parent().find('.box').css('margin-right', '5px')
    const parent = $(this).parent().parent().parent();
    $(parent).find('.btn_box p').hide()
    $(parent).find('.icon_mini').hide()
    $(parent).find('.btn_box .input').show()
    $(parent).find('.btn_box .input input').val($(parent).find('.btn_box p').text())
    $(parent).find('.btn_box .input input').focus()
    $(parent).find('.mini_menu').show();
    $(parent).css('margin-right', '30px')
})
$(document).on('click','.btn_cancel', function () {
    onCancel($(this).parent().parent())
})
function onCancel(parent) {
    $(parent).css('margin-right', '5px')
    $(parent).find('.btn_box p').show()
    $(parent).find('.icon_mini').show()
    $(parent).find('.btn_box .input').hide()
    $(parent).find('.mini_menu').hide();
}
$(document).on('click','.btn_done', function () {
    onRename($(this).parent().parent());
})

$('.btn_clear_data').click(function () {
    onConfirm({
        description: 'Do you really want to clear all data?',
        onConfirm: function(){
            localStorage.removeItem('kosign_save_data')
            loadData();
            $saveBoxResult.html('');
            onMessage('All data is cleared.')
        }
    })
})

$(document).on('click','.btn_delete', function () {
    var index = $(this).parent().parent().parent().index()
    onConfirm({
        description: 'Do you really want to remove this data?',
        onConfirm: function(){
            onRemoveData(index)
            loadData()
            onMessage('The data is remove.')
        }
    })
})

$(document).on('click', '.btn_colors a',function () {
    const color = $(this).attr('data-color');
    const parent = $(this).parents('.box')
    $(parent).css('background', color)

    var oldData = localStorage.getItem('kosign_save_data')
    if(!isNull(oldData)){
        oldData = JSON.parse(oldData)
        oldData.sort(function(a,b){
            return sortByDate(a, b);
        });
        oldData[$(parent).index()]['color'] = color;

        localStorage.setItem('kosign_save_data', JSON.stringify(oldData))
    }
})

$(document).on('click', '.btn_box',function () {
    var str = JSON.stringify(JSON.parse(decodeURIComponent($(this).attr('data-val'))), undefined, 4);
    $saveBoxResult.html(syntaxHighlight(str))

    $('.box').removeClass('active_select');
    $(this).parent().addClass('active_select')

    $('#table-container2').empty().append(generateJson2Table(JSON.parse(decodeURIComponent($(this).attr('data-val')))));
})


