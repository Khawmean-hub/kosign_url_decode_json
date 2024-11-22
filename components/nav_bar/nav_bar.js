//============================================ Events ============================================
$(document).on('click', '.btn_theme_color', onChangeThemeColor)
$(document).on('click', '.btn-bg-img', onChnageBgImage)
$(document).on('click', '.btn-bg-img-none', onChnageBgImageNone)
$(document).on('click', '.btn-bg-img-your', onChnageBgImageYour)
$(document).on('click', '#bg_img_upload_text', onClickUpload)
$(document).on('change', '#bg_img_upload', onChangeFileUploadImg)
$(document).on('click', '#btn_upload_bg_img', onSaveBgImg)
$(document).on('input', '#link_bg_img_input', onInputLinkImg)
$(document).on('click', '.cus_btn', onShowSidebar)
// $(document).on('click', '.my_navbar .item:eq(1)', onClickHtml2Js)
// $(document).on('click', '.my_navbar .item:eq(4)', onClickTextCompare)
$(document).on('input', '#json_editor_color input', onChangeJsonColor)
$(document).on('input', '#font_editor input', onChnageFontEditor)
$(document).on('click', '#font_editor button', onClearFontEditor)
$(document).on('click', '#btn_clear_json_css', onClearJsonCss)
$(document).on('click', '#btn_focus_mode', onFocusMode)
$(document).on('input', '.input_have_clear', onShowBtnClearOrNot)
$(document).on('click', '.btn_clear_its_input', onClearItsInput)

//============================================ functions ============================================
/**
 * On change theme color
 */
function onChangeThemeColor() {
    const themeText = $(this).attr('theme')
    if (themeText.includes('dark')) {
        $('#theme').removeAttr('class').addClass(themeText)
        $('.ui.input,.ui.checkbox, .ui.modal, .ui.form, .ui.table').addClass('inverted')
        if (themeText.includes('dark3')) {
            $('#save_data_rec .box').attr('style', 'border: none; background-image: radial-gradient( circle farthest-corner at 3.2% 49.6%, rgba(161,10,144,0.72) 0%,  rgba(80,12,139,0.87) 83.6%);')
        } else if (themeText.includes('dark4')) {
            $('#save_data_rec .box').attr('style', 'background: #00000069;')
        } else {
            $('#save_data_rec [style="background: #f5f5f5"]').attr('style', 'background: #151515')
        }

        editroDark()
        setThemeName(themeText);
    } else {
        const theme = 'theme-light ' + themeText;
        $('#theme').removeAttr('class').addClass(theme)
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
        if (savedTheme.includes('dark')) {
            $('.ui.input, .ui.checkbox, .ui.modal, .ui.form, .ui.table').addClass('inverted')
            editroDark()
        } else {
            // $('.ui.input, .ui.checkbox, .ui.modal, .ui.form, .ui.table').removeClass('inverted')
            // editroLight()
        }
        $('#theme').removeAttr('class').addClass(savedTheme)
    }
    $('#main-content').show()
    $('#body_loading_page').removeClass('active')
    makeDecodeEditor()
    buildJsonMenuList()
    $(`[theme="${savedTheme.split(' ')[1]}"]`).addClass('active')
}



function editroDark() {
    if (decodeResultEditor) {
        decodeResultEditor.setOption('theme', 'material-ocean')
        saveBoxResult.setOption('theme', 'material-ocean')
    }

    try{
        if(leftEditor){
            leftEditor.setOption('theme', 'material-ocean')
            rightEditor.setOption('theme', 'material-ocean')
        }
    }catch(e){}
}

function editroLight() {
    if (decodeResultEditor) {
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



function onChnageBgImage() {
    const bgImage = $(this).find('img').attr('src')
    console.log('>>>>', bgImage)
    setBgImg(bgImage)
}
function onChnageBgImageNone() {
    setBgImg('')
}
function onChnageBgImageYour() {
    $('#bg-img-modal').modal('show')
    $('body').removeClass('dimmable').css('height', 'auto');
}

function onClickUpload() {
    $('#bg_img_upload').trigger('click')
}

function onChangeFileUploadImg() {
    window.lastAtion = 'file'
    const file = $('#bg_img_upload')[0].files[0]
    window.tempFile = file;
    $('#bg_img_upload_text').val(file.name)
    const reader = new FileReader()
}

function onSaveBgImg() {
    try {
        if(window.lastAtion==='link' && window.tempLink){
            setBgImg(window.tempLink)
        }
        
        if(window.lastAtion==='file' && window.tempFile){
            const file = window.tempFile
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                const dataURL = reader.result
                setBgImg(dataURL)
            }
        }
    } catch (e) {

    }
}

function onInputLinkImg() {
    window.lastAtion = 'link'
    const link = $(this).val()
    window.tempLink = link;
}

function onShowSidebar(){
    $('#setting_side_bar')
    .sidebar({
        transition: 'scale down'
    })
    .sidebar('toggle')
}



function onFocusMode(){
    if($('.my_navbar').eq(0).css('display') != 'flex'){
        $('.my_navbar').eq(0).css('display', 'flex')
        $('.controll_div').show()
        $('#layout').eq(0).css('padding-top', '42px')
        $('.right_mmmm').css('margin-top', '20px')
        $('#layout .CodeMirror').css('height', 'calc(100vh - 300px)')

    }else{
        $('.my_navbar').eq(0).css('display', 'none')
        $('.controll_div').hide()
        $('#layout').eq(0).css('padding-top', '0')
        $('.right_mmmm').css('margin-top', '0')
        $('#layout .CodeMirror').css('height', 'calc(100vh - 70px)')
    }
}


function onShowBtnClearOrNot(){
    const val = $(this).val()
    if(val.trim() === ''){
        $(this).siblings('.btn_clear_its_input').hide()
    }else{
        $(this).siblings('.btn_clear_its_input').show()
    }
}

function onClearItsInput(){
    $(this).siblings('input').val('').trigger('input')
    $(this).hide()
}