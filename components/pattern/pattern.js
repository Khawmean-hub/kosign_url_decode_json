//variable
let leftEditorTop04;
let leftEditorBottom04;
let rightEditor04;
let p04 = '#page_pattern ';


const resizeOption04 = {
    handles: 'e',
    resize: function (event, ui) {
        const containerWidth = $(p04 + "#layout04").width();
        const leftWidth = ui.size.width;
        const rightWidth = containerWidth - leftWidth;
        $(p04 + "#right_part04").width(rightWidth);
    }
}

//================================ init ============================
/**
 * on load function....
 */
export function init() {
    events()
    $(p04+"#left_part04").resizable(resizeOption04);
    makeEditor()
    onBuildPatternSelection();
    $('.ui.dropdown').dropdown()
}

function events(){
    $('#pattern_save_input').on('input', onActiveButtonSavePattern)
    $('#pattern_selection').on('change', onChnagePatternSelection)
    $('#btn_pattern_save').on('click', onSaveNewPattern)
    $('#btn_pattern_delete').on('click', onDeletePattern)
    $('#btn_copy_patter_text').on('click', onCopyPatterText)
    $('#btn_pattern_help').on('click', onShowPatternHelp)
}

//show pattern help modal
function onShowPatternHelp(){
    $('#pattern_help_modal').modal({duration: 200}).modal('show');
}

/**
 * Make editor apply codemirror
 */
function makeEditor () {
    if (!leftEditorTop04) {
        leftEditorTop04 = applyEditorJs('top_editor04');
        leftEditorBottom04 = applyEditorJs('bottom_editor04');
        rightEditor04 = applyEditorJs('right_editor04');
        
        //set event
        leftEditorTop04.on('change', function () {
            onApplyPattern()
        });

        //set event
        leftEditorBottom04.on('change', function () {
            onActiveButtonSavePattern()
        });
    }
}


//build patter dropdown
function onBuildPatternSelection(){
    $('#pattern_selection').empty()
    var list = loadPatternData()
    list.forEach(v=>{
        $('#pattern_selection').append(`<option value="${v.id}">${v.name}</option>`)
    })
}

//on active button save
function onActiveButtonSavePattern(){
    var saveName    = $('#pattern_save_input').val().trim()
    var saveContent = leftEditorBottom04.getValue().trim();

    if(saveName && saveContent){
        $('#btn_pattern_save').removeClass('disabled')
    }else{
        $('#btn_pattern_save').addClass('disabled')
    }

    onApplyPattern()
}


/**
 * Apply pattern set result
 */
function onApplyPattern(){
    var replaceKey = '$key';
    var replaceVal = '$val';
    var replaceTab = '$tab';
    // var replaceKeyInd = 
    var json = getJsonInput();
    var keys = Object.keys(json);
    var patternTxt = leftEditorBottom04.getValue().trim();

    var resutl = ''
    var m = patternTxt.match(/\$key\d+/gm);
    if(m){
        m.forEach(v=>{
            var kInd = v.replace(replaceKey, '');
            if(kInd < keys.length){
                patternTxt = patternTxt.replace(v, keys[kInd])
            }
        })
    }

    var valInd = patternTxt.match(/\$val\d+/gm);
    if(valInd){
        valInd.forEach(v=>{
            var kInd = v.replace(replaceVal, '');
            if(kInd < keys.length){
                patternTxt = patternTxt.replace(v, json[keys[kInd]])
            }
        })
    }

    //... apply pattern...
    if(keys && patternTxt){
        keys.forEach(v=>{
            var tab = getDefAutoTab(keys, v);
            var val = json[v];
            var line = applyCaseTokens(patternTxt, replaceKey, v)
            line = applyCaseTokens(line, replaceVal, val)
            resutl += line.replaceAll(replaceKey, v).replaceAll(replaceTab, tab).replaceAll(replaceVal, val) + '\n'
        })
    }
    rightEditor04.setValue(resutl)
}


/**
 * Replace case-modifier tokens (e.g. $keyLower, $valSnake) for a given base token.
 * Must run BEFORE the bare $key/$val replacement, otherwise '$key' would clobber '$keyLower'.
 */
function applyCaseTokens(text, baseToken, value){
    var s = String(value == null ? '' : value);
    return text
        .replaceAll(baseToken + 'Lower', s.toLowerCase())
        .replaceAll(baseToken + 'Upper', s.toUpperCase())
        .replaceAll(baseToken + 'Snake', toSnakeCase(s))
        .replaceAll(baseToken + 'Pascal', toPascalCase(s))
        .replaceAll(baseToken + 'Camel', toCamelCase(s));
}

