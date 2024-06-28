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
    const $temp = $("<textarea>");
    // Append the temporary text area element to the body
    $("body").append($temp);
    // Set the value of the temporary text area to the text to be copied
    $temp.val(str).select();
    // Execute the copy command
    document.execCommand("copy");
    $temp.remove();
    toastr.success("Text copied to clipboard!");
}


/**
 * Check is a json or encode url
 */
function isJsonOrEncodeUrl(str) {
    function isJson(str) {
        try {
            JSON.parse(str);
            return true;
        } catch (e) {
            return false;
        }
    }

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