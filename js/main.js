
var colors = [
    '#EB455F',
    '#F5B512',
    '#A555EC',
    '#BCE29E',
    '#82CD47',
    '#6C00FF',
    '#3F0071'
]


function changeColor() {
    var d = new Date().getDay();
    $('.nav_bar').css('backgroundColor', colors[d])
}
changeColor()
//Event



$('.btn_decode').click(function () {
    decode();
})
$('.btn_save').click(function () {
    save();
    try {
        var newObj = {
            name: 'Save',
            date: moment().format('YYYY-MM-DD | hh:mm a'),
            data: JSON.parse($('#url_result').text())
        }

        var oldData = localStorage.getItem('kosign_save_data')
        if(!isNull(oldData)){
            oldData = JSON.parse(oldData)   
            oldData.sort(function(a,b){
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return a.name > b.name ? -1 : 1;
            });

            var rank = 1;
            if(oldData.length > 1) {
                rank = Number(oldData[0].name.slice(-1)) + 1;
            }
           
            newObj.name = 'Save ' + rank;
            oldData.push(newObj)
            localStorage.setItem('kosign_save_data', JSON.stringify(oldData))
        }else{
            var ls = [];
            ls.push(newObj);
            localStorage.setItem('kosign_save_data', JSON.stringify(ls))
        }
    } catch (error) {
        
    }
    loadData();
})

//
$('#live_mode').change(function() {
    var mode = $(this).prop('checked');
    localStorage.setItem('kosign_live_mode', mode)
    if(mode){
        decode()
    }
    checkLiveMode()
})

var isHide =false;
$('.btn_zoom').click(function () {
    if(isHide){
        isHide = false;
        $('.btn_zoom').empty().append('<i class="zoom-in icon"></i> Zoom In')
        $('.layout').css('gridTemplateColumns', 'calc(50% - 5px) 10px calc(50% - 5px)')
    }else{
        isHide = true;
        $('.btn_zoom').empty().append('<i class="zoom-out icon"></i> Zoom Out')
        $('.layout').css('gridTemplateColumns', '100%')
    }
})


$('.btn_keys_json').click(function (){
    $('#url_result').text(onlyKeyToJson($('#url_result').text()))
    formatJson('#url_result')
})

$('.btn_format').click(function () {
    formatJson('#url_result');
})
$('.btn_format2').click(function () {
    formatJson('.save1 pre');
})

$('.btn_copy').click(function () {
    copy($('#url_result').text())
    onMessage('Copies to clipboard.')
})

$('.btn_copy2').click(function () {
    copy($('.save1 pre').text())
    onMessage('Copies to clipboard.')
})

$('#dark_mode').change(function () {
    if($(this).prop('checked')){
        $('body').removeClass('light')
        $('body').addClass('dark')
        change_theme(true);
    }else{
        $('body').removeClass('dark')
        $('body').addClass('light')
        change_theme(false);
    }
})

$(document).on('click', '.btn_box',function () {
    var str = JSON.stringify(JSON.parse(decodeURIComponent($(this).attr('data-val'))), undefined, 4);
    $('.save1 pre').html(syntaxHighlight(str))

    $('.box').removeClass('active_select');
    $(this).parent().addClass('active_select')
})

$('.btn_clear_data').click(function () {
    onConfirm({
        description: 'Do you really want to clear all data?',
        onConfirm: function(){
            localStorage.removeItem('kosign_save_data')
            loadData();
            $('.save1 pre').html('');
            onMessage('All data is cleared.')
        }
    })
})

$(document).on('click','.btn_delete', function () {
    var index = $(this).parent().index()
    onConfirm({
        description: 'Do you really want to remove this data?',
        onConfirm: function(){
            onRemoveData(index)
            loadData()
            onMessage('The data is remove.')
        }
    })
})

$(document).on('click','.btn_rename', function () {
    const parent = $(this).parent().parent().parent();
    $(parent).find('.btn_box p').hide()
    $(parent).find('.icon_mini').hide()
    $(parent).find('.btn_box .input').show()
    $(parent).find('.btn_box .input input').val($(parent).find('.btn_box p').text())
    $(parent).find('.btn_box .input input').focus()
    $(parent).find('.mini_menu').show();
    $(parent).css('margin-right', '24px')
})
$(document).on('click','.btn_cancel', function () {
    const parent = $(this).parent().parent();
    $(parent).css('margin-right', '10px')
    $(parent).find('.btn_box p').show()
    $(parent).find('.icon_mini').show()
    $(parent).find('.btn_box .input').hide()
    $(parent).find('.mini_menu').hide();
})

$(document).on('click','.btn_done', function () {
    const parent = $(this).parent().parent();
    var index = $(parent).index()
    var oldData = localStorage.getItem('kosign_save_data')
    if(!isNull(oldData)){
        oldData = JSON.parse(oldData)

        oldData.sort(function(a,b){
            //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
            return moment(a.date, 'YYYY-MM-DD | hh:mm a').format('YYYYMMDDhhmm') > moment(b.date, 'YYYY-MM-DD | hh:mm a').format('YYYYMMDDhhmm') ? -1 : 1;
        });
        oldData[index].name = $(parent).find('.btn_box .input input').val();
        localStorage.setItem('kosign_save_data', JSON.stringify(oldData))
    }
    loadData()
})

 $(document).on('change', '.m_check',function() {
    var include = "";
    var exclude = $('#exclude_txt').val();
    $('#div_text2').val(conVertJexInput($('#div_text1').val(), include, exclude, true))
})

$('#div_text1, #exclude_txt').on('input',function(){
    var include = "";
    var exclude = $('#exclude_txt').val();
    $('#div_text2').val(conVertJexInput($('#div_text1').val(), include, exclude, true))
})

$('#btn_save_ex').click(function () {
    localStorage.setItem('my_exclude',  $('#exclude_txt').val())
    onMessage('Save exclude done.')
})

$('.btn_camel_case').click(function (){
    $('#url_result').text(replaceAllToCamelCase($('#url_result').text()))
    formatJson('#url_result')
})

$('.btn_snake_case').click(function (){
    $('#url_result').text(replaceAllToSnakeCase($('#url_result').text()))
    formatJson('#url_result')
})

function buildCheck(){
    var html='';
    replaceJson.forEach(v=>{
        html += `<div class="ui checkbox" style="margin-right: 20px">
                    <input type="checkbox" class="m_check" checked>
                    <label>${v.from} => ${v.to}</label>
                </div>`;
    })

    $('#check_con').empty().append(html)
}

function onCheckExcludeSave() {
    try{
        var exclude = localStorage.getItem('my_exclude');
        if (isNull(exclude)){
            exclude = defalutExclude;
            localStorage.setItem('my_exclude', exclude)
        }
        $('#exclude_txt').val(exclude)

    }catch(e){

    }
}

onCheckExcludeSave();
buildCheck();
// checkLiveMode()
loadData();
$('#url_text').on('input',function(){
    decode();
})

$(document).ready(function () {
    $('.menu .item').tab();
    $('.ui.dropdown')
        .dropdown()
    ;
})