// HTML 2 JS
$(document).on('change, input', '#vari_nm, #raw_html, #setting_box input', function () {
    html2jsResult();
})

$(document).on('click', '#vari_type', function () {
    html2jsResult();
})



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

function updateEmailValidity(variable) {
    const email = variable.value;
    const emailIsValid = validateVariable(email);

    if (emailIsValid) {
        $(variable).parent().removeClass('error')
    } else {
        $(variable).parent().addClass('error')
    }
}

function validateVariable(variablename) {
    const re = /[a-zA-Z_][a-zA-Z0-9_]*/gm;
    return re.test(variablename);
}

