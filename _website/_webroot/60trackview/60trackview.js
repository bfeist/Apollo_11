var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var gActiveTapeActivityArrayHR1 = [];
var gActiveTapeActivityArrayHR2 = [];

window.onload = function() {
    $.when(ajaxGetTapeRangeData()).done(function() {
        console.log("APPREADY: Ajax loaded");

        var tapeDataHR1 = getTapeByGETseconds(0, 10);
        var noiserangeJSONUrlHR1 = "/mp3/" + tapeDataHR1[0] + "_defluttered_mp3_16/" + tapeDataHR1[0] + "_defluttered_mp3_16noiseranges.json";
        ajaxGetTapeActivityJSONHR1(noiserangeJSONUrlHR1);

        var tapeDataHR2 = getTapeByGETseconds(0, 40);
        var noiserangeJSONUrlHR2 = "/mp3/" + tapeDataHR2[0] + "_defluttered_mp3_16/" + tapeDataHR2[0] + "_defluttered_mp3_16noiseranges.json";
        ajaxGetTapeActivityJSONHR2(noiserangeJSONUrlHR2);

        mainApplication();
    });
};

function mainApplication() {
    // Get a reference to the canvas object
    var canvas = document.getElementById('myCanvas');
    canvas.width = 1000;
    canvas.height = 1000;

    paper.setup(canvas);
    paper.install(window);

    var tempGroup = new paper.Group;
    var channelCount = 0;
    for (var i = 0; i < 480; i = i + 8) {
        channelCount++;
        var endVal = parseInt(Math.random()*1000);
        var channelStartPoint = new paper.Point(0, AddPoint5IfOdd(i));
        var channelEndPoint = new paper.Point(AddPoint5IfOdd(endVal), AddPoint5IfOdd(i));
        var aLine = new paper.Path.Line(channelStartPoint, channelEndPoint);
        // console.log('line :' + channelStartPoint + ' ' + channelEndPoint);
        aLine.strokeColor = 'black';
        if (channelCount % 10 === 0) {
            aLine.strokeColor = 'red';
        }
        aLine.strokeWidth = 4;

        aLine.onMouseEnter = function(event) {
            this.strokeColor = 'blue';
        };

        aLine.onMouseLeave = function(event) {
            this.strokeColor = 'black';
        };
        tempGroup.addChild(aLine);
    }

}

function getTapeByGETseconds(seconds, channel) {
    var intChannel = parseInt(channel);
    var rec = [];
    var tapeRanges = (intChannel <= 30) ? gTapeRangesHR1 : gTapeRangesHR2;
    for (var index = 0; index < tapeRanges.length; ++index) {
        var startSeconds = timeStrToSeconds(tapeRanges[index][2]);
        var endSeconds = timeStrToSeconds(tapeRanges[index][3]);
        if (seconds >= startSeconds && seconds <= endSeconds) {
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

function ajaxGetTapeActivityJSONHR1(jsonUrl) {
    return $.ajax({
        type: "GET",
        url: jsonUrl,
        dataType: "json",
        success: function(data) {processActivityJSONHR1(data);},
        error: function(xhr, ajaxOptions, thrownError){
            // alert(xhr.status);
        }
    });
}

function processActivityJSONHR1(data) {
    gActiveTapeActivityArrayHR1 = data;
}

function ajaxGetTapeActivityJSONHR2(jsonUrl) {
    return $.ajax({
        type: "GET",
        url: jsonUrl,
        dataType: "json",
        success: function(data) {processActivityJSONHR2(data);},
        error: function(xhr, ajaxOptions, thrownError){
            // alert(xhr.status);
        }
    });
}

function processActivityJSONHR2(data) {
    gActiveTapeActivityArrayHR2 = data;
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
    if (sign === "-") {
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

function AddPoint5IfOdd(number) {
    if (number % 2 === 1) {
        return number + 0.5
    } else {
        return number;
    }
}