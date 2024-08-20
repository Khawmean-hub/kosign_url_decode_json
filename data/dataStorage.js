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
        $("body").attr("style", `background-image: url(${img}) !important; background-size: cover;`);
    }
    return img;
}

function setBgImg(bgImg){
    if(bgImg){
        $("body").attr("style", `background-image: url(${bgImg}) !important; background-size: cover;`);
    }else{
        $('body').css('background-image', '');
    }
    localStorage.setItem(BG_IMG, bgImg);
}