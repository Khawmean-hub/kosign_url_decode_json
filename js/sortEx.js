//-------------------------------------------------------------
// Events
//-------------------------------------------------------------

$('#raw_string').on('input', function() {
    sort();
})

$('#is_sort_ex, #is_sort_re, #is_sort_re_str, #is_show_ex').on('change', function() {
    sort();
})




//-------------------------------------------------------------
// Functions
//-------------------------------------------------------------
function sort() {
    const str   = $('#raw_string').val()
    let list    = str.split('\n');
    list        = list.filter(e => e.trim()!== '');
    list        = list.map(e => e + '\n');

    let image   = list.filter(a=> a.match(/.svg\n|.png\n|.jpeg\n|.gif\n|.webp\n/gm)).sort().map(v=> 'Image	'+v)
    let pdf     = list.filter(a=> a.match(/.pdf\n/gm)).sort().map(v=> 'PDF	'+v)
    let excel   = list.filter(a=> a.match(/.xlsx\n|.xls\n/gm)).sort().map(v=> 'PDF	'+v)
    let pro     = list.filter(a=> a.match(/.properties\n/gm)).sort().map(v=> 'Properties	'+v)
    let css     = list.filter(a=> a.match(/.css\n/gm)).sort().map(v=> 'css	'+v)
    let js      = list.filter(a=> a.match(/.js\n/gm)).sort().map(v=> 'js	'+v)
    let view    = list.filter(a=> a.match(/_view.jsp\n/gm)).sort().map(v=> 'view	'+v)
    let action  = list.filter(a=> a.match(/_act.jsp\n/gm)).sort().map(v=> 'action	'+v)
    let ido     = list.filter(a=> a.match(/^IDO./gm)).sort().map(v=> 'IDO	'+v)
    let xml     = list.filter(a=> a.match(/^WSVC./gm)).sort().map(v=> 'WSVC	'+v)
    let java    = list.filter(a=> a.match(/.java\n/gm)).sort().map(v=> 'java	'+v)

    let listObj = [...pdf, ...excel, ...image, ...pro, ...css, ...java, ...js, ...view, ...action,  ...ido, ...xml]

    $('#show_ex_result').val(listObj.join(''))
}
