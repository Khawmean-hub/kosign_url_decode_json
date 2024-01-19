var rank = Math.floor(Math.random() * 100) + 1;
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
            name: Object.keys(JSON.parse($('#url_result').text()))[0],
            date: moment().format('YYYY-MM-DD | hh:mm:ss a'),
            data: JSON.parse($('#url_result').text())
        }

        var oldData = localStorage.getItem('kosign_save_data')
        if(!isNull(oldData)){
            oldData = JSON.parse(oldData)   
            oldData.sort(function(a,b){
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return sortByDate(a, b);
            });

            // newObj.name = 'Save ' + rank++;
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

    $('#table-container2').empty().append(generateJson2Table(JSON.parse(decodeURIComponent($(this).attr('data-val')))));
})

$(document).on('click', '.btn_colors a',function () {
    const color = $(this).attr('data-color');
    const parent = $(this).parents('.box')
    $(parent).css('background', color)

    var oldData = localStorage.getItem('kosign_save_data')
    if(!isNull(oldData)){
        oldData = JSON.parse(oldData)
        oldData.sort(function(a,b){
            return sortByDate(a, b);
        });
        oldData[$(parent).index()]['color'] = color;

        localStorage.setItem('kosign_save_data', JSON.stringify(oldData))
    }
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
    var index = $(this).parent().parent().parent().index()
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
    onCancel($(this).parent().parent().parent().parent())
    $(this).parent().parent().parent().parent().find('.box').css('margin-right', '5px')
    const parent = $(this).parent().parent().parent();
    $(parent).find('.btn_box p').hide()
    $(parent).find('.icon_mini').hide()
    $(parent).find('.btn_box .input').show()
    $(parent).find('.btn_box .input input').val($(parent).find('.btn_box p').text())
    $(parent).find('.btn_box .input input').focus()
    $(parent).find('.mini_menu').show();
    $(parent).css('margin-right', '30px')
})
$(document).on('click','.btn_cancel', function () {
    onCancel($(this).parent().parent())
})
function onCancel(parent) {
    $(parent).css('margin-right', '5px')
    $(parent).find('.btn_box p').show()
    $(parent).find('.icon_mini').show()
    $(parent).find('.btn_box .input').hide()
    $(parent).find('.mini_menu').hide();
}
$(document).on('click','.btn_done', function () {
    onRename($(this).parent().parent());
})

$(document).on('keyup','.btn_box .input input' ,function(e) {
    if(e.which == 13) {
        onRename($(this).parent().parent().parent());
    }else if (e.key === 'Escape'){
        onCancel($(this).parent().parent().parent())
    }
});

function onReplaceJex(){
    var include = "";
    var exclude = $('#exclude_txt').val();
    $('#code_pre2').val(conVertJexInput($('#code_pre').val(), include, exclude, true))
}


 $(document).on('change', '.m_check',function() {
     onReplaceJex()
})

// $('#div_text1, #exclude_txt').on('input',function(){
//     var include = "";
//     var exclude = $('#exclude_txt').val();
//     $('#div_text2').val(conVertJexInput($('#div_text1').val(), include, exclude, true))
// })
$('#code_pre, #exclude_txt').on('input',function(){
    onReplaceJex()
})

