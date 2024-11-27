$(document).ready(function(){
    toastrSetting()
    getBgImg();
    onLoadTheme();
    $('.menu .item').tab();
    $('.ui.dropdown').dropdown();
    onLoadJsonStyle();
    onLoadFontEditor()

    getGuidLineSetting() ? $('.show-guild-line').popup({position: 'right center'}) : ''
})