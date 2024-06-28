//============================================ Events ============================================
$(document).on('click', '.btn_theme_color', onChangeThemeColor)

//============================================ functions ============================================
/**
 * On change theme color
 */
function onChangeThemeColor(){
    const themeText = $(this).attr('theme')
    const theme = 'theme-light ' + themeText;
    $('body').removeAttr('class').addClass(theme)
    setThemeName(theme);
}

/**
 * On Load theme
 */
function onLoadTheme(){
    const savedTheme = getThemeName();
    if(savedTheme){
        $('body').removeAttr('class').addClass(savedTheme)
    }
}