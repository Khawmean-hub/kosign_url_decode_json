//-------------------------------------------------------------
// Variable
//-------------------------------------------------------------
let playCurrentTime;
let youTubePlay;
let isYouTubePlay = false;


//-------------------------------------------------------------
// Events
//-------------------------------------------------------------

$('#audioPlayer, #videoPlayer').on('timeupdate', function () {
    var currentTime = this.currentTime;
    playCurrentTime = getCurrentTiming(currentTime)
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
    onPin()
})


$('#btn_clear').click(function () {
    $('#btn_play').attr('disabled', 'disabled').removeClass('blue');
    $('#audioPlayer, #videoPlayer').stop().hide();
    $('#title_l').text('');
    $('#btn_pin').hide();
    $('#title_l_u').hide()
    $('#you_block').empty().append('<div id="youtube_ifr"></div>');
    $('#youtubeUrl').val('')
    $('#btn_play_you').attr('disabled', 'disabled').removeClass('blue');
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

$(document).on('input', '#youtubeUrl', function(){
    var url = $('#youtubeUrl').val()
    if(url){
        $('#btn_play_you').removeAttr('disabled').addClass('blue')
    }else{
        $('#btn_play_you').attr('disabled', 'disabled').removeClass('blue')
    }
})

$(document).keydown(function(event) {
    if (event.key === "Escape") { // Check if the key is the Escape key
        onPin()
    }
  });

var $textarea1 = $('#timer');
var $textarea2 = $('#lyric');

$textarea1.on('scroll', function () {
    $textarea2.scrollTop($textarea1.scrollTop());
});

$textarea2.on('scroll', function () {
    $textarea1.scrollTop($textarea2.scrollTop());
});


 // Load the IFrame Player API code asynchronously.
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);




//-------------------------------------------------------------
// Functions
//-------------------------------------------------------------
function onPlay(){
    if ($('#file_up')[0].files.length > 0) {
        var file = $('#file_up')[0].files[0];
        var mediaSrc = file ? URL.createObjectURL(file) : '';
        $('#you_block').empty().append('<div id="youtube_ifr"></div>');
        $('#title_l_u').hide()

        if (file && file.type.startsWith('audio')) {
            $('#audioPlayer').show().attr('src', mediaSrc).get(0).play();
            $('#videoPlayer').hide();
            $('#md_type').val('lrc');
        } else if (file && file.type.startsWith('video')) {
            $('#videoPlayer').show().attr('src', mediaSrc).get(0).play();
            $('#audioPlayer').hide();
            $('#md_type').val('srt');
        }
        if(file){
            var onlyName = file.name.split('.').slice(0, -1).join('.');
            $('#title_l').text(onlyName).show();
            $('#btn_pin').show()
            $('.ui.dropdown').dropdown();
        }
        isYouTubePlay = false;
    }
}

function onPin(){
    var currentTiming = playCurrentTime;
    if(isYouTubePlay){
        currentTiming = getCurrentTiming(youTubePlay.getCurrentTime())
    }
    if (currentTiming) {
        var value = $('#timer').val() + currentTiming + '\n'
        $('#timer').val(value);
        var timer = document.getElementById('timer')
        timer.style.height = (timer.scrollHeight + 3) + 'px';
    }
}

function youtubePlay(){
    var url = $('#youtubeUrl').val();
    var videoId = getYouTubeVideoId(url);
    if (videoId) {
        //var embedUrl = 'https://www.youtube.com/embed/' + videoId;
        youTubePlay = new YT.Player('youtube_ifr', {
            height: '390',
            width: '640',
            videoId: videoId, // Replace YOUR_VIDEO_ID with the actual video ID
            events: {
                'onReady': ()=>{
                    $('#title_l_u').text(youTubePlay.videoTitle).show();
                },
                'onStateChange': ()=>{}
            }
        });
        //$('.youtube_ifr').eq(0).html('<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        $('#audioPlayer, #videoPlayer').stop().hide();
        $('#title_l').hide()
        isYouTubePlay = true;
        $('#btn_pin').show()
    } else {
        alert('Please enter a valid YouTube URL.');
    }
}

function getYouTubeVideoId(url) {
    var videoId = null;
    var regex = /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    var matches = url.match(regex);
    if (matches) {
        videoId = matches[1];
    }
    return videoId;
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

function onPickFile(){
    $("#file_up").click()
}

function onSaveSub(){

    var title = isYouTubePlay ? $('#title_l_u').text() : $('#title_l').text();
    var timerList = $('#timer').val().split('\n');
    var lyricList = $('#lyric').val().split('\n');
    var type = $('#md_type').dropdown('get value');
    if(!title){alert('Please upload file or paste youtube link and click play.')}
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

function openYouTube(){
    window.open('https://www.youtube.com', target="_blank")
}


function getCurrentTiming(currentTime){
    var hours = Math.floor(currentTime / 3600);
    var minutes = Math.floor((currentTime % 3600) / 60);
    var seconds = Math.floor(currentTime % 60);

    // Format the time as 00:00:00
    var tiime = (hours < 10 ? '0' + hours : hours) + ':' +
        (minutes < 10 ? '0' + minutes : minutes) + ':' +
        (seconds < 10 ? '0' + seconds : seconds);
    return tiime;
}