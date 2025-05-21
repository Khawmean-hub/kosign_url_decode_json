$(document).ready(function(){
    toastrSetting()
    getBgImg();
    onLoadTheme();
    onLoadJsonStyle();
    onLoadFontEditor()

    //need refresh when change
    getGuidLineSetting() ? $('.show-guild-line').popup({position: 'right center'}) : '';

    //for semantic ui
    loadSemacticUi()
    
    //for develop
    // setTimeout(()=>{
    //     $('#other_menu .item:eq(3)').click()
    // }, 1000);
    //if window show button download exe if other hide
    if(isWindow()){
        $('.download_file_ext').show()
    }else{
        $('.download_file_ext').hide()
    }
})