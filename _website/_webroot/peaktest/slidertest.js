var missionDurationSeconds = 784086;
var countdownSeconds = 74706;
var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var hr1PeaksInstance;
var hr2PeaksInstance;
var hr1ActiveTape = "T869";
var hr2ActiveTape = "T870";
var hr1ActiveChannel = "2";
var hr2ActiveChannel = "2";

$( document ).ready(function() {
    console.log( "ready!" );

    $('#main-body [data-toggle="tooltip"]').tooltip({
        animated: 'fade',
        placement: 'bottom',
        html: true
    });

    var options = {
        container: document.getElementById('hr1-waveform-visualiser-container'),
        mediaElement: document.querySelector('#hr1-audio-element'),
        dataUri: {
            arraybuffer: '/mp3/T869_defluttered_mp3_16/audiowaveform/defluttered_A11_T869_HR1U_CH2.dat'
            // arraybuffer: 'https://droplet2static.nyc3.digitaloceanspaces.com/defluttered_A11_T870_HR2L_CH12_16.dat'
        },
        zoomLevels: [512, 1024, 2048, 4096],
        keyboard: true,
        pointMarkerColor: '#006eb0',
        showPlayheadTime: false,
        height: 100
    };

    hr1PeaksInstance = peaks.init(options);

    hr1PeaksInstance.on('peaks.ready', function() {
        console.log('hr1 peaks.ready');
        // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
    });


    var options = {
        container: document.getElementById('hr2-waveform-visualiser-container'),
        mediaElement: document.querySelector('#hr2-audio-element'),
        dataUri: {
            arraybuffer: '/mp3/T870_defluttered_mp3_16/audiowaveform/defluttered_A11_T870_HR2L_CH2.dat'
            // arraybuffer: 'https://droplet2static.nyc3.digitaloceanspaces.com/defluttered_A11_T870_HR2L_CH12_16.dat'
        },
        zoomLevels: [512, 1024, 2048, 4096],
        keyboard: true,
        pointMarkerColor: '#006eb0',
        showPlayheadTime: false,
        height: 100
    };

    hr2PeaksInstance = peaks.init(options);

    hr2PeaksInstance.on('peaks.ready', function() {
        console.log('hr2 peaks.ready');
        // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
    });

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
            hr1PeaksInstance.player.seek(sliderMissionSeconds - timeStrToSeconds(HR1TapeData[2]));
            hr1PeaksInstance.player.play();
        }
        if (HR2TapeData.length !== 0) {
            $("button:contains('" + HR2TapeData[0] + "')")[0].click();
            hr2PeaksInstance.player.seek(sliderMissionSeconds - timeStrToSeconds(HR2TapeData[2]));
            hr2PeaksInstance.player.play();
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

    if (hr_type === "HR1") {
        hr1ActiveTape = $(this).text();
    } else {
        hr2ActiveTape = $(this).text();
    }

    setTapeAndChannel(hr_type);
}

function buttonClick_selectChannel() {
    if (this.classList.contains("hr1-channel-button")) {
        var hr_type = "HR1";
    } else {
        hr_type = "HR2";
    }
    console.log("select-channel-button clicked: " + hr_type + ": " + $(this).text());
    makeOnlySelectedButtonActive(this);

    if (hr_type === "HR1") {
        hr1ActiveChannel = $(this).text();
    } else {
        hr2ActiveChannel = $(this).text();
    }

    setTapeAndChannel(hr_type);
}

function makeOnlySelectedButtonActive(context) {
    $(context).siblings().not(context).removeClass('active');
}

function setTapeAndChannel(hr_type) {

    var activeTape = (hr_type === "HR1") ? hr1ActiveTape : hr2ActiveTape;
    var activeChannel = (hr_type === "HR1") ? hr1ActiveChannel : hr2ActiveChannel;

    var tapeData = [];
    var tapeRanges = (hr_type === "HR1") ? gTapeRangesHR1 : gTapeRangesHR2;

    for (var index = 0; index < tapeRanges.length; ++index) {
        if (tapeRanges[index][0] === activeTape) {
            tapeData = tapeRanges[index];
            break;
        }
    }

    var filename = "defluttered_A11_" + tapeData[0] + "_" + tapeData[1] + "_CH" + activeChannel;
    var waveformContainer = (hr_type === "HR1") ? "hr1-waveform-visualiser-container" : "hr2-waveform-visualiser-container";
    var audioElementName = (hr_type === "HR1") ? "hr1-audio-element" : "hr2-audio-element";
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

    if (hr_type === "HR1") {
        hr1PeaksInstance.destroy();
        hr1PeaksInstance = peaks.init(options);
        hr1PeaksInstance.on('peaks.ready', function() {
            console.log('hr1 peaks.ready');
            // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
        });
    } else {
        hr2PeaksInstance.destroy();
        hr2PeaksInstance = peaks.init(options);
        hr2PeaksInstance.on('peaks.ready', function() {
            console.log('hr2 peaks.ready');
            // document.getElementsByClassName("overview-container")[0].style.visibility = 'hidden';
        });
    }
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