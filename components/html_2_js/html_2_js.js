//variable
let leftEditor;
let rightEditor;
let p = '#html_2_js '
const resizeOption = {
    handles: 'e',
    resize: function (event, ui) {
        const containerWidth = $(p + "#layout2").width();
        const leftWidth = ui.size.width;
        const rightWidth = containerWidth - leftWidth;
        $(p + "#right_part").width(rightWidth);
    }
}

//================================ init ============================
/**
 * on load function....
 */
export function init() {
    $(p+"#left_part").resizable(resizeOption);
    document.getElementById('vari_nm').addEventListener('keydown', function (e) {
        if (e.key === ' ') {
            e.preventDefault();
        }
    });
    $('.ui.dropdown').dropdown()
    makeEditor();
}

//===================================================== Events ==================================================

// HTML 2 JS
$(document).on('change, input', '#vari_nm, #raw_html, #setting_box input', function () {
    htmlToJsResult();
})

$(document).on('click', '#vari_type', function () {
    htmlToJsResult();
})

$(document).on('click', '#btn_html2js_format', onFormatHtml2js)

$(document).on('click', '#btn_html2js_paste', async function(){
    const text = await navigator.clipboard.readText();
    leftEditor.setValue(text)
})

$(document).on('click', '#btn_html2js_copy', function(){copyToClipboard(rightEditor.getValue())})



//===================================================== Functions ==================================================
/**
 * html to js result
 */
function htmlToJsResult () {
    let html = leftEditor.getValue()

    if ($("#is_remove_cmd").prop("checked")) {
        //remove empty commend
        const regex = /<!--[\s\S]*?-->/g;
        html = html.replace(regex, '');
    }


    const qout = $("#is_double_q").prop("checked") ? '"' : $("#is_double_d").prop("checked") ? '`' : "'";
    let vari = $('#vari_nm').val() || 'html';
    vari = vari.trim();
    const showVari = $("#is_show_vari").prop("checked") ? $("#type_vari").text() + ' ' + vari + " = '';\n" : '';
    const regex = /^\s+|\n/g;
    // const newText = html.replace(regex, "'$&'");
    const nArray = html.split(regex);
    nArray.forEach((v, i) => {
        if (v.trim() !== '') {
            if ($("#is_remove_whitespace").prop("checked")) {
                nArray[i] = vari + " += " + v.replace(/^( *)([^\s])/gm, qout + "$2") + qout;
            } else {
                nArray[i] = vari + " += " + v.replace(/^( *)([^\s])/gm, "$1" + qout + "$2") + qout;
            }
        }
    })

    if ($("#is_remove_line").prop("checked")) {
        //remove empty line
        nArray.forEach((v, i) => {
            if (v.trim() === '') {
                nArray.splice(i, 1);
            }
        })
    }

    const newText = showVari + nArray.join("\n");

    rightEditor.setValue(newText);

}

/**
 * Make editor apply codemirror
 */
function makeEditor () {
    if (!leftEditor) {
        leftEditor = applyEditorHtmlMix('raw_html');
        rightEditor = applyEditorHtmlMix('result_html');
        leftEditor.on('change', function () {
            htmlToJsResult()
        });
    }
}

function onFormatHtml2js(){
    if(leftEditor){
        // Get the content from CodeMirror
        var content = leftEditor.getValue().trim();
        // Beautify the content
        var formattedContent = html_beautify(content, {
            indent_size: 2,
            space_in_empty_paren: true,
            brace_style: "collapse,preserve-inline",
        });
        // Set the formatted content back to CodeMirror
        leftEditor.setValue(formattedContent);
    }
}