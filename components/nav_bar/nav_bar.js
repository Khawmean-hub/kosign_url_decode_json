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
    // if(leftEditor != undefined){
    //     leftEditor.setOption('theme', 'material-ocean')
    //     rightEditor.setOption('theme', 'material-ocean')
    // }
    // if(editor != undefined){
    //     editor.left.orig.setOption("theme", 'material-ocean')
    //     editor.edit.setOption("theme", 'material-ocean')
    // }
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