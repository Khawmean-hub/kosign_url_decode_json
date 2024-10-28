const THEME_SESSION_NM = 'url_decode_theme_save';
const BG_IMG = 'url_decode_bg_image'


function getThemeName(){
    return localStorage.getItem(THEME_SESSION_NM) || 'theme-light theme-blue';
}

function setThemeName(themeName){
    localStorage.setItem(THEME_SESSION_NM, themeName);
}

function getBgImg(){
    const img = localStorage.getItem(BG_IMG) || '';
    if(img){
        $("#theme").attr("style", `background-image: url(${img}) !important; background-size: cover;`);
        $('body').attr("style", `background-image: url(${img}) !important; background-size: cover !important`);
    }
    return img;
}

function setBgImg(bgImg){
    if(bgImg){
        $("#theme").attr("style", `background-image: url(${bgImg}) !important; background-size: cover;`);
        $('body').attr("style", `background-image: url(${bgImg}) !important; background-size: cover !important;`);
    }else{
        $('#theme').css('background-image', '');
    }
    localStorage.setItem(BG_IMG, bgImg);
}


function getJsonStyleData(){
    const jsonData = localStorage.getItem('json_style_data');
    if(jsonData){
        window.jsonStyleObj = JSON.parse(jsonData);
    }else {
        window.jsonStyleObj = Object.assign({}, jsonEditorStyleDef)
    }
}

function setJsonStyleData(){
    localStorage.setItem('json_style_data', JSON.stringify(window.jsonStyleObj));
}

function getFontEditor(){
   var value = localStorage.getItem('font_editor_data') || '{"fontSize": 0,"lineHeight": 0}';
   window.fontEditor = JSON.parse(value);
}

function setFontEditor(){
    localStorage.setItem('font_editor_data', JSON.stringify(window.fontEditor));
}