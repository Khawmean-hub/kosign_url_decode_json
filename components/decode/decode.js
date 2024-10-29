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
        $leftBox.css('width', '70%')
        $rightBox.css('width', '30%').show()
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
    $urlInput.val(text)
    onDecode()
}


/**
 * On Decode and paste to result and table
 */
function onDecode() {
    var urlStr = $urlInput.val()
    if (!urlStr) {
        toastr.error(MSG.ERROR_NO_COPIED)
    }
    else if (isJsonOrEncodeUrl(urlStr)) {
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
    }
}

/**
 * Key to JSON
 */
function onKeyToJson(){
    if(decodeResultEditor.getValue()){
        //decodeResultEditor.setValue(jsonFormat(onlyKeyToJson(decodeResultEditor.getValue())))
        decodeResultEditor.setValue(jsonFormat(JSON.stringify(transformStringToObject(decodeResultEditor.getValue()))))
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