//convert any string to snake_case
function toSnakeCase(str){
    return String(str)
        .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
        .replace(/[\s\-]+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '')
        .toLowerCase();
}

//convert any string to camelCase
function toCamelCase(str){
    var s = String(str)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_\-]+/g, ' ')
        .trim()
        .toLowerCase();
    return s.replace(/\s+(.)/g, function(_, c){ return c.toUpperCase(); });
}

//convert any string to PascalCase
function toPascalCase(str){
    var c = toCamelCase(str);
    return c ? c.charAt(0).toUpperCase() + c.slice(1) : c;
}


//get keys
function getJsonInput(){
    var json;
    var val = leftEditorTop04.getValue().trim();
    if(val){
        //try if json input
        try{ if(val){ json = JSON.parse(val) } }catch(e){}

        // if not json
        try{ if(!json){ json = transformStringToJSON(val)} }catch(e){}
    }

    return json || {};
}

//get auto space
function getDefAutoTab(keys, str){
    var maxLenght = findMaxLength(keys);
    var strLenght = str.length;
    var tapsTime = 0;

    while(maxLenght % 4 != 0){
        maxLenght++;
    }

    maxLenght += 2;
    maxLenght = maxLenght - strLenght;
    
    while(maxLenght % 4 != 0){
        maxLenght++;
    }

    tapsTime = Math.floor(maxLenght / 4);

    return Array(tapsTime + 1).join('\t');
}

//find max leng of string
function findMaxLength(strings) {
    if (!Array.isArray(strings) || strings.length === 0) {
        return 0; // Return 0 if input is not a valid array or is empty
    }

    // Find the maximum length
    const maxLength = Math.max(...strings.map(str => str.length));
    return maxLength;
}

//Save new pattern
function onSaveNewPattern(){
    var id = 'pa_' + (Math.random(10, 1000000));
    var name = $('#pattern_save_input').val();
    var pattern = leftEditorBottom04.getValue().trim();

    var newPattern = {
        id: id,
        name: name,
        pattern: pattern
    }
    addPattern(newPattern);
    onBuildPatternSelection();

    toastr.success('Save new patter.')

    //clear
    $('#pattern_save_input').val('New Pattern');
    $('#btn_pattern_save').addClass('disabled')
    leftEditorBottom04.setValue('')
}

//Change pattern
function onChnagePatternSelection(){
    var id = $(this).val()
    if(id){
        var pattern = getPatternById(id);
        if(pattern){
            leftEditorBottom04.setValue(pattern.pattern);
            onApplyPattern()
        }
    }

    if(id && id != '00'){
        $('#btn_pattern_delete').removeClass('disabled')
    }else{
        $('#btn_pattern_delete').addClass('disabled')
    }
}

/**
 * Delete pattern
 */
function onDeletePattern(){
    if(confirm('Are you sure want to delete this pattern?')){
        var id = $('#pattern_selection').val()
        if(id && id != '00'){
            var pattern = getPatternById(id);
            if(pattern){
                deletePatternData(id);
                onBuildPatternSelection();
                toastr.success('Delete pattern.')
                $('#btn_pattern_delete').addClass('disabled')
            }
        }else{
            toastr.error('Please select pattern.')
        }
    }
}

//onCopyPatterText
function onCopyPatterText(){
    copyToClipboard(rightEditor04.getValue().trim())
}




//-------------------------------------------------------------------------------------------------------------
//      Data Localstorage
//-------------------------------------------------------------------------------------------------------------
const defaultPattern = [
    {
        id: '00',
        name: 'Select Pattern',
        pattern: ``
    },
    {
        id: '02',
        name: 'SQL Emtpy Default',
        pattern: `,coalesce($key,$tab'') "$key"`
    }
]
const patterData = 'URL_DECODE_PATTERN_DATA';

/**
 * Save pattern data
 */

function savePatternData(patternData) {
    localStorage.setItem(patterData, JSON.stringify(patternData));
}

/**
 * Load pattern data
 */

function loadPatternData() {
    const patternDataStr = localStorage.getItem(patterData);
    if (patternDataStr) {
        return JSON.parse(patternDataStr);
    } else {
        return defaultPattern;
    }
}

/**
 * Delete pattern data
 */

function deletePatternData(patternId) {
    const patternData = loadPatternData();
    patternData.splice(patternData.findIndex(pattern => pattern.id === patternId), 1);
    savePatternData(patternData);
}

/**
 * Add pattern data
 */

function addPattern(pattern) {
    const patternData = loadPatternData();
    patternData.push(pattern);
    savePatternData(patternData);
}

/**
 * Get pattern by id
 */

function getPatternById(patternId) {
    const patternData = loadPatternData();
    return patternData.find(pattern => pattern.id === patternId);
}