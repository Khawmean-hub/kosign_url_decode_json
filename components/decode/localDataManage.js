const LOCAL_SESSION_JSON_DATA = 'kosign_save_data';
const jsonMenuDefaultColor = '#f5f5f5'
const jsonMenuNoData = `<div class="bg_box_color" style="padding: 30px;#f7f7f7; border-radius: 10px;"><h4 style="color: rgb(146, 146, 146);">No Data</h4></div>`;
const jsonMenuSetting = `<div class="ui icon left pointing dropdown mini icon_mini btn_box_close">
                            <i class="ellipsis vertical icon"></i>
                            <div class="menu">
                            <div class="item btn_change_color" style="padding: 6px !important;">
                                <i class="dropdown icon"></i>
                                <span class="text"><i class="circle icon pink"></i>
                                    Color</span>
                                    <div class="menu">
                                        <div class="item" style="padding: 6px !important;">
                                            <div class="btn_colors" style="display: grid; grid-template-columns: auto auto auto auto auto; grid-gap: 5px">
                                                <a class="ui red empty circular label" data-color="#ffe8e8"></a>
                                                <a class="ui orange empty circular label" data-color="#ffe8e0"></a>
                                                <a class="ui yellow empty circular label" data-color="#fcf4de"></a>
                                                <a class="ui olive empty circular label" data-color="#f7ffbf"></a>
                                                <a class="ui green empty circular label" data-color="#ccffbf"></a>
                                                <a class="ui teal empty circular label" data-color="#dcfcec"></a>
                                                <a class="ui blue empty circular label" data-color="#cfe8ff"></a>  
                                                <a class="ui violet empty circular label" data-color="#dfd9ff"></a>
                                                <a class="ui purple empty circular label" data-color="#e9bfff"></a>
                                                <a class="ui pink empty circular label" data-color="#ffbff5"></a>
                                                <a class="ui brown empty circular label" data-color="#ffe0cc"></a>
                                                <a class="ui grey empty circular label" data-color="#f5f5f5"></a>
                                                <!-- <a class="ui black empty circular label" data-color="#ffb3b3"></a>-->
                                            </div>
                                        </div>
                                  </div>
                                </div>
                                <div class="item btn_rename" style="padding: 6px !important;">
                                    <i class="edit outline icon blue"></i>
                                    Rename</div>
                                
                                <div class="item btn_delete" style="padding: 6px !important;">
                                    <i class="trash alternate outline icon red"></i>
                                    Delete</div>
                            </div>
                        </div>`
const bookmarkOut = `<i class="star outline icon small btn_book_mark_me"></i>`;
const bookmarkActive = `<i class="star icon small btn_book_mark_me"></i>`;
const duplicateDat = (name, isLast) => {
    return `<div class="dupdatapop" ${isLast ? 'data-position="top right"' : ''} data-tooltip="Duplicate with ${name}" data-inverted=""><i class="circle icon"></i></div>`
}
//======================================= Events =======================================
$(document).on('click', '.btn_clear_data', onClearAllJsonData)
$(document).on('click', '.btn_delete', onDeleteJsonMenu)
$(document).on('click', '.btn_box', onClickJsonMenu)
$(document).on('click', '.btn_book_mark_me', onBookMarkMe)
$(document).on('click', '.btn_colors a', onChangeColorJsonMenu)
$(document).on('click','.btn_rename', onRenameJsonMenu)
$(document).on('click','.btn_cancel', onCancelRenameJson)
$(document).on('click','.btn_done', onDoceRenameJson)
$(document).on('keyup','.btn_box .input input', onKeyPressRename);

$(document).on('click', '.btn_format2', onFormatRightBox)
$(document).on('click', '.btn_2table2', onToogleRightBox)
$(document).on('click', '.btn_copy2', onCopyRightBoxJson)
$(document).on('click', '#btn_make_drag_box', onMakeNewDrage)
$(document).on('click', '#btn_compare_json', onCompare2Editor)


