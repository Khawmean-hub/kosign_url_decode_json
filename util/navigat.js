const loader = `
<div style="height: 50vh">
  <div class="ui active loader"></div>
  <p></p>
 </div>
`


// ====================================================== Second way ==============================================



function loadComponent(component, callback) {
    if ($('#' + component).html() === '' || $('#' + component).html() === loader) {
        $('#' + component).empty().append(loader)
        // Load HTML
        $('#' + component).load(`components/${component}/${component}.html`, function () {
            // Remove previous component CSS
            // $(`link[data-${component}-css]`).remove();
            // Load CSS
            if(component==='text_compare'){
                loadDataForTextCompare()
            }
            $('head').append(`<link rel="stylesheet" href="components/${component}/${component}.css" type="text/css" />`);

            // Dynamically import the module
            import(`../components/${component}/${component}.js`).then(m =>{
                if(m.init){
                    m.init()
                }
                if(callback) callback()
            });
        });
    }else {
        if(callback) callback()
    }

}

const navi = {
    html2js: () => { loadComponent('html_2_js') },
    jex: ()=> {loadComponent('jex')},
    subtitle: ()=> {loadComponent('subtitle')},
    txtCompare: (callback)=> {loadComponent('text_compare', callback)},
    pattern: ()=> {loadComponent('pattern', ()=>{$('.show_my_popup').popup({html: true, variation: 'wide'});})},
    calendar: ()=> {loadComponent('calendar_excel')}
}



function loadDataForTextCompare(){

    $('head').append(`<link rel="stylesheet" href="library/codemirror/css/merge.css">`)
    $('head').append(`<link rel="stylesheet" href="library/codemirror/css/neat-theme.css">`)
    
    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/mode/htmlmixed/htmlmixed.min.js"></script>`)
    $('head').append(`<script src="library/codemirror/js/diff.js"></script>`)
    $('head').append(`<script src="library/codemirror/js/merge.js"></script>`)

    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/addon/search/searchcursor.min.js"></script>`)
    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/addon/search/search.min.js"></script>`)
    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/addon/dialog/dialog.min.js"></script>`)
    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/addon/search/jump-to-line.min.js"></script>`)
    $('head').append(`<script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.5/addon/search/matchesonscrollbar.min.js"></script>`)
}