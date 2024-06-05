//-------------------------------------------------------------
// Variable
//-------------------------------------------------------------
let playCurrentTime;
let youTubePlay;
let isYouTubePlay = false;
let audioController = document.getElementById('audioPlayer')
let videoController = document.getElementById('videoPlayer')
const players = {
    audio: {
        controller: audioController,
        play: function (src) {
            if(src){
                this.controller.setAttribute('src', src)
            }
            players.video.hide()
            $(this.controller).show();
            this.controller.play()
        },
        pause: function () {
            this.controller.pause();
        },
        hide: function () {
            $(this.controller).hide()
            this.pause()
            players.label.hide()
        }
    },
    video: {
        controller: videoController,
        play: function (src) {
            if(src){
                this.controller.setAttribute('src', src)
            }
            players.audio.hide();
            $(this.controller).show();
            this.controller.play()
        },
        pause: function () {
            this.controller.pause();
        },
        hide: function () {
            $(this.controller).hide()
            this.pause()
            players.label.hide()
        }
    },
    youtube: {
        getTime: function () {
            var curr = youTubePlay.getCurrentTime()
            return getCurrentTiming(curr)
        },
        hide: function () {
            $('#title_l_u').val('').hide()
            $('#you_block').empty().append('<div id="youtube_ifr"></div>');
        },
        reset: function(){
            $('#title_l_u').val('').hide()
            $('#you_block').empty().append('<div id="youtube_ifr"></div>');
            $('#youtubeUrl').val('')
            $('#btn_play_you').attr('disabled', 'disabled').removeClass('blue');
        }
    },
    label: {
        hide: function(){
            $('#title_l').text('').hide()
            $('#btn_pin').hide();
        }
    },
    reset: function(){
        this.audio.hide()
        this.video.hide()
        this.youtube.reset()
        this.label.hide()
    }
}


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
    resizeTex()
});
$('#timer').on('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight + 5) + 'px';
    // Allow only numbers, colons, and new line characters
    this.value = this.value.replace(/[^\d:\n~,]/g, '');
    resizeTex()
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
    players.reset()
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

$('#md_type input').on('change', function(){
    if($(this).val()=='lrc'){
        // $textarea1.parent().removeClass().addClass('three wide field')
        $textarea1.parent().css('width', '150px')
    }else{
        // $textarea1.parent().removeClass().addClass('four wide field')
        $textarea1.parent().css('width', '270px')
    }
})

$(document).keydown(function(event) {
    if (event.key === "Escape") { // Check if the key is the Escape key
        onPin()
    }
});

function resizeTex(){
    if($textarea1.height() > $textarea2.height()){
        $textarea2.css('height', ($textarea1.height()+24)+'px');
    }else{
        $textarea1.css('height', ($textarea2.height()+24)+'px');
    }
    $textarea3.css('height', ($textarea1.height()+24)+'px')
}

var $textarea1 = $('#timer');
var $textarea2 = $('#lyric');
var $textarea3 = $('#grid_line')

$textarea1.on('scroll', function () {
    $textarea2.scrollTop($textarea1.scrollTop());
    $textarea3.scrollTop($textarea1.scrollTop())
});

$textarea2.on('scroll', function () {
    $textarea1.scrollTop($textarea2.scrollTop());
    $textarea3.scrollTop($textarea2.scrollTop())
});

$textarea1.bind('mouseup mousemove',function(){
    $textarea2.css('height', ($textarea1.height()+24)+'px');
    $textarea3.css('height', ($textarea1.height()+24)+'px');
});

$textarea2.bind('mouseup mousemove',function(){
    $textarea1.css('height', ($textarea2.height()+24)+'px');
    $textarea3.css('height', ($textarea2.height()+24)+'px');
});


 // Load the IFrame Player API code asynchronously.
 var tag = document.createElement('script');
 tag.src = "https://www.youtube.com/iframe_api";
 var firstScriptTag = document.getElementsByTagName('script')[0];
 firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


for (let i = 0; i < 1000; i++) {
    $('#grid_line').append('_________________________________')
}


//-------------------------------------------------------------
// Functions
//-------------------------------------------------------------
function onPlay(){
    if ($('#file_up')[0].files.length > 0) {
        var file = $('#file_up')[0].files[0];
        var mediaSrc = file ? URL.createObjectURL(file) : '';
        
        players.youtube.hide();

        if (file && file.type.startsWith('audio')) {
            players.audio.play(mediaSrc);
            players.video.hide();
            $('#md_type').val('lrc');
        } else if (file && file.type.startsWith('video')) {
            players.video.play(mediaSrc);
            players.audio.hide();
            $('#md_type').val('srt');
        }
        
        var onlyName = file.name.split('.').slice(0, -1).join('.');
        $('#title_l').text(onlyName).show();
        $('#btn_pin').show()
        $('.ui.dropdown').dropdown();
        
        isYouTubePlay = false;
    }
}

function onPin(){
    var currentTiming = playCurrentTime;
    if(isYouTubePlay){
        currentTiming = players.youtube.getTime()
    }
    if (currentTiming) {
        var value;
        if($('#md_type').dropdown('get value')=='lrc'){
            value = $('#timer').val() + currentTiming + '\n'
        }else{

        }
        $('#timer').val(value);
        var timer = document.getElementById('timer')
        timer.style.height = (timer.scrollHeight + 3) + 'px';
        resizeTex()
    }
}

function youtubePlay(){
    var url = $('#youtubeUrl').val();
    var videoId = getYouTubeVideoId(url);
    if (videoId) {
        players.youtube.hide()
        //var embedUrl = 'https://www.youtube.com/embed/' + videoId;
        youTubePlay = new YT.Player('youtube_ifr', {
            height: '350px',
            width: '100%',
            videoId: videoId, // Replace YOUR_VIDEO_ID with the actual video ID
            events: {
                'onReady': ()=>{
                    $('#title_l_u').text(youTubePlay.videoTitle).show();
                },
                'onStateChange': ()=>{}
            }
        });
        //$('.youtube_ifr').eq(0).html('<iframe width="560" height="315" src="' + embedUrl + '" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>');
        
        players.audio.hide();
        players.video.hide();
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
                    e = moment(e, 'hh:mm:ss,SSS').subtract(1,'seconds').format('HH:mm:ss,SSS')
                }else{
                    e = moment(e, 'hh:mm:ss,SSS').add(1,'seconds').format('HH:mm:ss,SSS')
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
                    e = `[${e.substring(3)}]  ` + ly
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


function getCurrentTiming(inputValue) {
    var hours = Math.floor(inputValue / 3600);
    var minutes = Math.floor((inputValue % 3600) / 60);
    var seconds = Math.floor(inputValue % 60);
    var milliseconds = Math.round((inputValue - Math.floor(inputValue)) * 1000);

    // Format the time using Moment.js
    return moment().hours(hours).minutes(minutes).seconds(seconds).milliseconds(milliseconds).format('HH:mm:ss,SSS');
}


// Example usage with jQuery:
$(document).ready(function() {
    let formattedTime = formatTime(16000); // Replace with your milliseconds
    console.log(formattedTime); // Outputs: 00:00:16,000
});

function onTexAreaScroll (){
    var areaTop = $textarea1.scrollTop()
    if($textarea1.scrollTop() > $textarea2.scrollTop()){
        areaTop = $textarea2.scrollTop()
    }
    $textarea3.scrollTop(areaTop)
}