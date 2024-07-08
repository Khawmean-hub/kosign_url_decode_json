let editor;

//============================== Events =============================
$(document).ready(function(){
    toastrSetting()
    $('.ui.dropdown').dropdown();
})

$(document).on('change', '#langauge_com', onChangeLanguage)
$(document).on('click', '#btn_copy_2_right', onCopytToRight)
$(document).on('click', '#btn_copy_2_left', onCopytToLeft)
$(document).on('click', '#btn_swap', onSwap)
    // Example of undo and redo
document.addEventListener('keydown', function(e) {
    if(editor){
        if (e.ctrlKey && e.key === 'z') {
            editor.editor().undo();
        } else if (e.ctrlKey && e.key === 'y') {
            editor.editor().redo();
        }
    }
});


//============================= Functions ============================

function makeEditor(){
    if(!editor){
        editor = applyEditorTextCompare('editor')

        editor.left.orig.on('change', function() {
            showDiffInfo()
        });
        editor.edit.on('change', function() {
            showDiffInfo()
        });
    }
}

/**
 * on change language
 */
function onChangeLanguage(){
    if(editor){
        let language = $(this).val()
        if(language === 'javascript'){
            language = { name: "javascript", json: true }
        }
        editor.left.orig.setOption("mode", language)
        editor.edit.setOption("mode", language)
    }
}

function onCopytToLeft(){
    if(editor){
        const code = editor.edit.getValue()
        editor.left.orig.setValue(code)
        toastr.info('Copy all to the left.')
    }
}

function onCopytToRight(){
    if(editor){
        const code = editor.left.orig.getValue()
        editor.edit.setValue(code)
        toastr.info('Copy all to the right.')
    }
}

function onSwap(){
    if(editor){
        const leftCode = editor.left.orig.getValue()
        const rightCode = editor.edit.getValue()
        editor.left.orig.setValue(rightCode)
        editor.edit.setValue(leftCode)
        toastr.info('Swap.')
    }
}

function showDiffInfo(){
    $('#diff_info').html('Diff count : ' + editor.leftChunks().length)
    setTimeout(function(){
        const red = $('.CodeMirror-merge-l-deleted, .CodeMirror-merge-r-deleted').length;
        const blue = $('.CodeMirror-merge-l-inserted, .CodeMirror-merge-r-inserted').length;
        $('#diff_red').html('Red : ' + red)
        $('#diff_blue').html('Green : ' + blue)
    }, 500)
}

function onSetCompare(str, str2){
    if(editor){
        editor.left.orig.setValue(str)
        editor.edit.setValue(str2)
        if(isJson(str)){
            $('#langauge_com').dropdown('set selected', 'javascript')
        }
    }
}