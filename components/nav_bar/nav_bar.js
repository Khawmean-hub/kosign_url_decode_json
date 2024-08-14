//============================================ Events ============================================
$(document).on('click', '.btn_theme_color', onChangeThemeColor)
// $(document).on('click', '.my_navbar .item:eq(1)', onClickHtml2Js)
// $(document).on('click', '.my_navbar .item:eq(4)', onClickTextCompare)

//============================================ functions ============================================
/**
 * On change theme color
 */
function onChangeThemeColor() {
    const themeText = $(this).attr('theme')
    if(themeText.includes('dark')){
        $('body').removeAttr('class').addClass(themeText)
        $('.ui.input,.ui.checkbox, .ui.modal, .ui.form, .ui.table').addClass('inverted')
        if(themeText.includes('dark3')){
            $('#save_data_rec .box').attr('style', 'background-image: linear-gradient(43deg, #7a5ff1  51%, #7d45b2  100%);')
        }else {
            $('#save_data_rec [style="background: #f5f5f5"]').attr('style', 'background: #151515')
        }
        
        editroDark()
        setThemeName(themeText);
    }else{
        const theme = 'theme-light ' + themeText;
        $('body').removeAttr('class').addClass(theme)
        $('.ui.input, .ui.checkbox, .ui.modal, .ui.form, .ui.table').removeClass('inverted')
        $('#save_data_rec [style="background: #151515"]').attr('style', 'background: #f5f5f5')
        editroLight()
        setThemeName(theme);
    }
    
}

/**
 * On Load theme
 */
function onLoadTheme() {
    const savedTheme = getThemeName();
    if (savedTheme) {
        if(savedTheme.includes('dark')){
            $('.ui.input, .ui.checkbox, .ui.modal, .ui.form, .ui.table').addClass('inverted')
            editroDark()
        }else{
            // $('.ui.input, .ui.checkbox, .ui.modal, .ui.form, .ui.table').removeClass('inverted')
            // editroLight()
        }
        $('body').removeAttr('class').addClass(savedTheme)
    }
    $('#main-content').show()
    $('#body_loading_page').removeClass('active')
    makeDecodeEditor()
    buildJsonMenuList()
    $(`[theme="${savedTheme.split(' ')[1]}"]`).addClass('active')
}



function editroDark(){
    if(decodeResultEditor){
        decodeResultEditor.setOption('theme', 'material-ocean')
        saveBoxResult.setOption('theme', 'material-ocean')
    }
    // if(leftEditor != undefined){
    //     leftEditor.setOption('theme', 'material-ocean')
    //     rightEditor.setOption('theme', 'material-ocean')
    // }
    // if(editor != undefined){
    //     editor.left.orig.setOption("theme", 'material-ocean')
    //     editor.edit.setOption("theme", 'material-ocean')
    // }
}

function editroLight(){
    if(decodeResultEditor){
        decodeResultEditor.setOption('theme', 'material')
        saveBoxResult.setOption('theme', 'material')
    }
    // if(leftEditor != undefined){
    //     leftEditor.setOption('theme', 'material')
    //     rightEditor.setOption('theme', 'material')
    // }
    // if(editor != undefined){
    //     editor.left.orig.setOption("theme", 'material')
    //     editor.edit.setOption("theme", 'material')
    // }
}