let leftEditor;
let rightEditor;
const resizeOption = {
    handles: 'e',
    resize: function (event, ui) {
        const containerWidth = $("#layout").width();
        const leftWidth = ui.size.width;
        const rightWidth = containerWidth - leftWidth;
        $("#right_part").width(rightWidth);
    }
}


//===================================================== Events ==================================================
$("#left_part").resizable(resizeOption);
document.getElementById('vari_nm').addEventListener('keydown', function(e) {
    if (e.key === ' ') {
        e.preventDefault();
    }
});

$(document).ready(function(){
    $('.ui.dropdown').dropdown()
})


// HTML 2 JS
$(document).on('change, input', '#vari_nm, #raw_html, #setting_box input', function () {
    html2jsResult();
})

$(document).on('click', '#vari_type', function () {
    html2jsResult();
})



function html2jsResult(){
    let html = leftEditor.getValue()


    if($("#is_remove_cmd").prop("checked")){
        //remove empty commend
        const regex = /<!--[\s\S]*?-->/g;
        html = html.replace(regex, '');
    }


    const qout = $("#is_double_q").prop("checked") ? '"' : $("#is_double_d").prop("checked") ? '`' : "'";
    let vari = $('#vari_nm').val() || 'html';
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

    rightEditor.setValue(newText);

}

function makeEditor(){
    if(!leftEditor){
        leftEditor = applyEditorHtmlMix('raw_html');
        rightEditor = applyEditorHtmlMix('result_html');
    
        leftEditor.on('change', function() {
            html2jsResult()
        });
    }
}