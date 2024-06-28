//======================================================================================================================
// All functions

let excelData = [];
let myWorkbook;

function setYearToDropdown() {
    var year = new Date().getFullYear()+5;
    for (var i = year; i >= 2017; i--) {
        $('#year_select').append('<option value="' + i + '">' + i + '</option>');
    }
}
function defaultEmpty(str){
    if(!str) return '';
    return str
}

function buildSelectSheet(data){
    let html = "";
    $.each(data, function(key, value){
        html += "<option value='" + value + "'>" + value + "</option>";
    })
    $("#sheet_select").empty().append(html);
}

function buildTableWithJsonData(data){
    let html = "<table class='ui celled table small compact striped'>";
    html += "<tr>";
    $.each(data[0], function(key, value){
        key = key==="__EMPTY"?"":key
        html += "<th>" + key + "</th>";
    })
    html += "</tr>";
    $.each(data, function(key, value){
        html += "<tr>";
        html += "<td>" + defaultEmpty(value[Object.keys(data[0])[0]]) + "</td>";
        html += "<td>" + value['__EMPTY'] + "</td>";
        html += "</tr>";
    })
    html += "</table>";
    return html;
}

function isValIsDate(val) {
    const reg = /[0-9][0-9]월 [0-9][0-9]일/;
    return reg.test(val)
}
function isValidValue(val) {
    const regex = /^[0-9]+\./gm;
    return regex.test(val)
}

function jsonToSql(arr) {
    let mainLs = [];
    let date = '';
    let year = $('#year_select').val();
    const tableName = $('#table_name').val()
    $.each(arr, function (i, v) {

        if (Object.keys(v).length > 1) {
            const firstKey = Object.keys(arr[0])[0];
            const secondKey = '__EMPTY';
            if (isValIsDate(v[firstKey])) {
                if(!isNull(v[secondKey])  && isValidValue(v[secondKey])){
                    const firstLeter = v[secondKey][0];
                    const loopDate = year + v[firstKey].replace('월', '').replace('일', '').replace(' ', '');
                    date = loopDate;
                    const sql = `insert into ${tableName}(year, dt, srno, cntn) values('${year}','${date}','${firstLeter}','${v[secondKey]}');`;
                    mainLs.push(sql);
                }
            }

        }else {
            if(!isNull(v['__EMPTY'])  && isValidValue(v['__EMPTY'])){
                const firstLeter = v['__EMPTY'][0];
                const sql = `insert into ${tableName}(year, dt, srno, cntn) values('${year}','${date}','${firstLeter}','${v['__EMPTY']}');`;
                mainLs.push(sql);
            };
        }
    })

    const counts = {};
    mainLs.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
    const totalCounts = Object.values(counts);
    const arr5 = totalCounts;
    const sum = arr5.filter(item => item > 1).reduce((acc, item) => acc + item, 0);
    if(sum > 0){
        $('#duplicate_msg').empty().append(`Duplicate count: ${sum}`)
    }else
        $('#duplicate_msg').empty().append(``)

    $('#total_row').empty().append(`Total row: ${mainLs.length}`)
    //remove duplicate
    // let findDuplicates = mainLs => mainLs.filter((item, index) => mainLs.indexOf(item) !== index)
    // mainLs = [...new Set(findDuplicates(mainLs))];

    return mainLs.join('\n');
}

function readExcel(){
    if(!isNull(myWorkbook)){
        let first_sheet_name = $("#sheet_select").val();
        let worksheet = myWorkbook.Sheets[first_sheet_name];
        excelData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false
        });
        $("#cal_table").empty().append(buildTableWithJsonData(excelData));
        $("#result_sql").val(jsonToSql(excelData));
    }
}

function onChangeSheet(){
    readExcel();
    $('#year_select').dropdown('set selected', Object.keys(excelData[0])[0].slice(0, 4));
    readExcel();
}

//======================================================================================================================
// All events
setYearToDropdown();

$('#excel_file').on('change', function (e) {
    const reader = new FileReader();
    reader.onload = function() {
        let arrayBuffer = this.result,
            array = new Uint8Array(arrayBuffer),
            binaryString = String.fromCharCode.apply(null, array);

        /* Call XLSX */
        myWorkbook = XLSX.read(binaryString, {
            type: "binary"
        });
        let worksheet = myWorkbook.Sheets[myWorkbook.SheetNames[0]];
        excelData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false
        });
        $('#year_select').dropdown('set selected', Object.keys(excelData[0])[0].slice(0, 4));
        buildSelectSheet(myWorkbook.SheetNames);
        readExcel();
        // oReq.send();
    }
    reader.readAsArrayBuffer(this.files[0]);

})
