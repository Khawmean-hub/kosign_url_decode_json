//====================== Variable =======================
$rightBox = $('#right_part')
$leftBox = $('#left_part')
$urlInput = $('#url_text')
let decodeResultEditor;
let saveBoxResult;
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
$("#left_part").resizable(resizeOption);

$(document).on('click', '#btn_paste_url', onPasteUrl)
$(document).on('click', '.btn_keys_json', onKeyToJson)
$(document).on('click', '.btn_snake_case', onChangeToSnakeCase)
$(document).on('click', '.btn_camel_case', onChangeToCamelCase)
$(document).on('click', '.btn_json_ts', onTransformToTS)
$(document).on('click', '.btn_json_sql', onTransformToSQL)
$(document).on('click', '.btn_json_select', onTransformToSelect)
$(document).on('click', '.btn_json_insert', onTransformToInsert)
$(document).on('click', '.btn_json_update', onTransformToUpdate)
$(document).on('click', '.btn_json_encdoe', onTransformToEncode)

$(document).on('click', '.btn_format_url_result_box', onFormatUrlResultBox)
$(document).on('click', '.btn_2table_url_result_box', on2TableLeftBox)

$(document).on('click', '.btn_save', onSaveJsonOnLocal)

$(document).on('click', '.btn_show_right', onShowRightBox);
$(document).on('input', '#url_text', onDecode)
$(document).on('click','.btn_copy', onCopyLeftBoxJson)

//===================================================== Functions ==================================================
/**
 * Show json data management
 */
function onShowRightBox() {
    if ($rightBox.css('display') === 'block') {
        $rightBox.hide()
        $leftBox.css('width', '100%')
    } else {
        $leftBox.css('width', '50%')
        $rightBox.css('width', '50%').show()
    }
}


/**
 * on copy
 */
function onCopyLeftBoxJson(){
    copyToClipboard(decodeResultEditor.getValue())
}


/**
 * On Paste text to input
 */
async function onPasteUrl() {
    const text = await navigator.clipboard.readText();
    $urlInput.val(text).trigger('input');
    onDecode()
}


/**
 * On Decode and paste to result and table
 */
function onDecode() {
    var urlStr = $urlInput.val()
    if (!urlStr) {
        toastr.error(MSG.NO_DATA)
        decodeResultEditor.setValue('');
    }else {
        var newstr = jsonFormat(urlStr);
        if(newstr){
            decodeResultEditor.setValue(newstr);
        }else{
            tryToDecode(urlStr)
        }
    }
    /*else if (isJsonOrEncodeUrl(urlStr)) {
        try {
            var str = JSON.stringify(JSON.parse(decodeURIComponent(urlStr)), undefined, 4);
            decodeResultEditor.setValue(str);
        } catch (e) {
            toastr.error(MSG.ERROR_JSON_PARSE)
        }
    }
    else {
        toastr.error(MSG.NOT_VALID_INPUT)
        $urlInput.val('')
    }*/
}

const maxTryDecode = 4;
let tryDecodeTime = 1;
/**
 * Try to decode multiple time
 */
function tryToDecode(str){
    try{
        var decodeStr = decodeURIComponent(str)
        try{
            var decodeJson2 = JSON.parse(decodeStr)
            var str = JSON.stringify(decodeJson2, undefined, 4);
            decodeResultEditor.setValue(str);
            var msg = 'Try to decode '+tryDecodeTime+' time' + (tryDecodeTime > 1 ? 's': '') + ' to get result.';
            toastr.info(msg)
            tryDecodeTime = 1;
        }catch(e){
            tryDecodeTime += 1;
            if(tryDecodeTime <= maxTryDecode){
                tryToDecode(decodeStr)
            }else{
                tryDecodeTime = 1;
                decodeResultEditor.setValue(str);
                toastr.error(MSG.ERROR_JSON_PARSE)
            }
        }
    }catch(e){}
}


/**
 * Key to JSON
 */
