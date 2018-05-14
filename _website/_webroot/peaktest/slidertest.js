var missionDurationSeconds = 784086;
var countdownSeconds = 74706;
var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];

$( document ).ready(function() {
    console.log( "ready!" );

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