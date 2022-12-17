function isNull(str) {
    if(str === undefined || str === '' || str === null || str === []){
        return true
    }else
        return false;
}

function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}


function decode() {
    try{
        var urlStr = $('#url_text').val()
        var str = JSON.stringify(JSON.parse(decodeURIComponent(urlStr)), undefined, 4);
        $('#url_result').html(syntaxHighlight((str)))
    }catch(e){
       if($('#url_text').val() != ''){
            alert(e)
            console.log(e)
       }else{
        $('#url_result').empty()
       }
        
    }
 
}

function save() {
    $('.save1 pre').html(syntaxHighlight( $('#url_result').text()))
}

function checkLiveMode(){
    var live = localStorage.getItem('kosign_live_mode');
    if(live=='true'){
        $('#url_text').on('input',function(){
            decode();
        })
        $('#live_mode').prop('checked', true);
    }else{
        $('#live_mode').prop('checked', false);
        $('#url_text').off()
    }
    
   
}

function copy(str) {
    $('#tem_input').val(JSON.stringify(JSON.parse(str)));
    var copyText = document.getElementById('tem_input');
    copyText.select();
   // copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value);
}


function formatJson(id) {
    var obj = $(id).text()
    if(!isNull(obj)){
        try {
            var str = JSON.stringify(JSON.parse(obj), undefined, 4);
            $(id).html(syntaxHighlight((str)))
        } catch (error) {
            
        }
    }
}


function loadData() {
    try {
        var oldData = localStorage.getItem('kosign_save_data')
        if(!isNull(oldData)){
            oldData = JSON.parse(oldData)
            oldData.sort(function(a,b){
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return a.name > b.name ? -1 : 1;
              });

            var html = '';
            $.each(oldData, function(i, v){
               
                html += `<div class="box">
                         <button class="circular ui icon button mini btn_box_close">
                            <i class="close icon"></i>
                         </button>
                            <div class="btn_box" data-val="${encodeURIComponent(JSON.stringify(v.data))}"> <p>${v.name}</p>
                            <small>${v.date}</small></div>
                    </div>`
               
            })

            $('#save_data_rec').empty().append(html);
        }else{
            $('#save_data_rec').empty().append('<div style="padding: 30px;border: 1px solid gainsboro; border-radius: 10px;"><h4 style="color: rgb(146, 146, 146);">No Data</h4></div>');
        }
    } catch (error) {
        
    }
}


function onRemoveData(index){
    try {
        var oldData = localStorage.getItem('kosign_save_data')
        if(!isNull(oldData)){
            oldData = JSON.parse(oldData)
            oldData.sort(function(a,b){
                //return new moment(b.date.replace('|', '')) - new moment(a.date.replace('|', ''));
                return a.name > b.name ? -1 : 1;
            });
            oldData.remove(index)
            console.log(oldData)
            localStorage.setItem('kosign_save_data', JSON.stringify(oldData))

            loadData()
        }
    } catch (error) {
        
    }
}