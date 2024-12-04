//---------------------------------------------------------------------------------------------------------------------
//  Variables
//---------------------------------------------------------------------------------------------------------------------
let excelData = [];
let myWorkbook;
let calendarEditor;


//---------------------------------------------------------------------------------------------------------------------
//  Events
//---------------------------------------------------------------------------------------------------------------------
function events() {
    $('#txt_input').on('click', function () { $('#excel_file').click() })
    $('#excel_file').on('change', onUploadFile);
    $('#excel_sheet').on('change', onBuildPattern);
    $('#pattern_input').on('input', onBuildPattern);
    $('.btn_copy_result').on('click', onCopyExcelResult);
    $('.btn_copy_json_excel').on('click', onCopyExcelJSON);
    $('.btn_show_calendar_editor:eq(0)').on('click', onClickToShowEditor);
    $('.btn_show_calendar_table:eq(0)').on('click', onClickToShowTable);
}


//---------------------------------------------------------------------------------------------------------------------
//  Functions
//---------------------------------------------------------------------------------------------------------------------
export function init() {
    events();
    makeEditor();
    $('.ui.dropdown').dropdown();
    $('.show_my_popup').popup({html: true, variation: 'wide'});
}

/**
 * Make editor apply codemirror
 */
function makeEditor() {
    if (!calendarEditor) {
        calendarEditor = applyEditorSQL('calendar_excel_editor');
        window.calendarLight = calendarLight;
        window.calendarDark = calendarDark;
    }
}

function calendarLight() {
    if (calendarEditor) {
        calendarEditor.setOption('theme', 'material')
    }
}

function calendarDark() {
    if (calendarEditor) {
        calendarEditor.setOption('theme', 'material-ocean')
    }
}

//build dropdown
function buildSelectSheet(data) {
    let html = "";
    $.each(data, function (key, value) {
        html += "<option value='" + value + "'>" + value + "</option>";
    })
    $("#excel_sheet").empty().append(html).parent().prop('disabled', false).removeClass('disabled');
}


/**
 * On upload file excel
 * @returns 
 */
function onUploadFile() {

    //clear data
    if (this.files.length == 0) {
        $('#txt_input').val('')
        $("#excel_sheet").empty().parent().prop('disabled', true).addClass('disabled');
        $('.btn_show_calendar_table').prop('disabled', true).addClass('disabled');
        return;
    };

    const reader = new FileReader();
    reader.onload = function () {
        let arrayBuffer = this.result,
            array = new Uint8Array(arrayBuffer),
            binaryString = String.fromCharCode.apply(null, array);

        /* Call XLSX */
        myWorkbook = XLSX.read(binaryString, {
            type: "binary"
        });

        //build selec dropdown
        buildSelectSheet(myWorkbook.SheetNames);

        //build with patter
        onBuildPattern();
    }

    reader.readAsArrayBuffer(this.files[0]);

    //set name
    $('#txt_input').val(this.files[0].name)
}


//getJson
function getNewJsonExcel() {
    if (myWorkbook) {
        try{
            let sheetName = $('#excel_sheet').val();
            let sheet = myWorkbook.Sheets[sheetName];
    
            excelData = XLSX.utils.sheet_to_json(sheet, {
                raw: false
            });
    
            return excelJsonToJsonList(excelData);
        }catch(e){
            toastr.error('Not support this file.')
        }
    }
}

//transform json to json
function excelJsonToJsonList(ls) {
    var nList = [];
    var empKey = '__EMPTY';
    var year;
    var dt;
    var holidays = [];

    ls.forEach((v, i) => {

        var keys = Object.keys(v);

        if (v[keys[0]].includes('일자') || v[empKey].includes('내용')) { return; }

        //find holidays
        if (keys.length == 1) {
            var srno = (holidays.length + 1);
            var cntn = v[empKey].trim();

            holidays.push({ srno, cntn });

            //add
            if (i === (ls.length - 1)) { nList.push({ year, dt, holidays }); }
        }

        //find new date
        if (keys.length > 1) {

            //add
            if (year) { nList.push({ year, dt, holidays }); }

            //clear
            holidays = [];

            year = keys[0].trim().substr(0, 4);
            dt = v[keys[0]].replace('월 ', '').replace('월', '').replace('일', '').trim();
            dt = year + dt;

            // first
            var srno = (holidays.length + 1);
            var cntn = v[empKey].trim();
            holidays.push({ srno, cntn });
        }
    })

    return nList;
}

//build pattern from input pattern
function onBuildPattern() {
    var jsonList = getNewJsonExcel();
    var pattern = $('#pattern_input').val().trim();
    if (pattern) {
        var sql = '';
        jsonList.forEach(a => {
            a.holidays.forEach(b => {
                sql += pattern.replace('$year', a.year).replace('$dt', a.dt).replace('$srno', b.srno).replace('$cntn', b.cntn) + '\n';
            })
        })
        calendarEditor.setValue(sql.trim());

        showTable();
    } else {
        toastr.warning('Please input pattern.')
    }
}

//copy excel result to clipboard
function onCopyExcelResult() {
    copyToClipboard(calendarEditor.getValue());
}

//copy excel json to clipboard
function onCopyExcelJSON() {
    var json = getNewJsonExcel()
    if (json) {
        copyToClipboard(JSON.stringify(json));
    } else {
        toastr.warning('Please upload excel file.')
    }
}

//show table
function showTable() {
    var editorTmp = {
        getValue: () => {
            return JSON.stringify(getNewJsonExcel())
        }
    }
    onAppendJsonToTable($('.table_view_excel:eq(0)'), editorTmp)

    var $tabls = $('#calendar_excel .ui.celled.table.small.compact.striped');
    if ($tabls.length > 1) {
        $tabls.eq(0).remove();
    }

    $('.btn_show_calendar_table').prop('disabled', false).removeClass('disabled');
}


function onClickToShowEditor() { 
    $('#calendar_editor').show(); 
    $('#calendar_table').hide(); 
    $('#calendar_excel .btn_color_light').removeClass('active'); 
    $(this).addClass('active'); 
}


function onClickToShowTable() { 
    $('#calendar_editor').hide(); 
    $('#calendar_table').show(); 
    $('#calendar_excel .btn_color_light').removeClass('active'); 
    $(this).addClass('active'); 
}