function onKeyToJson(){
    if(decodeResultEditor.getValue()){
        //decodeResultEditor.setValue(jsonFormat(onlyKeyToJson(decodeResultEditor.getValue())))
        decodeResultEditor.setValue(jsonFormat(JSON.stringify(transformStringToJSON(decodeResultEditor.getValue()))))
        toastr.info('Transformed to JSON')
    }else{
        toastr.error(MSG.NO_TEXT_TO_CONVERT)
    }
}

/**
 * key to json
 * @param {String} str 
 * @returns 
 */
function onlyKeyToJson(str) {
    try {
        JSON.parse(str);
        toastr.error(MSG.NOT_A_TEXT)
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


/**
 * Change to snake case
 */
function onChangeToSnakeCase(){
    if(decodeResultEditor.getValue()){
        decodeResultEditor.setValue(jsonFormat(replaceAllToSnakeCase(decodeResultEditor.getValue())))
        toastr.info('Transformed to snake case')
    }else{
        toastr.error(MSG.NO_TEXT_TO_CONVERT)
    }
}

/**
 * Convert to Snake case
 * @param {String} str 
 * @returns 
 */
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


/**
 * On change to camel case
 */
function onChangeToCamelCase(){
    if(decodeResultEditor.getValue()){
        decodeResultEditor.setValue(jsonFormat(replaceAllToCamelCase(decodeResultEditor.getValue())))
        toastr.info('Transformed to camel case')
    }else{
        toastr.error(MSG.NO_TEXT_TO_CONVERT)
    }
}
/**
 * Convert to Camel case
 * @param {String} str 
 * @returns 
 */
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

/**
 * On format left box
 */
function onFormatUrlResultBox(){
    onFormatOn(decodeResultEditor);
}

/**
 * ON show table or show editor left box
 */
function on2TableLeftBox(){
    onToggleTableAndJson($(this), $('#url_result').parent(), $('#table-container'), decodeResultEditor)
}


/**
 * On Save json to local storage
 */
function onSaveJsonOnLocal() {
    saveJsonOnLocal()
}

function onTransformToTS(){
    var res = jsonToTypeScriptInterface(getJSONFromLeftBoxEditor())
    if(res){
        decodeResultEditor.setValue(res)
        toastr.info('Transformed to TypeScript interface')
    }
}

function getJSONFromLeftBoxEditor(){
    try{
        var text = decodeResultEditor.getValue();
        if(text){
            return JSON.parse(text)
        }else{
            toastr.error(MSG.NO_TEXT_TRANSFORM)
        }
    }catch(e){
        toastr.error(MSG.NOT_JSON3)
    }
}

function onTransformToSQL(){
    var res = jsonToPostgreSQLTable(getJSONFromLeftBoxEditor())
    if(res){
        decodeResultEditor.setValue(res)
        toastr.info('Transformed to SQL table format')
    }
}

function onTransformToSelect(){
    var res = jsonToPostgreSQLSelect(getJSONFromLeftBoxEditor())
    if(res){
        decodeResultEditor.setValue(res)
        toastr.info('Transformed to SQL SELECT statement')
    }
}

function onTransformToInsert(){
    var res = jsonToPostgreSQLInsert(getJSONFromLeftBoxEditor())
    if(res){
        decodeResultEditor.setValue(res)
        toastr.info('Transformed to SQL INSERT statement')
    }
}

function onTransformToUpdate(){
    var res = jsonToPostgreSQLUpdate(getJSONFromLeftBoxEditor())
    if(res){
        decodeResultEditor.setValue(res)
        toastr.info('Transformed to SQL UPDATE statement')
    }
}

function onTransformToEncode(){
    var res = encodeURIComponent(JSON.stringify(getJSONFromLeftBoxEditor()))
    if(res && res != 'undefined'){
        decodeResultEditor.setValue(res)
        toastr.info('Encoded JSON to URL format')
    }
}