//======================================= Funtions =======================================
function buildJsonMenuList() {
    // Get local data
    const data = getWithCheckkDuplicateData(localData.findAll());

    //sort by date
    data.sort(function (a, b) {
        return sortByDate(a, b);
    });

    //sort by bookmark
    data.sort((a, b) => b.isFavorite - a.isFavorite);

    var html = '';
    let $jsonMenuContain = $('#save_data_rec');
    const activeJsonId = $('#box_fixed_active_text').attr('active-json-id')
    // build json menu list
    $.each(data, function (i, v) {
        html += `
            <div class="box ${activeJsonId === v['id'] ? 'active_select' : ''}" id="${v['id']}" style="background: ${v['color'] ? v['color'] : jsonMenuDefaultColor}">
                <div class="book_mark_contain">${v['isFavorite'] ? bookmarkActive : bookmarkOut}</div>
                ${v['dupName'] ? duplicateDat(v['dupName'], i===data.length-1) : ''}
                ${jsonMenuSetting}
                <div class="btn_box" data-val="${encodeURIComponent(JSON.stringify(v))}">
                    <p class="text_fixed_color">${v.name}</p>
                    <div class="ui input mini" style="display: none">
                        <input type="text" placeholder="Rename" value="${v.name}">
                    </div>

                    <div style="margin-top: 3px;"><small>${getDateFormat(v.date)}</small></div></div>
                    <div class="mini_menu" style="display: none">
                        <a class="item btn_done">
                            <i class="check circle outline icon"></i>
                        </a>
                        <a class="item btn_cancel">
                            <i class="close icon red"></i>
                        </a>
                    </div>
            </div>`
    })
            
    $jsonMenuContain.empty().append(html);
    if(!html){$jsonMenuContain.empty().append(jsonMenuNoData);}  
    $('.btn_box_close').dropdown();

    if(getThemeName().includes('dark')){
        if(getThemeName().includes('dark3')){
            $('#save_data_rec .box').attr('style', 'border: none; background-image: radial-gradient( circle farthest-corner at 3.2% 49.6%, rgba(161,10,144,0.72) 0%,  rgba(80,12,139,0.87) 83.6%);')
        }else if(getThemeName().includes('dark4')){
            $('#save_data_rec .box').attr('style', 'background: #00000069;')
        }else {
            $('#save_data_rec [style="background: #f5f5f5"]').attr('style', 'background: #151515')
        }
    }
}

/**
 * On click
 */
function onClickJsonMenu(){
    if($(this).parent().hasClass('active_select')){
        $('.box').removeClass('active_select');
        $('#box_fixed_active_text').html('Result').attr('active-json-id', '')
        $('#box_fixed_active_date').html('Click on menu above to show')

        if($('#right_part .btn_2table2 i').hasClass('list')){
            $('#table-container2').empty().append(tableString.noData())
        }
        saveBoxResult.setValue('');
    }else{
        const txt = decodeURIComponent($(this).attr('data-val'))
        const json = JSON.parse(txt)
        const str = jsonFormat(JSON.stringify(json.data));
        saveBoxResult.setValue(str);
        
        $('.box').removeClass('active_select');
        $(this).parent().addClass('active_select')
    
        $('#box_fixed_active_text').html(json.name).attr('active-json-id', json.id)
        $('#box_fixed_active_date').html(json.date)

        onAppendJsonToTable($('#table-container2'), saveBoxResult)
    }
}


/**
 * On bookmark me
 */
function onBookMarkMe(){
    const $btn = $(this);
    const isFavorite = $btn.hasClass('outline');
    const id = $btn.parents('.box').attr('id');
    if(isFavorite){
        $btn.removeClass('outline');
    }else{
        $btn.addClass('outline');
    }

    //update to local storage
    localData.updateFavorite(id, isFavorite)
    
    //wait
    setTimeout(function(){
        buildJsonMenuList();
    }, 500)
}

/**
 * On change color josn menu
 */
function onChangeColorJsonMenu(){
    const color = $(this).attr('data-color');
    let $parent = $(this).parents('.box')
    const id    = $parent.attr('id');
    $parent.css('background', color)
    localData.changeColor(id, color);
}


/**
 * on rename json menu
 */
function onRenameJsonMenu(){
    onCancel($(this).parents().parent().parent().parent())
    $(this).parent().parent().parent().parent().find('.box').css('margin-right', '5px')
    const parent = $(this).parent().parent().parent();
    $(parent).find('.book_mark_contain').hide()
    $(parent).find('.btn_box p').hide()
    $(parent).find('.icon_mini').hide()
    $(parent).find('.btn_box .input').show()
    $(parent).find('.btn_box .input input').val($(parent).find('.btn_box p').text())
    $(parent).find('.btn_box .input input').focus()
    $(parent).find('.mini_menu').show();
    $(parent).css('margin-right', '30px')    
}


