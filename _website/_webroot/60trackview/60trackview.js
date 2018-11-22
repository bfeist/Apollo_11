var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var gActiveTapeActivityArrayHR1 = [];
var gActiveTapeActivityArrayHR2 = [];

window.onload = function() {
    $.when(ajaxGetTapeRangeData()).done(function() {
        console.log("APPREADY: ajaxGetTapeRangeData Ajax loaded");

        var tapeDataHR1 = getTapeByGETseconds(0, 10);
        var noiserangeJSONUrlHR1 = "/mp3/" + tapeDataHR1[0] + "_defluttered_mp3_16/" + tapeDataHR1[0] + "_defluttered_mp3_16noiseranges.json";

        var tapeDataHR2 = getTapeByGETseconds(0, 40);
        var noiserangeJSONUrlHR2 = "/mp3/" + tapeDataHR2[0] + "_defluttered_mp3_16/" + tapeDataHR2[0] + "_defluttered_mp3_16noiseranges.json";

        $.when(ajaxGetTapeActivityJSONHR1(noiserangeJSONUrlHR1),
            ajaxGetTapeActivityJSONHR2(noiserangeJSONUrlHR2)).done(function() {
            console.log("APPREADY: both ajaxGetTapeActivity Ajax loaded");
            mainApplication();
        });
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
    // var channelCount = 0;
    // for (var i = 0; i < 480; i = i + 8) {
    //     channelCount++;
    //     var endVal = parseInt(Math.random()*1000);
    //     var channelStartPoint = new paper.Point(0, AddPoint5IfOdd(i));
    //     var channelEndPoint = new paper.Point(AddPoint5IfOdd(endVal), AddPoint5IfOdd(i));
    //     var aLine = new paper.Path.Line(channelStartPoint, channelEndPoint);
    //     // console.log('line :' + channelStartPoint + ' ' + channelEndPoint);
    //     aLine.strokeColor = 'black';
    //     if (channelCount % 10 === 0) {
    //         aLine.strokeColor = 'red';
    //     }
    //     aLine.strokeWidth = 4;
    //
    //     aLine.onMouseEnter = function(event) {
    //         this.strokeColor = 'blue';
    //     };
    //
    //     aLine.onMouseLeave = function(event) {
    //         this.strokeColor = 'black';
    //     };
    //     tempGroup.addChild(aLine);
    // }

    // tempGroup.appendChild(createChannelLine(5000, 5050, 13, 1));

    var startSecond = 0;
    var endSecond = 1000;
    // var channelNum = 13;
    // var yCoord = 0;
    var toolTipRectPath;

    var channelCount = 0;
    for (var iCh = 0; iCh < 240; iCh = iCh + 4) {
        channelCount++;
        var activeTapeActivityArray = [];
        var tapeChannelNum = 0;
        if (channelCount <= 30) {
            activeTapeActivityArray = gActiveTapeActivityArrayHR1;
            tapeChannelNum = channelCount;
        } else {
            activeTapeActivityArray = gActiveTapeActivityArrayHR2;
            tapeChannelNum = channelCount - 30;
        }

        var lineGroup = new paper.Group;
        var xCoord = 0;
        var yCoord = iCh;
        var currSegStart = -1;
        var prevXCoordActive = false;
        for (var i = startSecond; i <= endSecond; i++) {
            if (activeTapeActivityArray[i].includes(tapeChannelNum)) {
                if (!prevXCoordActive) {
                    currSegStart = xCoord;
                    prevXCoordActive = true;
                }
            } else {
                if (prevXCoordActive) {
                    var startPoint = new paper.Point(currSegStart, yCoord);
                    var endPoint = new paper.Point(xCoord, yCoord);
                    var aLine = new paper.Path.Line(startPoint, endPoint);
                    aLine.strokeColor = 'black';
                    lineGroup.addChild(aLine);
                    prevXCoordActive = false;
                }
            }
            xCoord++;
        }
        if (lineGroup.children.length > 0) {
            var lineGroupRaster = lineGroup.rasterize();
            lineGroupRaster.name = 'ch' + channelCount;
            tempGroup.addChild(lineGroupRaster);

            lineGroupRaster.onMouseEnter = function(event) {
                // this.strokeColor = 'blue';
                // console.log("onMouseEnter");

                var tooltipGroup = new paper.Group;
                tooltipGroup.name = 'tooltip';

                var tooltipRect = new paper.Rectangle(event.point.x + 10, event.point.y - 20, 50, 20);
                // var tooltipRect = new paper.Rectangle(this.position + new paper.Point(-20, -40), new paper.Size(40, 28));
                var tooltip = new paper.Path.Rectangle(tooltipRect);
                tooltip.fillColor = 'white';
                tooltip.strokeColor = 'black';
                tooltipGroup.addChild(tooltip);

                var tooltipText = new paper.PointText({
                    justification: 'left',
                    fontWeight: 'bold',
                    // fontFamily: graphFontFamily,
                    fontSize: 11,
                    fillColor: 'black'
                });
                tooltipText.content = this.name;
                tooltipText.point = new paper.Point(event.point.x + 20, event.point.y - 6);
                tooltipGroup.addChild(tooltipText);

                this.parent.addChild(tooltipGroup);
            };

            lineGroupRaster.onMouseLeave = function(event) {
                // this.strokeColor = 'black';
                // console.log("onMouseLeave");
                this.parent.children['tooltip'].remove();
                view.draw();
            };
        }
        lineGroup.remove();
        lineGroup = null;
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
            console.log('getTapeByGETseconds: seconds:' + seconds + ' channel: ' + channel + ' tape: ' + tapeRanges[index][0]);
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