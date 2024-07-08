//============================================ Events ============================================
$(document).on('click', '.btn_theme_color', onChangeThemeColor)
$(document).on('click', '.my_navbar .item:eq(1)', onClickHtml2Js)
$(document).on('click', '.my_navbar .item:eq(4)', onClickTextCompare)

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
        setTimeout(function () {
            $('body').removeAttr('class').addClass(savedTheme)
            $("iframe").contents().find('body').addClass(savedTheme)
        }, 1000)
    }
}




function onClickHtml2Js() {
    var iframe = document.getElementById('jshtml');
    iframe.contentWindow.makeEditor();
}

function onClickTextCompare() {
    var iframe = document.getElementById('text_compare');
    iframe.contentWindow.makeEditor();
}