$(document).ready(function(){
    toastrSetting()
    onLoadTheme();
    $('.menu .item').tab();
    $('.ui.dropdown').dropdown();
    onCheckExcludeSave();
    // checkLiveMode()
    confirmSaveDefault();
})