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