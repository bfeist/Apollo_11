var missionDurationSeconds = 784086;
var countdownSeconds = 74706;
var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var peaksInstance;

$( document ).ready(function() {
    console.log( "ready!" );

    (function(Peaks) {
        var options = {
            container: document.getElementById('hr1-waveform-visualiser-container'),
            mediaElement: document.querySelector('#hr1-audio-element'),
            dataUri: {
                arraybuffer: '/mp3/defluttered_A11_T870_HR2L_CH12_16.dat'
                // arraybuffer: 'https://droplet2static.nyc3.digitaloceanspaces.com/defluttered_A11_T870_HR2L_CH12_16.dat'
            },
            zoomLevels: [512, 1024, 2048, 4096],
            keyboard: true,
            pointMarkerColor: '#006eb0',
            showPlayheadTime: false,
            height: 100
        };

        peaksInstance = Peaks.init(options);

        peaksInstance.on('peaks.ready', function() {
            console.log('peaks.ready');
            // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
        });
    })(peaks);

    (function(Peaks) {
        var options = {
            container: document.getElementById('hr2-waveform-visualiser-container'),
            mediaElement: document.querySelector('#hr2-audio-element'),
            dataUri: {
                arraybuffer: '/mp3/defluttered_A11_T870_HR2L_CH12_16.dat'
                // arraybuffer: 'https://droplet2static.nyc3.digitaloceanspaces.com/defluttered_A11_T870_HR2L_CH12_16.dat'
            },
            zoomLevels: [512, 1024, 2048, 4096],
            keyboard: true,
            pointMarkerColor: '#006eb0',
            showPlayheadTime: false,
            height: 100
        };

        peaksInstance = Peaks.init(options);

        peaksInstance.on('peaks.ready', function() {
            console.log('peaks.ready');
            // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
        });
    })(peaks);


    var audiography = {
        audioElement: document.querySelector('#hr1-audio-element'),
        currentSegmentToAdd: '',
        playAudio: function(){
            if(audiography.audioElement.paused){
                audiography.audioElement.play();
            }
        },
        pauseAudio: function(){
            if(!audiography.audioElement.paused){
                audiography.audioElement.pause();
            }
        },
        seekAudioForward: function(){
            console.log('seekAudioForward');

            console.log(audiography.audioElement.duration);
            audiography.audioElement.currentTime = (audiography.audioElement.currentTime + (audiography.audioElement.duration / 10));
            console.log(audiography.audioElement.currentTime);
        },
        seekAudioBackward: function(){
            audiography.audioElement.currentTime = (audiography.audioElement.currentTime - (audiography.audioElement.duration / 10));
        }
    };

    //hook up custom audio controls to UI
    // document.querySelector('#zoom-out-button').addEventListener('click', p.zoom.zoomOut);
    // document.querySelector('#zoom-in-button').addEventListener('click', p.zoom.zoomIn);
    document.querySelector('#seek-forward-button').addEventListener('click', audiography.seekAudioForward);
    document.querySelector('#seek-backward-button').addEventListener('click', audiography.seekAudioBackward);
    document.querySelector('#play-button').addEventListener('click', audiography.playAudio);
    document.querySelector('#pause-button').addEventListener('click', audiography.pauseAudio);

    var tapeButtons = document.querySelectorAll('.hr1-tape-button, .hr2-tape-button');
    for(var i=0; i < tapeButtons.length; i++){
        tapeButtons[i].addEventListener('click', buttonClick_selectTape);
    }

    var channelButtons = document.querySelectorAll('.hr1-channel-button, .hr2-channel-button');
    for(var i=0; i < channelButtons.length; i++){
        channelButtons[i].addEventListener('click', buttonClick_selectChannel);
    }

    $.when(ajaxGetTapeRangeData()).done(function(){
        console.log("APPREADY: Ajax loaded");
        mainApplication();
    });
});

function mainApplication() {
    var slider = document.getElementById("myRange");
    var missionTimeDisplay = document.getElementById("missionTimeDisplay");
    var HR1Display = document.getElementById("HR1Display");
    var HR2Display = document.getElementById("HR2Display");

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        var sliderMissionSeconds = (((this.value - 1) * missionDurationSeconds) / 99) - countdownSeconds;
        missionTimeDisplay.innerHTML = secondsToTimeStr(sliderMissionSeconds);

        var HR1TapeData = getTapeByGETseconds(sliderMissionSeconds, "HR1");
        var HR2TapeData = getTapeByGETseconds(sliderMissionSeconds, "HR2");

        if (HR1TapeData.length !== 0) {
            HR1Display.innerHTML = HR1TapeData[0] + ": " + secondsToTimeStr(sliderMissionSeconds - timeStrToSeconds(HR1TapeData[2]));
        }
        if (HR2TapeData.length !== 0) {
            HR2Display.innerHTML = HR2TapeData[0] + ": " + secondsToTimeStr(sliderMissionSeconds - timeStrToSeconds(HR2TapeData[2]));
        }
    };

    slider.onmouseup = function() {
        console.log("range changed");
        var sliderMissionSeconds = (((this.value - 1) * missionDurationSeconds) / 99) - countdownSeconds;

        var HR1TapeData = getTapeByGETseconds(sliderMissionSeconds, "HR1");
        var HR2TapeData = getTapeByGETseconds(sliderMissionSeconds, "HR2");

        if (HR1TapeData.length !== 0) {
            $("button:contains('" + HR1TapeData[0] + "')")[0].click();
            peaksInstance.player.seek(sliderMissionSeconds - timeStrToSeconds(HR1TapeData[2]));
        }
        if (HR2TapeData.length !== 0) {
            $("button:contains('" + HR2TapeData[0] + "')")[0].click();
        }
    }
}

function buttonClick_selectTape() {
    if (this.classList.contains("hr1-tape-button")) {
        var hr_type = "HR1";
    } else {
        hr_type = "HR2";
    }
    console.log("select-tape-button clicked: " + hr_type + ": " + $(this).text());
    makeOnlySelectedButtonActive(this);
}

function buttonClick_selectChannel() {
    if (this.classList.contains("hr1-channel-button")) {
        var hr_type = "HR1";
    } else {
        hr_type = "HR2";
    }
    console.log("select-channel-button clicked: " + hr_type + ": " + $(this).text());
    makeOnlySelectedButtonActive(this);
}

function makeOnlySelectedButtonActive(context) {
    $(context).siblings().not(context).removeClass('active');
}

function getTapeByGETseconds(seconds, tapeType) {
    var rec = [];
    var tapeRanges = (tapeType === "HR1") ? gTapeRangesHR1 : gTapeRangesHR2;
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