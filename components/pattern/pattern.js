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
    var replaceTab = '$tab';
    // var replaceKeyInd = 
    var keys = getKeysInput();
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
    //... apply pattern...
    if(keys && patternTxt){
        keys.forEach(v=>{
            var tab = getDefAutoTab(keys, v);
            resutl += patternTxt.replaceAll(replaceKey, v).replaceAll(replaceTab, tab) + '\n'
        })
    }
    rightEditor04.setValue(resutl)
}


//get keys
function getKeysInput(){
    var keys;
    var val = leftEditorTop04.getValue();
    if(val){
        //try if json input
        try{ if(val){ keys = Object.keys(JSON.parse(val)) } }catch(e){}

        // if not json
        try{ if(!keys){ keys = Object.keys(transformStringToObject(val))} }catch(e){}
    }

    if(keys){
        keys = keys.filter(v=> v != '')
    }

    return keys;
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
        if(id){
            var pattern = getPatternById(id);
            if(pattern){
                deletePatternData(id);
                onBuildPatternSelection();
                toastr.success('Delete pattern.')
            }
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