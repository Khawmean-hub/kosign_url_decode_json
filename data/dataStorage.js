const THEME_SESSION_NM = 'url_decode_theme_save';


function getThemeName(){
    return localStorage.getItem(THEME_SESSION_NM) || 'theme-light theme-blue';
}

function setThemeName(themeName){
    localStorage.setItem(THEME_SESSION_NM, themeName);
}