/**
 * on cancel
 * @param {HTML Element} parent 
 */
function onCancel(parent) {
    $(parent).css('margin-right', '5px')
    $(parent).find('.btn_box p').show()
    $(parent).find('.icon_mini').show()
    $(parent).find('.btn_box .input').hide()
    $(parent).find('.mini_menu').hide();
    $(parent).find('.book_mark_contain').show()
}

/**
 * On cancel
 */
function onCancelRenameJson(){
    onCancel($(this).parent().parent())
}

/**
 * On done rename
 */
function onDoceRenameJson(){
    onRename($(this).parent().parent());
}

/**
 * on key press
 * @param {} e 
 */
function onKeyPressRename(e){
    if(e.which == 13) {
        onRename($(this).parent().parent().parent());
    }else if (e.key === 'Escape'){
        onCancel($(this).parent().parent().parent())
    }
}

/**
 * on update name
 * @param {HTML Element} parent 
 * @returns 
 */
function onRename(parent) {
    $input = $(parent).find('.btn_box .input input');
    const id = $(parent).attr('id')
    const newName = $input.val();
    if(newName){
        localData.rename(id, newName);
        $input.parent().removeClass('error')
        buildJsonMenuList()
    }else{
        $input.parent().addClass('error')
        toastr.error(MSG.NO_NAME)
        return;
    }
    onCancel($(parent))
}


/**
 * Delete json menu by id
 */
function onDeleteJsonMenu(){
    let $box = $(this).parents('.box');
    const id = $box.attr('id')
    onConfirm({
        description: MSG.CONFIRM_DELETE_JSON,
        onConfirm: function(){
            localData.deleteById(id)
            buildJsonMenuList()
            toastr.success(MSG.DELETE_SUCCESS)
        }
    })
}

/**
 * ON format
 */
function onFormatRightBox(){
    onFormatOn(saveBoxResult);
}

/**
 * on show table
 */
function onToogleRightBox(){
    onToggleTableAndJson($(this), $('#right_editor_box').parent(), $('#table-container2'), saveBoxResult)
}

function onCopyRightBoxJson(){
    copyToClipboard(saveBoxResult.getValue())
}

// Drage box 
// ================================================================================
/**
 * Make new drag box
 * @returns 
 */
