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

    function isWithinOneMonth(dateString) {
        const givenDate = new Date(dateString);
        const currentDate = new Date();
        
        // Calculate the difference in months
        const monthDifference = (currentDate.getFullYear() - givenDate.getFullYear()) * 12 + (currentDate.getMonth() - givenDate.getMonth());
        
        // Check if the difference is less than or equal to 1 month
        return monthDifference < 1 || (monthDifference === 1 && currentDate.getDate() < givenDate.getDate());
    }

    var updateDt = $('#exe_update').attr('modifydate')
    //if udateDt within 1month show new
    if(isWithinOneMonth(updateDt)){
        $('#exe_update').show()
    }else{
        $('#exe_update').hide()
    }
})