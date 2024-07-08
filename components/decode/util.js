function makeDecodeEditor(){
    decodeResultEditor  = applyEditorJs('url_result');
    saveBoxResult = applyEditorJs('right_editor_box');
    
    decodeResultEditor.on('change', function() {
        onDisableBtnComparae()
    });
    saveBoxResult.on('change', function() {
        onDisableBtnComparae()
    });
}

function jsonFormat(str){
    str = getObjectStr(str);
    if(isJson(str)){
        return JSON.stringify(JSON.parse(str), null, 4)
    }
    return '';
}

function getObjectStr(str){
    str = str.replace(/'/g, '"');
    str = str.replace(/(\w+):/g, '"$1":');
    return str;
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

/**
 * format on editor
 * @param {Codemirror} editor 
 */
function onFormatOn(editor){
    try{
        if(editor.getValue()){
            editor.setValue(jsonFormat(editor.getValue()))
        }else{
            editor.error(MSG.NO_TEXT_TO_FORMAT)
        }
    }catch(e){
        toastr.error(MSG.NOT_AN_EDITOR)
    }
}


/**
 * Sort
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
function sortByDate(a, b) {
    return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
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

function camelToSnakeCase(str) {
    return str.replace(/([A-Z])/g, '_$1').toUpperCase();
}
function snakeToCamelCase(str) {
    return str.toLowerCase().replace(/_([a-z])/g, function (match) {
        return match[1].toUpperCase();
    });
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
    thEnd: () => '</th>',
    noData: () => '<h3 class="no-data">No data </br> <small style="font-weight: 100">Click again to go back to your editor.</small></h3>'
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
 * on toggle table and append data to table
 * @param {HTML Element} $btn 
 * @param {HTML Element} $editorBox 
 * @param {HTML Element} $table 
 * @param {CodeMirror} editor 
 */
function onToggleTableAndJson($btn, $editorBox, $table, editor){
    if(editor.getValue()){
        const json = getObjectStr(editor.getValue())
        if(isJson(json)){
            const iconTable = `<i class="table icon"></i>`
            const iconList  = `<i class="list ul icon"></i>`
        
            if($btn.html() === iconList){
                $btn.attr('data-tooltip', 'View as table')
                $btn.empty().append(iconTable)
                $table.hide();
                $editorBox.show();
            }else{
                //build table
                onAppendJsonToTable($table, editor)
        
                $btn.attr('data-tooltip', 'View as json')
                $btn.empty().append(iconList)
                $table.show();
                $editorBox.hide();
            }
        }else{
            toastr.error(MSG.NOT_JSON2)
        }
    }else{
        toastr.error(MSG.NO_DATA)
    }
    
}

/**
 * on build table
 * @param {HTML element} $to 
 * @param {CodeMirror} editor 
 */
function onAppendJsonToTable($to, editor){
    if(editor.getValue()){
        try{
            const json = getObjectStr(editor.getValue())
            $to.empty().append(generateJson2Table(JSON.parse(json)));
        }catch(e){
            toastr.error(MSG.ERROR_JSON_PARSE)
        }
    }else{
        $to.empty().append(tableString.noData());
        // toastr.error(MSG.NO_TEXT_TO_SHOW)
    }
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

/**
 * Find max number in string
 */
function getNewName(list) {
    let maxSave = -Infinity; // Initialize with the smallest possible number
    
    list.forEach(item => {
        const match = item.match(/Save (\d+)/);
        if (match) {
            const num = parseInt(match[1], 10);
            if (num > maxSave) {
                maxSave = num;
            }
        } else if (item === "Save") {
            if (0 > maxSave) {
                maxSave = 0;
            }
        }
    });

    if (maxSave === -Infinity) {
        return 1; // Return null if no "save" found
    }

    return maxSave + 1; // Return the next number
}



function getWithCheckkDuplicateData(list){
    list.map(v=>{
        const dupData = getDuplicateId(v, list);
        if(dupData){
            v.dupId = dupData.id
            v.dupName = dupData.name
        };
        return v;
    })
    return list;
}


function getDuplicateId(v, list){
    console.log('...', v)
    const dupObj = list.find(a=> a.id !== v.id && JSON.stringify(a.data) === JSON.stringify(v.data));
    console.log(dupObj)
    if(dupObj) return dupObj;
    return null;
}