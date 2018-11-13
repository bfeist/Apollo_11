var missionDurationSeconds = 784086;
var countdownSeconds = 74706;
var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var gPeaksInstance;
var gActiveTape = "T867";
var gActiveChannel = "14";
var gCurrGETSeconds = -74706; //start at beginning of countdown

var gInterval = null;

// var mediaURL = "http://dev.apolloinrealtime.org";
var mediaURL = window.location.hostname;

$( document ).ready(function() {
    console.log( "ready!" );

    $('#main-body [data-toggle="tooltip"]').tooltip({
        animated: 'fade',
        placement: 'bottom',
        html: true
    });

    var player = document.querySelector('#audio-element');

    var options = {
        container: document.getElementById('waveform-visualiser-container'),
        mediaElement: player,
        dataUri: {
            arraybuffer: '/mp3/T867_defluttered_mp3_16/audiowaveform/defluttered_A11_T867_HR1L_CH14.dat'
        },
        zoomLevels: [512, 1024, 2048, 4096],
        keyboard: true,
        pointMarkerColor: '#006eb0',
        showPlayheadTime: false,
        height: 100
    };

    gPeaksInstance = peaks.init(options);

    gPeaksInstance.on('peaks.ready', function() {
        console.log('peaks.ready');
        // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
    });

    var tapeButtons = document.querySelectorAll('.btn-tape');
    for(var i=0; i < tapeButtons.length; i++) {
        tapeButtons[i].addEventListener('click', buttonClick_selectTape);
    }

    var channelButtons = document.querySelectorAll('.btn-channel');
    for(i=0; i < channelButtons.length; i++) {
        channelButtons[i].addEventListener('click', buttonClick_selectChannel);
    }

    player.onplay = function() {
        console.log("player play");
        if (gInterval == null) {
            playFromCurrGET();
        }
    };

    player.onpause = function() {
        console.log("player pause");
        clearInterval(gInterval); //clear the slider update playback interval
        gInterval = null;
    };

    $.when(ajaxGetTapeRangeData()).done(function() {
        console.log("APPREADY: Ajax loaded");
        mainApplication();
        playFromCurrGET();
    });
});

function mainApplication() {
    var slider = document.getElementById("myRange");
    var missionTimeDisplay = document.getElementById("missionTimeDisplay");
    var tapeDisplay = document.getElementById("tapeDisplay");


    slider.onmousedown = function() {
        console.log("mousedown");
        clearInterval(gInterval); //clear the slider update playback interval
        gInterval = null;
        gPeaksInstance.player.pause();
    };

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        gCurrGETSeconds = (((this.value - 1) * missionDurationSeconds) / 99) - countdownSeconds;
        missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);

        var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);

        if (tapeData.length !== 0) {
            tapeDisplay.innerHTML = tapeData[0] + " " + tapeData[1] + ": " + secondsToTimeStr(gCurrGETSeconds - timeStrToSeconds(tapeData[2]));
        }
    };

    slider.onmouseup = function() {
        console.log("range changed");
        loadChannelSoundfile();
        playFromCurrGET();
    };
}

function playFromCurrGET() {
    console.log("playFromCurrGET()");
    // var sliderVal = $('#myRange').val();
    // var sliderMissionSeconds = (((sliderVal - 1) * missionDurationSeconds) / 99) - countdownSeconds;

    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);

    if (tapeData.length !== 0) {
        gPeaksInstance.player.seek(gCurrGETSeconds - timeStrToSeconds(tapeData[2]));
        gPeaksInstance.player.play();
    }

    clearInterval(gInterval);
    gInterval = null;
    gInterval = setInterval(function(){
        // console.log("interval firing");
        var missionTimeDisplay = document.getElementById("missionTimeDisplay");
        var tapeDisplay = document.getElementById("tapeDisplay");
        var slider = document.getElementById("myRange");
        var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
        if (tapeData.length !== 0) {
            var currSeconds = gPeaksInstance.player.getCurrentTime();
            gCurrGETSeconds = currSeconds + timeStrToSeconds(tapeData[2]);
            missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);
            tapeDisplay.innerHTML = tapeData[0] + " " + tapeData[1] + " CH" + gActiveChannel + ": " + secondsToTimeStr(gCurrGETSeconds - timeStrToSeconds(tapeData[2]));

            slider.value = (((gCurrGETSeconds + countdownSeconds) * 99) / missionDurationSeconds);
        }
    }, 1000);
}