$('#btn_save_ex').click(function () {
    if(isNull(activeProjectId)){
        onMessage('Please select project.', 'error')
        return;
    }
    projects.forEach((v, i)=>{
        if(v.id === activeProjectId){
            v.exclude = $('#exclude_txt').val();
        }
    })
    saveProjectToLocal(projects);
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


function validateVariable(variablename) {
    const re = /[a-zA-Z_][a-zA-Z0-9_]*/gm;
    return re.test(variablename);
}

function updateEmailValidity(variable) {
    const email = variable.value;
    const emailIsValid = validateVariable(email);

    if (emailIsValid) {
        $(variable).parent().removeClass('error')
    } else {
        $(variable).parent().addClass('error')
    }
}

function html2jsResult(){
    let html = $('#raw_html').val();
    options = {
        "indent":"auto",
        "indent-spaces":2,
        "wrap":80,
        "markup":true,
        "output-xml":false,
        "numeric-entities":true,
        "quote-marks":true,
        "quote-nbsp":false,
        "show-body-only":true,
        "quote-ampersand":false,
        "break-before-br":true,
        "uppercase-tags":false,
        "uppercase-attributes":false,
        "drop-font-tags":true,
        "tidy-mark":false
    }

    if($("#is_remove_cmd").prop("checked")){
        //remove empty commend
        const regex = /<!--[\s\S]*?-->/g;
        html = html.replace(regex, '');
    }

    if($("#is_format").prop("checked")){
        html = tidy_html5(html, options);
        $('#raw_html').val(html);
    }

    const qout = $("#is_double_q").prop("checked") ? '"' : $("#is_double_d").prop("checked") ? '`' : "'";
    let vari = $('#vari_nm').val() || 'result';
    vari = vari.trim();
    const showVari = $("#is_show_vari").prop("checked") ? $("#type_vari").text()+' ' + vari + " = '';\n" : '';
    const regex = /^\s+|\n/g;
    // const newText = html.replace(regex, "'$&'");
    const nArray = html.split(regex);
    nArray.forEach((v, i)=>{
        if(v.trim() !== ''){
            if($("#is_remove_whitespace").prop("checked")) {
                nArray[i] =vari + " += " +  v.replace(/^( *)([^\s])/gm, qout+"$2") + qout;
            }else{
                nArray[i] =vari + " += " +  v.replace(/^( *)([^\s])/gm, "$1"+qout+"$2") + qout;
            }
        }
    })

    if($("#is_remove_line").prop("checked")){
        //remove empty line
        nArray.forEach((v, i)=>{
            if(v.trim() === ''){
                nArray.splice(i, 1);
            }
        })
    }

    const newText = showVari + nArray.join("\n");

    $("#result_html").val(newText);

}

$(document).on('input', '#vari_nm', function () {
    updateEmailValidity(this);
});

// HTML 2 JS
$(document).on('change, input', '#vari_nm, #raw_html, #setting_box input', function () {
    html2jsResult();
})

$(document).on('click', '#vari_type', function () {
    html2jsResult();
})
$(".btn_2table2").click(function () {
    if($(this).hasClass('olive')){
        $(this).removeClass('olive');
        $(this).empty().append('Show Table')
        $('#table-container2').hide();
        $(".save1 pre").show()
    }else{
        $(this).addClass('olive');
        $(this).empty().append('Show JSON')
        $('#table-container2').show();
        $(".save1 pre").hide()
    }
})

$(".btn_2table").click(function () {
    if($(this).hasClass('olive')){
        $(this).removeClass('olive');
        $(this).empty().append('Show Table')
        $('#table-container').hide();
        $("#url_result").show();
    }else{
        $(this).addClass('olive');
        $(this).empty().append('Show JSON')
        $('#table-container').show();
        $("#url_result").hide();
    }
})


onCheckExcludeSave();
// checkLiveMode()
loadData();

confirmSaveDefault();
buildProjectDrop();

$('#url_text').on('input',function(){
    decode();
})

$(document).ready(function () {
    $('.menu .item').tab();
    $('.ui.dropdown')
        .dropdown()
    ;
})



// Drage box 
// ================================================================================
$(document).on('click','.btn_mini_format', function () {
    $(this).parents('.draggable').find('pre').html(formatJsonRaw($(this).parents('.draggable').find('pre').text()))
})

$(document).on('click','.btn_mini_copy', function () {
    copy($(this).parents('.draggable').find('pre').text())
    onMessage('Copies to clipboard.')
})

$(document).on('click','.btn_detroy', function () {
    $(this).parents('.draggable').remove();
})

$('#btn_make_drag_box').on('click', function () {
    if(!isNull($('.save1 pre').text())){

        var timer = setTimeout(function() {
            if($('.draggable').length < 10){
                createDragBox($('.save1 pre').text());
            }else{
                onMessage('You can only have 10 popup box.')
                return;
            }
          }, 200);

          $(this).on('dblclick', function() {
            clearTimeout(timer);
            // Double click logic here
            try{
                const json  = JSON.parse($('.save1 pre').text());
                let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
                width=600,height=300,left=100,top=100`;
            
                open('popup.html?_JSON_='+JSON.stringify(json), 'test', params);
            }catch(e){
                onMessage(e.message)
                return;
            }
          });

       
    }else{
        onMessage('No data to pop.')
        return;
    }
})
