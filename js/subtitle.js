//-------------------------------------------------------------
// Variable
//-------------------------------------------------------------
let playCurrentTime;


//-------------------------------------------------------------
// Events
//-------------------------------------------------------------

$('#btn_play').click(function () {
    onPlay()    
});

$('#audioPlayer, #videoPlayer').on('timeupdate', function () {
    var currentTime = this.currentTime;
    var hours = Math.floor(currentTime / 3600);
    var minutes = Math.floor((currentTime % 3600) / 60);
    var seconds = Math.floor(currentTime % 60);

    // Format the time as 00:00:00
    playCurrentTime = (hours < 10 ? '0' + hours : hours) + ':' +
        (minutes < 10 ? '0' + minutes : minutes) + ':' +
        (seconds < 10 ? '0' + seconds : seconds);
})

//expand height
$('#lyric').on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight + 5) + 'px';
});
$('#timer').on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight + 5) + 'px';
    // Allow only numbers, colons, and new line characters
    this.value = this.value.replace(/[^\d:\n]/g, '');
});

$("#box_file").click(function () {
    $(this).parent().find("#file_up").click();
});


$('#file_up').on('change', function (e) {
    if ($('#file_up')[0].files.length > 0) {
        var name = e.target.files[0].name;
        $('#box_file input').val(name);
        if (e.target.files.length > 0) {
            $('#btn_play').removeAttr('disabled').addClass('blue')
        } else {
            $('#btn_play').attr('disabled', 'disabled').removeClass('blue')
        }
    } else {
        $('#btn_play').attr('disabled', 'disabled').removeClass('blue')
        $('#box_file input').val('');
    }
});

$('#btn_pin').click(function () {
    if (playCurrentTime) {
        var value = $('#timer').val() + playCurrentTime + '\n'
        $('#timer').val(value);
    }
    var timer = document.getElementById('timer')
    timer.style.height = (timer.scrollHeight + 3) + 'px';
})


$('#btn_clear').click(function () {
    $('#btn_play').attr('disabled', 'disabled').removeClass('blue');
    $('#audioPlayer, #videoPlayer').stop().hide();
    $('#title_l').text('');
    $('#btn_pin').hide();
})

$('#btn_minus').click(function(){
    minusOrPlush(true)
})
$('#btn_plus').click(function(){
    minusOrPlush()
})

$('#btn_save').click(function () {
    onSaveSub()
})


var $textarea1 = $('#timer');
var $textarea2 = $('#lyric');

$textarea1.on('scroll', function () {
    $textarea2.scrollTop($textarea1.scrollTop());
});

$textarea2.on('scroll', function () {
    $textarea1.scrollTop($textarea2.scrollTop());
});

//-------------------------------------------------------------
// Functions
//-------------------------------------------------------------
function onPlay(){
    if ($('#file_up')[0].files.length > 0) {
        var file = $('#file_up')[0].files[0];
        var link = $('#mediaLink').val();
        var mediaSrc = file ? URL.createObjectURL(file) : link;

        if (file && file.type.startsWith('audio')) {
            $('#audioPlayer').show().attr('src', mediaSrc).get(0).play();
            $('#videoPlayer').hide();
            $('#md_type').val('lrc');
        } else if (file && file.type.startsWith('video')) {
            $('#videoPlayer').show().attr('src', mediaSrc).get(0).play();
            $('#audioPlayer').hide();
            $('#md_type').val('srt');
        } else if (link) {
            if (link.match(/\.(mp4|webm|ogg)$/i)) {
                $('#videoPlayer').show().attr('src', mediaSrc).get(0).play();
                $('#audioPlayer').hide();
            } else if (link.match(/\.(mp3|wav|ogg)$/i)) {
                $('#audioPlayer').show().attr('src', mediaSrc).get(0).play();
                $('#videoPlayer').hide();
            }
        }
        var onlyName = file.name.split('.').slice(0, -1).join('.');
        $('#title_l').text(onlyName);
        $('#btn_pin').show()
        $('.ui.dropdown').dropdown();
    }
}

function minusOrPlush(isMinus){
    var timer = $('#timer').val()
    if(timer){
        var last = timer.split('\n').map(e=>{
            if(e){
                if(isMinus){
                    e = moment(e, 'hh:mm:ss').subtract(1,'seconds').format('HH:mm:ss')
                }else{
                    e = moment(e, 'hh:mm:ss').add(1,'seconds').format('HH:mm:ss')
                }
            }
            return e
        })
        $('#timer').val(last.join('\n'))
    }
}

function createFile(data){
    var blob = new Blob([data.text], { type: 'text/plain;charset=utf-8' });
    var downloadUrl = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = downloadUrl;
    a.download = data.title + '.' + data.type;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
}

function onSaveSub(){
    var title = $('#title_l').text();
                var timerList = $('#timer').val().split('\n');
                var lyricList = $('#lyric').val().split('\n');
                var type = $('#md_type').dropdown('get value');
                if(!title){alert('Please upload file and click play.')}
                else if($('#timer').val() &&  $('#lyric').val()){
                    if(type=="lrc"){
                        var newList = timerList.map((e, i)=>{
                            var ly = '';
                            if(lyricList[i] != undefined){
                                ly = lyricList[i]
                            }
                            if(e){
                                e = `[${e.substring(3)}.00]  ` + ly
                            }
                            return e
                        })
    
                        var data = {
                            title: title,
                            text: newList.join('\n'),
                            type: type
                        }
                        createFile(data)
                    }else{
                        alert('In development.')
                    }
                }else{
                    alert('Please input timer and lyric')
                }
}