function loadChannelSoundfile() {
    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
    if (tapeData.length !== 0) {
        gActiveTape = tapeData[0];
        var channel = (gActiveChannel > 30) ? gActiveChannel - 30 : gActiveChannel;

        var filename = "defluttered_A11_" + tapeData[0] + "_" + tapeData[1] + "_CH" + channel;
        // var waveformContainer = (hr_type === "HR1") ? "hr1-waveform-visualiser-container" : "hr2-waveform-visualiser-container";
        var waveformContainer = "waveform-visualiser-container";
        // var audioElementName = (hr_type === "HR1") ? "hr1-audio-element" : "hr2-audio-element";
        var audioElementName = "audio-element";
        var audioElement = document.getElementById(audioElementName);

        audioElement.src = "/mp3/" + tapeData[0] + "_defluttered_mp3_16/" + filename + '.mp3';
        audioElement.load();

        var options = {
            container: document.getElementById(waveformContainer),
            mediaElement: audioElement,
            dataUri: {
                arraybuffer: "/mp3/" + tapeData[0] + "_defluttered_mp3_16/audiowaveform/" + filename + '.dat'
            },
            zoomLevels: [512, 1024, 2048, 4096],
            keyboard: true,
            pointMarkerColor: '#006eb0',
            showPlayheadTime: false,
            height: 100
        };

        gPeaksInstance.destroy();
        gPeaksInstance = peaks.init(options);
        gPeaksInstance.on('peaks.ready', function () {
            console.log('peaks.ready');
            // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
        });
    } else {
        alert("No data for this channel on this tape at this time");
    }
}

function buttonClick_selectChannel() {
    console.log("select-channel-button clicked: " + $(this).text());
    makeOnlySelectedButtonActive(this);

    clearInterval(gInterval); //clear the slider update playback interval
    gPeaksInstance.player.pause();

    gActiveChannel = $(this).text().substr(0, $(this).text().indexOf(' - ')); //get channel number from button label
    loadChannelSoundfile();
    playFromCurrGET();
}

function makeOnlySelectedButtonActive(context) {
    const active = document.querySelector('.active');
    if(active){
        active.classList.remove('active');
    }
    $(context).addClass('active');
}

function getTapeByGETseconds(seconds, channel) {
    var intChannel = parseInt(channel);
    var rec = [];
    var tapeRanges = (intChannel <= 30) ? gTapeRangesHR1 : gTapeRangesHR2;
    for (var index = 0; index < tapeRanges.length; ++index) {
        var startSeconds = timeStrToSeconds(tapeRanges[index][2]);
        var endSeconds = timeStrToSeconds(tapeRanges[index][3]);
        if (seconds > startSeconds && seconds < endSeconds) {
            rec = tapeRanges[index];
            break;
        }
    }
    return rec;
}

//------------ data import

function ajaxGetTapeRangeData() {
    var urlStr = "data/tape_ranges.csv";
    return $.ajax({
        type: "GET",
        url: urlStr,
        dataType: "text",
        success: function(data) {processTapeRangeData(data);}
    });
}

function processTapeRangeData(allText) {
    //console.log("processTapeRangeData");
    var allTextLines = allText.split(/\r\n|\n/);
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split('|');
        var rec = [];
        rec.push(data[0]);
        rec.push(data[1]);
        rec.push(data[2]);
        rec.push(data[3]);
        // console.log(timeStrToSeconds(data[2]));
        if (data[1].includes("HR1")){
            gTapeRangesHR1.push(rec);
        } else{
            gTapeRangesHR2.push(rec);
        }
    }
    gTapeRangesHR1 = gTapeRangesHR1.sort(Comparator);
    gTapeRangesHR2 = gTapeRangesHR2.sort(Comparator);

}

//------------ helpers

function secondsToTimeStr(totalSeconds) {
    var hours = Math.abs(parseInt(totalSeconds / 3600));
    var minutes = Math.abs(parseInt(totalSeconds / 60)) % 60 % 60;
    var seconds = Math.abs(parseInt(totalSeconds)) % 60;
    seconds = Math.floor(seconds);
    var timeStr = padZeros(hours,3) + ":" + padZeros(minutes,2) + ":" + padZeros(seconds,2);
    if (totalSeconds < 0) {
        timeStr = "-" + timeStr.substr(1); //change timeStr to negative, replacing leading zero in hours with "-"
    }
    return timeStr;
}

function timeStrToSeconds(timeStr) {
    var sign = timeStr.substr(0,1);
    if (sign == "-") {
        var signToggle = -1;
        timeStr = timeStr.substr(1);
    } else {
        signToggle = 1;
    }

    var hours = parseInt(timeStr.substr(0,3));
    var minutes = parseInt(timeStr.substr(4,2));
    var seconds = parseInt(timeStr.substr(7,2));

    var totalSeconds = Math.round(signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds));
    return totalSeconds;
}

function padZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

function Comparator(a, b) {
    if (timeStrToSeconds(a[2]) < timeStrToSeconds(b[2])) return -1;
    if (timeStrToSeconds(a[2]) > timeStrToSeconds(b[2])) return 1;
    return 0;
}