function onMakeNewDrage() {
    const text = saveBoxResult.getValue();
    const name = $('#box_fixed_active_text').html() || 'JSON'
    const date = $('#box_fixed_active_date').html() || 'Json previewer.'

    const newJson = {
        text,
        name,
        date
    }

    if (text) {
        try {
            let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
            width=600,height=300,left=100,top=100`;
            open(`popup.html?_THEME_=${$('#theme').attr('class')}&&_JSON_=${decodeURIComponent(JSON.stringify(newJson))}`, 'test', params);
        } catch (e) {
            return;
        }
    } else {
        toastr.error(MSG.NO_TEXT_TO_SHOW)
        return;
    }
}

/**
 * onCompare 2 editor
 */
function onCompare2Editor(){
    try{
        $('#btn_text_compare_page').click()
        navi.txtCompare(()=>{
            window.onSetCompare(decodeResultEditor.getValue(), saveBoxResult.getValue())
        })
        
    }catch(e){
        
    }
}

/**
 * on input change
 */
function onDisableBtnComparae(){
    if(decodeResultEditor.getValue() && saveBoxResult.getValue()){
        $('#btn_compare_json').removeClass('disabled')
    }else{
        $('#btn_compare_json').addClass('disabled')
    }
}

/**
 * On Save json to local storage
 */
function saveJsonOnLocal() {
    let text = decodeResultEditor.getValue();
    if(text){
        text = getObjectStr(text)
        if(isJson(text)){
            localData.save(text)
            buildJsonMenuList()
            toastr.success(MSG.SAVE);
        }else{
            toastr.error(MSG.NOT_JSON)
        }
    }else{
        toastr.error(MSG.NO_DATA)
    }
}


/**
 * On clear data
 */
function onClearAllJsonData(){
    const oldData = localData.findAll();
    if(oldData.length > 0){
        onConfirm({
            description: MSG.CONFIRM_CLEAR_JSON_DATA,
            onConfirm: function(){
                localData.deleteAll();
                buildJsonMenuList()
                toastr.success(MSG.CLEAR_JSON_DATA_SUCCESS)
                $('#box_fixed_active_text').html('Result').attr('active-json-id', '')
                $('#box_fixed_active_date').html('Click on menu above to show')
            }
        })
    }else{
        toastr.error(MSG.NO_JSON_DATA_TO_CLEAR)
    }
}


//----------------------------------- Data Management --------------------------------
//object
const localData = {
    findAll: getAllLocalJson,
    findById: getJsonLocalById,
    save: addNewJsonToLocal,
    update: updateJsonToLocal,
    deleteById: deleteJsonFromLocal,
    deleteAll: deleteAllJsonFromLocal,
    updateFavorite: updateFavoriteLocal,
    rename: updateNameLocal,
    changeColor: updateColorLocal
}

/**
 * Get all local json
 * @returns Array
 */
function getAllLocalJson(){
    const text = getJsonLocalStorage();
    if(text){
        return JSON.parse(text);
    }
    return []
}

/**
 * getJsonById
 * @param {String} id 
 * @returns 
 */
function getJsonLocalById(id){
    const text = getJsonLocalStorage();
    if(text){
        const json = JSON.parse(text);
        return json.find(v => v.id === id)
    }
}

/**
 * On Add new json object to local
 * @param {JSON} newJson 
 */
function addNewJsonToLocal(text){
    let oldData = getJsonLocalStorage();
    
    let newSaveName = 'Save 1';

    if(oldData){
        const list = JSON.parse(oldData).flatMap(v=> v.name)
        newSaveName =  'Save '+ getNewName(list)
    }

    //new object
    const newJson = {
        id: 'json_' + getRandId(),
        name: newSaveName,
        date: moment().format('YYYY-MM-DD | hh:mm:ss a'),
        data: JSON.parse(text),
        color: jsonMenuDefaultColor,
        isFavorite: false
    };

    
    if (oldData) {
        oldData = JSON.parse(oldData)
        oldData.push(newJson)
        setJsonLocalStorage(oldData)
    } else {
        const newList = [];
        newList.push(newJson);
        setJsonLocalStorage(newList)
    }
}

/**
 * on update
 * @param {JSON} json 
 */
function updateJsonToLocal(json){
    const listOld = getAllLocalJson()
    const listNew = listOld.map(item => item.id === json.id ? json : item);
    setJsonLocalStorage(listNew)
}

/**
 * On update favorite
 * @param {String} id 
 * @param {boolean} isFavorite 
 */
function updateFavoriteLocal(id, isFavorite){
    const data = getAllLocalJson()
    data.map(v=>{
        if(v.id === id){
            v.isFavorite = isFavorite
        }
        return v;
    })
    setJsonLocalStorage(data)
}

/**
 * Rename update name
 * @param {String} id 
 * @param {String} newName 
 */
function updateNameLocal(id, newName){
    const data = getAllLocalJson()
    data.map(v=>{
        if(v.id === id){
            v.name = newName
        }
        return v;
    })
    setJsonLocalStorage(data)
}

/**
 * Update color
 * @param {String} id 
 * @param {String} newColor 
 */
function updateColorLocal(id, newColor){
    const data = getAllLocalJson()
    data.map(v=>{
        if(v.id === id){
            v.color = newColor
        }
        return v;
    })
    setJsonLocalStorage(data)
}


/**
 * On delete
 * @param {String} id 
 */
function deleteJsonFromLocal(id){
    const listOld = getAllLocalJson()
    const listNew = listOld.filter(item => item.id!== id);
    setJsonLocalStorage(listNew)
}

/**
 * Clear all data
 */
function deleteAllJsonFromLocal(){
    localStorage.removeItem(LOCAL_SESSION_JSON_DATA);
}

//----------------------------------- Local Storage --------------------------------
function getJsonLocalStorage(){
    return localStorage.getItem(LOCAL_SESSION_JSON_DATA);
}

function setJsonLocalStorage(json){
    localStorage.setItem(LOCAL_SESSION_JSON_DATA, JSON.stringify(json));
}