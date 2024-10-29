function toastrSetting(){
    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-bottom-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
}


var rank = Math.floor(Math.random() * 100) + 1;

/**
 * Copy to clipboard
 * @param {String} str 
 */
function copyToClipboard(str){
    if(str){
        const $temp = $("<textarea>");
        // Append the temporary text area element to the body
        $("#theme").append($temp);
        // Set the value of the temporary text area to the text to be copied
        $temp.val(str).select();
        // Execute the copy command
        document.execCommand("copy");
        $temp.remove();
        toastr.success("Text copied to clipboard!");
    }else {
        toastr.error(MSG.NO_DATA)
    }
}

function getDateFormat(str){
    return moment(str, dateFormat).format(dateFormat2)
}

function isJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Check is a json or encode url
 */
function isJsonOrEncodeUrl(str) {


    function isEncodeUrl(str) {
        // A basic check for URL-encoded strings (percent-encoded)
        return decodeURIComponent(str) !== str;
    }

    return isJson(str) || isEncodeUrl(str);
}

function isNotJson(str) {
    try {
        JSON.parse(str);
        return false;
    } catch (e) {
        return true;
    }
}


function applyEditorJava(id, isReadOnly = false, line = true){
    return CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,
        mode: 'text/x-java',
        indentUnit: 4,
        indentWithTabs: true
      });
}

function applyEditorJs(id, isReadOnly = false, line = true){
    let themeName = 'material';
    if(getThemeName().includes('dark')){
        themeName='material-ocean'
    }
    return CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,
        mode: { name: "javascript", json: true },
        theme: themeName
        // indentUnit: 4,
        // indentWithTabs: true
      });
}


var myModeSpec = {
    name: "htmlmixed",
    tags: {
      style: [["type", /^text\/(x-)?scss$/, "text/x-scss"],
              [null, null, "css"]],
      custom: [[null, null, "customMode"]]
    }
  }
function applyEditorHtmlMix(id, isReadOnly = false, line = true){
    let themeName = 'material';
    if(getThemeName().includes('dark')){
        themeName='material-ocean'
    }
    return CodeMirror.fromTextArea(document.getElementById(id), {
        lineNumbers: true,
        mode: myModeSpec,
        theme: themeName,
        matchBrackets: true,
        autoCloseTags: true,
        // indentUnit: 4,
        // indentWithTabs: true
      });
}


/**
 * Random number
 * @returns number
 */
function getRandId() {
    return Math.floor(Math.random() * (100000000 - 100000 + 1) + 100000) // Generate ID for modal
}



// for json color
const jsonEditorStyleDef = {
    lineNumer: {
        color: '',
        selector: '.CodeMirror-linenumber'
    },
    stringVal: {
        color: '',
        selector: '.cm-string'
    },
    numberVal: {
        color: '',
        selector: '.cm-number'
    },
    booleanVal: {
        color: '',
        selector: '.cm-atom'
    },
    curlybraces: {
        color: '',
        selector: '.CodeMirror'
    },
    key: {
        color: '',
        selector: '.cm-property'
    },
}

function applyJsonStyle(){
    var headerStyle = ''
    if(window.jsonStyleObj){
        var keys = Object.keys(window.jsonStyleObj)
        keys.map(v=>{
            var color = window.jsonStyleObj[v]['color']
            var select = window.jsonStyleObj[v]['selector']
            if(color){
                headerStyle += `#theme ${select}{ color: ${color} !important;}\n` 
            }
        })
        
    }
    $('#headerStyle_cust').empty().append(headerStyle);
}

function onChangeJsonColor(){
    var colorData = $(this).val()
    var key = $(this).attr('json-color-key')
    if(colorData){
        window.jsonStyleObj[key]['color'] = colorData;
        setJsonStyleData()
        applyJsonStyle()
    } 
}

function onLoadJsonStyle(){
    getJsonStyleData()
    applyJsonStyle()
    var keys = Object.keys(window.jsonStyleObj)
    keys.map(v=>{
        $('[json-color-key="'+v+'"]').val(window.jsonStyleObj[v]['color'])
    })
}

function onClearJsonCss(){
    window.jsonStyleObj = Object.assign({}, {
        lineNumer: {
            color: '',
            selector: '.CodeMirror-linenumber'
        },
        stringVal: {
            color: '',
            selector: '.cm-string'
        },
        numberVal: {
            color: '',
            selector: '.cm-number'
        },
        booleanVal: {
            color: '',
            selector: '.cm-atom'
        },
        curlybraces: {
            color: '',
            selector: '.CodeMirror'
        },
        key: {
            color: '',
            selector: '.cm-property'
        },
    })
    setJsonStyleData()
    applyJsonStyle()
    $('.jsonStyleForm input').val('')
}


function onChnageFontEditor(){
    var value = $(this).val()
    var isSize = $(this).attr('id') == 'font_size'
    if(value && Number(value) >= 5 && Number(value) <= 100){
        if(isSize){
            window.fontEditor.fontSize = value;
        }else{
            window.fontEditor.lineHeight = value;
        }
        setFontEditor()
        applyFontEditor()
    }else{
        $(this).val(14)
        toastr.error('Value must be smaller than 100 and greater than 5.')
    }
}

function onClearFontEditor(){
    window.fontEditor.fontSize = 0;
    window.fontEditor.lineHeight = 0;
    setFontEditor()
    $('#font_editor input').val('')
    $('#font_size_cust').empty()
}

function applyFontEditor(){
    var css = ''
    if(window.fontEditor.fontSize && Number(window.fontEditor.fontSize) >= 5){
        css += 'font-size: ' + window.fontEditor.fontSize + 'px;'
    }
    if(window.fontEditor.lineHeight && Number(window.fontEditor.lineHeight) >= 5){
        css += 'line-height: ' + window.fontEditor.lineHeight + 'px;'
    }

    var finalCss = `
    .CodeMirror {
        ${css}
    }
    `
    $('#font_size_cust').empty().append(finalCss);
}

function onLoadFontEditor(){
    getFontEditor();
    applyFontEditor();
    
    if(window.fontEditor.fontSize && Number(window.fontEditor.fontSize) >= 5){
       $('#font_editor input:eq(0)').val(window.fontEditor.fontSize)
    }
    if(window.fontEditor.lineHeight && Number(window.fontEditor.lineHeight) >= 5){
        $('#font_editor input:eq(1)').val(window.fontEditor.lineHeight)
    }
}

function transformStringToObject(input) {

    // Check if input is a string
    try{
        var val = JSON.parse(input)
        return val;
    }catch(e){}

    input = input.replaceAll('\n', ' ')

    const result = {};

    // Split the input by spaces and loop over each part
    input.split(' ').forEach(part => {
        const index = part.indexOf('-');

        // If no dash is found, assign an empty string to the key
        if (index === -1) {
            result[part] = "";
            return;
        }

        const key = part.substring(0, index);
        const valuePart = part.substring(index + 1);

        // Check if valuePart is empty, assign empty string
        if (valuePart === "") {
            result[key] = "";
        }
        // Check for double dash at the start for negative numbers
        else if (valuePart.startsWith('--') && !isNaN(valuePart.substring(2))) {
            result[key] = -parseInt(valuePart.substring(2), 10);
        } 
        // Check if value is a number
        else if (!isNaN(valuePart)) {
            result[key] = parseInt(valuePart, 10);
        } 
        // Otherwise, assign the string value as-is
        else {
            result[key] = valuePart;
        }
    });

    return result;
}
