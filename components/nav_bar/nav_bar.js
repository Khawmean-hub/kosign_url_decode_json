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
    const theme = 'theme-light ' + themeText;
    $('body').removeAttr('class').addClass(theme)
    setThemeName(theme);
    $("iframe").contents().find('body').removeAttr('class').addClass(theme)
}

/**
 * On Load theme
 */
function onLoadTheme() {
    const savedTheme = getThemeName();
    if (savedTheme) {
        $('body').removeAttr('class').addClass(savedTheme)
    }
    $('#main-content').show()
    $('#body_loading_page').removeClass('active')
    makeDecodeEditor()
    buildJsonMenuList()
    $(`[theme="${savedTheme.split(' ')[1]}"]`).addClass('active')
}