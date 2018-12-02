const cMissionDurationSeconds = 784086;
const cCountdownSeconds = 74768;
const cCanvasHeight = 300;
const cWavVerticaloffset = 190;
const cWavHeight = 100;

const cTrackNames = {
    ch1: 'HR1 Datastream',
    ch2: 'FLIGHT OPS DIR',
    ch3: 'MISSION DIRECTOR',
    ch4: 'DOD MANAGER',
    ch5: 'OPS AND PRO',
    ch6: 'ASST FLIGHT DIR',
    ch7: 'FLIGHT DIRECTOR [L]',
    ch8: 'FLIGHT DIRECTOR [R]',
    ch9: 'FLT PLANS OFFICER',
    ch10: 'NETWORK CTRLR [L]',
    ch11: 'NETWORK CTRLR [R]',
    ch12: 'SURGEON [L]',
    ch13: 'SURGEON [R]',
    ch14: 'CAPCOM [L]',
    ch15: 'CAPCOM [R]',
    ch16: 'INCO',
    ch17: 'EECOM',
    ch18: 'GNC',
    ch19: 'RETRO',
    ch20: 'FIDO',
    ch21: 'GUIDO [L]',
    ch22: 'GUIDO [R]',
    ch23: 'LOAD CONTROL',
    ch24: 'RCS',
    ch25: 'CCATS CMD',
    ch26: 'TIC',
    ch27: 'CCATS TM',
    ch28: 'TRACK [L]',
    ch29: 'TRACK [R]',
    ch30: 'HR1 VOICE ANNOTATION',
    ch31: 'HR2 Datastream',
    ch32: 'NASA RECOVERY COORD',
    ch33: 'ASST NASA RCVY COORD',
    ch34: 'RECOVERY STATUS',
    ch35: 'RECOVERY EVALUATOR',
    ch36: 'DOD COORD',
    ch37: 'DOD PRIMARY OP',
    ch38: 'DOD MANAGER [RCVY]',
    ch39: 'DOD EXEC',
    ch40: 'DOD ASST FOR COMM 1',
    ch41: 'DOD PIO',
    ch42: 'COMM TECH [3RD FL]',
    ch43: 'COMM CTRLR [3RD FL]',
    ch44: 'SPACE ENVIRONMENT',
    ch45: 'COMPUTER SUPPORT',
    ch46: 'SPAN',
    ch47: 'BOOSTER [L]',
    ch48: 'BOOSTER [C]',
    ch49: 'BOOSTER [R]',
    ch50: '3 FLIGHT DIRECTOR LOOP',
    ch51: '3 AFD CONF LOOP',
    ch52: '3 GOSS 2 LOOP',
    ch53: 'ALSEP EAO 2',
    ch54: '3 MOCR DYN LOOP',
    ch55: '3 GOSS CONF LOOP',
    ch56: '3 GOSS 4 LOOP',
    ch57: 'LM GNC ENGINEER',
    ch58: 'LM EECOM ENGINEER',
    ch59: 'EXPMT ACTIVITIES OFSR',
    ch60: 'HR2 VOICE ANNOTATION'
};

const cColors = {
    activeLine: '#636363',
    activeLineSelectedChannel: '#7cb7e0',
    inactiveLine: '#1c1c1c',
    inactiveLineSelectedChannel: '#214557',
    fillerLine: '#000000',
    cursorColor: 'red',
    cursorFillColor: '#000000',
    tooltipColor: '#DDDDDD',
    tooltipFillColor: '#000000'
};

var gTapeRangesHR1 = [];
var gTapeRangesHR2 = [];
var gActiveTape = "T867";
var gActiveChannel = 14;
var gActiveTapeActivityArrayHR1 = [];
var gActiveTapeActivityArrayHR2 = [];
var gCurrGETSeconds = -69500;
var gInterval;
var gChannelLinesGroup;
var gTimeCursorGroup;
var gChannelNameGroup;

var gWaveform;
var gWaveform4096;
var gWaveform2048;
var gWaveform1024;
var gWaveform512;
var gPaperWaveformGroup;

var gTool;
var gTooltipGroup;
// var gCurrGETSeconds = -74768; //start at beginning of countdown

window.onload = function() {
    paper.install(window);

    $.when(ajaxGetTapeRangeData()).done(function() {
        trace("APPREADY: ajaxGetTapeRangeData Ajax loaded");

        var tapeDataHR1 = getTapeByGETseconds(gCurrGETSeconds, 10);
        var noiserangeJSONUrlHR1 = "/mp3/" + tapeDataHR1[0] + "_defluttered_mp3_16/" + tapeDataHR1[0] + "_defluttered_mp3_16noiseranges.json";

        var tapeDataHR2 = getTapeByGETseconds(gCurrGETSeconds, 40);
        var noiserangeJSONUrlHR2 = "/mp3/" + tapeDataHR2[0] + "_defluttered_mp3_16/" + tapeDataHR2[0] + "_defluttered_mp3_16noiseranges.json";

        $.when(ajaxGetTapeActivityJSONHR1(noiserangeJSONUrlHR1),
            ajaxGetTapeActivityJSONHR2(noiserangeJSONUrlHR2)).done(function() {
            trace("APPREADY: both ajaxGetTapeActivity Ajax loaded");
            mainApplication();
        });
    });
};

$(window).resize(resizeAndRedrawCanvas);

function resizeAndRedrawCanvas() {
    var canvas = document.getElementById('myCanvas');
    var desiredWidth = $(window).width(); // For instance: $(window).width();
    var desiredHeight = cCanvasHeight; // For instance $('#canvasContainer').height();

    canvas.width = desiredWidth;
    canvas.height = desiredHeight;

    view.viewSize = new Size(desiredWidth, desiredHeight);
    view.draw();
}

function mainApplication() {
    trace("mainApplication ()");
    var canvas = document.getElementById('myCanvas');
    var slider = document.getElementById("myRange");
    var missionTimeDisplay = document.getElementById("missionTimeDisplay");
    // canvas.width = 1000;
    canvas.height = cCanvasHeight;

    paper.setup(canvas);
    gChannelLinesGroup = new paper.Group;
    gTool = new paper.Tool();
    gTooltipGroup = new paper.Group;
    gTimeCursorGroup = new paper.Group;
    gChannelNameGroup = new paper.Group;

    gTool.onMouseMove = function (event) {
        // paper.project.activeLayer.children['tooltip'].remove();
        gTooltipGroup.removeChildren();
        var hoverChannelNum = undefined;
        if (event.item) {
            for (var itemChildrenCounter = 0; itemChildrenCounter <= event.item.children.length; itemChildrenCounter++) {
                if (event.item.children[itemChildrenCounter] !== undefined) {
                    if (event.item.children[itemChildrenCounter].contains(event.point)) {
                        // trace("mouse on item: " + event.item.children[itemChildrenCounter].name);
                        hoverChannelNum = event.item.children[itemChildrenCounter].name;
                    }
                }
            }
        }

        if (hoverChannelNum !== undefined && hoverChannelNum !== 'wav') {
            var tooltipText = new paper.PointText({
                justification: 'left',
                fontWeight: 'bold',
                // fontFamily: graphFontFamily,
                fontSize: 11,
                fillColor: cColors.tooltipColor
            });

            // tooltipText.content = hoverChannelNum + " - " + cTrackNames[hoverChannelNum] + " \n"
            //     + secondsToTimeStr(gCurrGETSeconds - Math.round($(window).width() / 2) + event.point.x);
            tooltipText.content = cTrackNames[hoverChannelNum] + " \n" +
                secondsToTimeStr(gCurrGETSeconds - Math.round($(window).width() / 2) + event.point.x);
            tooltipText.point = new paper.Point(event.point.x + 20, event.point.y + 13);
            gTooltipGroup.addChild(tooltipText);

            var tooltip = new paper.Path.Rectangle(tooltipText.bounds.x - 5, tooltipText.bounds.y - 5, tooltipText.bounds.width + 10, tooltipText.bounds.height + 10);
            tooltip.fillColor = cColors.tooltipFillColor;
            tooltip.strokeColor = cColors.tooltipColor;


            gTooltipGroup.addChild(tooltip);
            tooltip.moveBelow(tooltipText);
            gTooltipGroup.bringToFront();
        }
    };

    gTool.onMouseDown = function (event) {
        if (event.point.y <= 203) { //if in the top mulitrack area
            //set channel
            var hoverChannelNum = undefined;
            if (event.item) {
                for (var itemChildrenCounter = 0; itemChildrenCounter <= event.item.children.length; itemChildrenCounter++) {
                    if (event.item.children[itemChildrenCounter] !== undefined) {
                        if (event.item.children[itemChildrenCounter].contains(event.point)) {
                            // trace("mouse on item: " + event.item.children[itemChildrenCounter].name);
                            hoverChannelNum = event.item.children[itemChildrenCounter].name;
                        }
                    }
                }
            }
            if (hoverChannelNum !== undefined && hoverChannelNum !== 'wav') {
                gActiveChannel = parseInt(hoverChannelNum.substr(2, 2));
                loadChannelSoundfile();
            }

            //set GET
            var mouseGEToffset = event.point.x - Math.round($(window).width() / 2);
            gCurrGETSeconds = gCurrGETSeconds + mouseGEToffset;
        } else { //if in the wav form area
            //set GET from wav click
            mouseGEToffset = (event.point.x - Math.round($(window).width() / 2)) * gWaveform512.seconds_per_pixel;
            gCurrGETSeconds = gCurrGETSeconds + mouseGEToffset;
        }
        playFromCurrGET();
        drawChannels(gCurrGETSeconds - Math.round($(window).width() / 2), $(window).width());
        drawTimeCursor();
    };

    slider.onmousedown = function() {
        trace("slider mousedown");
        clearInterval(gInterval); //clear the slider update playback interval
        gInterval = null;
        // gPeaksInstance.player.pause();
    };

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        gCurrGETSeconds = (((this.value - 1) * cMissionDurationSeconds) / 99) - cCountdownSeconds;
        missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);

        drawChannels(gCurrGETSeconds - Math.round($(window).width() / 2), $(window).width());
        drawTimeCursor();
    };

    slider.onmouseup = function() {
        trace("slider mouseup");
        var tapeDataHR1 = getTapeByGETseconds(gCurrGETSeconds, 10);
        var noiserangeJSONUrlHR1 = "/mp3/" + tapeDataHR1[0] + "_defluttered_mp3_16/" + tapeDataHR1[0] + "_defluttered_mp3_16noiseranges.json";

        var tapeDataHR2 = getTapeByGETseconds(gCurrGETSeconds, 40);
        var noiserangeJSONUrlHR2 = "/mp3/" + tapeDataHR2[0] + "_defluttered_mp3_16/" + tapeDataHR2[0] + "_defluttered_mp3_16noiseranges.json";

        $.when(ajaxGetTapeActivityJSONHR1(noiserangeJSONUrlHR1),
            ajaxGetTapeActivityJSONHR2(noiserangeJSONUrlHR2)).done(function() {
            trace("slider mouseup: both ajaxGetTapeActivity Ajax loaded");
            startInterval();
        });
        loadChannelSoundfile();
        playFromCurrGET();
    };

    gPaperWaveformGroup = new paper.Group;

    resizeAndRedrawCanvas();
    loadChannelSoundfile();
    playFromCurrGET();
    startInterval();

}

function startInterval() {
    gInterval = setInterval(function(){
        trace("interval firing");
        var slider = document.getElementById("myRange");
        var missionTimeDisplay = document.getElementById("missionTimeDisplay");
        var player = document.getElementById("audio-element");

        var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
        var currSeconds = player.currentTime;
        currSeconds = currSeconds === undefined ? 1 : currSeconds;
        gCurrGETSeconds = currSeconds + timeStrToSeconds(tapeData[2]);
        drawChannels(gCurrGETSeconds - Math.round($(window).width() / 2), $(window).width());
        drawTimeCursor();
        missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);
        slider.value = (((gCurrGETSeconds + cCountdownSeconds) * 99) / cMissionDurationSeconds);
        // gCurrGETSeconds++;
    }, 1000);
}

function wavDataLoaded() {
    paper.view.onFrame = function(event) {
        var player = document.getElementById('audio-element');
        var canvas = document.getElementById('myCanvas');
        // gCurrGETSeconds = player.currentTime;

        gPaperWaveformGroup.removeChildren();

        var wavePath1 = new paper.Path({
            strokeWidth: 0.5,
            strokeColor: cColors.activeLineSelectedChannel,
            fillColor: cColors.activeLineSelectedChannel,
            name: "wav"
        });

        var offsetStart = Math.round(player.currentTime * gWaveform512.pixels_per_second) - Math.round(canvas.width / 2);
        offsetStart = (offsetStart < 0) ? 0 : offsetStart;
        var offsetEnd = offsetStart + canvas.width;

        gWaveform512.offset(offsetStart, offsetEnd);
        // trace("gWaveform offset_duration: " + gWaveform4096.offset_duration);

        gWaveform512.min.forEach(function (val, x) {
            wavePath1.add(new Point(x + 0.1, interpolateHeight(cWavHeight, val) + 0.5 + cWavVerticaloffset));
        });
        gWaveform512.max.reverse().forEach(function (val, x) {
            wavePath1.add(new Point(gWaveform512.offset_length - x - 0.5, interpolateHeight(cWavHeight, val) - 0.5 + cWavVerticaloffset));
        });
        // var wavePath1Raster = wavePath1.rasterize();
        gPaperWaveformGroup.addChild(wavePath1);

        gPaperWaveformGroup.moveBelow(gTimeCursorGroup);
    }
}

function loadChannelSoundfile() {
    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
    var player = document.getElementById("audio-element");

    if (tapeData.length !== 0 && tapeData[0] !== 'T999') {
        gActiveTape = tapeData[0];
        var channel = (gActiveChannel > 30) ? gActiveChannel - 30 : gActiveChannel;
        var filename = "defluttered_A11_" + tapeData[0] + "_" + tapeData[1] + "_CH" + channel;

        player.src = "/mp3/" + tapeData[0] + "_defluttered_mp3_16/" + filename + '.mp3';
        player.load();

        var datFile = "/mp3/" + tapeData[0] + "_defluttered_mp3_16/audiowaveform/" + filename + '.dat';
        ajaxGetWaveData(datFile);
        drawChannelName();
    } else {
        alert("No tape audio for this channel at this time");
    }
}

function drawChannelName() {
    gChannelNameGroup.removeChildren();
    var channelText = new paper.PointText({
        justification: 'left',
        fontSize: 14,
        fillColor: cColors.tooltipColor,
        strokeColor: cColors.tooltipColor
    });
    channelText.content = cTrackNames['ch' + gActiveChannel];
    channelText.point = new paper.Point(10, cCanvasHeight - 75);
    var cornerSize = new paper.Size(3, 3);

    var channelTextRect = new paper.Path.RoundRectangle(channelText.bounds, cornerSize);
    channelTextRect.strokeColor = cColors.tooltipColor;
    channelTextRect.fillColor = cColors.tooltipFillColor;
    channelTextRect.scale(1.1, 1.2);

    gChannelNameGroup.addChild(channelTextRect);
    gChannelNameGroup.addChild(channelText);
}

function playFromCurrGET() {
    trace("playFromCurrGET()");
    var player = document.getElementById("audio-element");
    // var sliderVal = $('#myRange').val();
    // var sliderMissionSeconds = (((sliderVal - 1) * cMissionDurationSeconds) / 99) - cCountdownSeconds;

    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
    var tapeCueTimeSeconds = gCurrGETSeconds - timeStrToSeconds(tapeData[2]);

    // if (tapeData.length !== 0) {
    player.currentTime = tapeCueTimeSeconds;
    player.play();
    // }
}

//CANVAS ---

function drawChannels(startSecond, durationSeconds) {
    gChannelLinesGroup.removeChildren();
    var channelCount = 0;
    var lineCounter = 0;
    for (var iCh = 0; iCh < 240; iCh = iCh + 4) {
        channelCount++;

        if (![1, 4, 10, 31, 36, 37, 38, 39, 40, 41].includes(channelCount)) { //don't display redacted channels
            lineCounter++;

            //get tape start/end based on GET
            var tapeData = getTapeByGETseconds(gCurrGETSeconds, channelCount);
            if (tapeData.length !== 0) {
                var tapeTimeStartSecond = startSecond - timeStrToSeconds(tapeData[2]);
                var tapeTimeEndSecond = tapeTimeStartSecond + durationSeconds;

                var activeTapeActivityArray = [];
                var tapeChannelNum;
                if (channelCount <= 30) {
                    activeTapeActivityArray = gActiveTapeActivityArrayHR1;
                    tapeChannelNum = channelCount;
                } else {
                    activeTapeActivityArray = gActiveTapeActivityArrayHR2;
                    tapeChannelNum = channelCount - 30;
                }

                var lineGroup = new paper.Group;
                var xCoord = 0;
                var yCoord = lineCounter * 4;
                var currSegStart = -1;
                var prevXCoordActive = false;

                //draw filler line background
                var fillerLine = new paper.Path.Line({
                    from: [xCoord, yCoord + 2],
                    to: [durationSeconds, yCoord + 2],
                    strokeWidth: 2,
                    strokeColor: cColors.fillerLine,
                    name: 'ch' + channelCount
                });
                lineGroup.addChild(fillerLine);

                //draw inactive line background
                var inactiveLine = new paper.Path.Line({
                    from: [xCoord, yCoord],
                    to: [durationSeconds, yCoord],
                    strokeWidth: 2
                });
                if (channelCount === gActiveChannel) {
                    inactiveLine.strokeColor = cColors.inactiveLineSelectedChannel;
                } else {
                    inactiveLine.strokeColor = cColors.inactiveLine;
                }
                lineGroup.addChild(inactiveLine);

                if (activeTapeActivityArray.length !== 0) { //if there is tape data for this GET then draw activity
                    for (var i = Math.round(tapeTimeStartSecond); i <= tapeTimeEndSecond; i++) {
                        if (activeTapeActivityArray[i].includes(tapeChannelNum)) {
                            if (!prevXCoordActive) {
                                currSegStart = xCoord;
                                prevXCoordActive = true;
                            }
                        } else {
                            if (prevXCoordActive) {
                                var aLine = new paper.Path.Line({
                                    from: [currSegStart, yCoord],
                                    to: [xCoord, yCoord],
                                    strokeWidth: 2,
                                    // name: "ch" + tapeChannelNum
                                });
                                if (channelCount === gActiveChannel) {
                                    aLine.strokeColor = cColors.activeLineSelectedChannel;
                                } else {
                                    aLine.strokeColor = cColors.activeLine;
                                }
                                lineGroup.addChild(aLine);
                                prevXCoordActive = false;
                            }
                        }
                        xCoord++;
                    }
                    if (prevXCoordActive) {
                        aLine = new paper.Path.Line({
                            from: [currSegStart, yCoord],
                            to: [xCoord, yCoord],
                            strokeWidth: 2,
                            // name: "ch" + tapeChannelNum
                        });
                        if (channelCount === gActiveChannel) {
                            aLine.strokeColor = cColors.activeLineSelectedChannel;
                        } else {
                            aLine.strokeColor = cColors.activeLine;
                        }
                        lineGroup.addChild(aLine);
                    }
                }

                if (lineGroup.children.length > 0) {
                    var lineGroupRaster = lineGroup.rasterize();
                    lineGroupRaster.name = 'ch' + channelCount;
                    gChannelLinesGroup.addChild(lineGroupRaster);
                }
                lineGroup.remove();
                lineGroup = null;
                // lineGroup.name = 'ch' + channelCount;
                // gChannelLinesGroup.addChild(lineGroup);
            }
            else {
                trace("tapedata wrong");
            }
        }
    }
}

function drawTimeCursor() {
    gTimeCursorGroup.removeChildren();
    var startPoint = new paper.Point(Math.round($(window).width() / 2) + 0.5, 0);
    var endPoint = new paper.Point(Math.round($(window).width() / 2) + 0.5, cCanvasHeight - 10);
    var aLine = new paper.Path.Line(startPoint, endPoint);
    aLine.strokeColor = cColors.cursorColor;
    aLine.strokeWidth = 1;
    aLine.name = "timeCursor";
    gTimeCursorGroup.addChild(aLine);

    var timeText = new paper.PointText({
        justification: 'left',
        fontWeight: 'bold',
        fontSize: 11,
        fillColor: cColors.cursorColor
    });
    timeText.content = secondsToTimeStr(gCurrGETSeconds);
    timeText.point = new paper.Point(Math.round($(window).width() / 2) - timeText.bounds.width / 2, cCanvasHeight - 10);
    var cornerSize = new paper.Size(3, 3);
    var timeTextRect = new paper.Path.RoundRectangle(timeText.bounds, cornerSize);
    //var timeTextRect = new paper.Path.Rectangle(timeText.bounds);
    timeTextRect.strokeColor = cColors.cursorColor;
    timeTextRect.fillColor = cColors.cursorFillColor;
    //timeTextRect.opacity = 0.5;
    timeTextRect.scale(1.1, 1.2);
    gTimeCursorGroup.addChild(timeTextRect);
    gTimeCursorGroup.addChild(timeText);
}


function getTapeByGETseconds(seconds, channel) {
    var intChannel = parseInt(channel);
    var rec = [];
    var tapeRanges = (intChannel <= 30) ? gTapeRangesHR1 : gTapeRangesHR2;
    for (var index = 0; index < tapeRanges.length; ++index) {
        var startSeconds = timeStrToSeconds(tapeRanges[index][2]);
        var endSeconds = timeStrToSeconds(tapeRanges[index][3]);
        if (seconds >= startSeconds && seconds <= endSeconds) {
            // trace('getTapeByGETseconds: seconds:' + seconds + ' channel: ' + channel + ' tape: ' + tapeRanges[index][0]);
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
    //trace("processTapeRangeData");
    var allTextLines = allText.split(/\r\n|\n/);
    for (var i = 0; i < allTextLines.length; i++) {
        var data = allTextLines[i].split('|');
        var rec = [];
        rec.push(data[0]);
        rec.push(data[1]);
        rec.push(data[2]);
        rec.push(data[3]);
        // trace(timeStrToSeconds(data[2]));
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
    trace("ajaxGetTapeActivityJSONHR1(): " + jsonUrl);
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
    trace("ajaxGetTapeActivityJSONHR2(): " + jsonUrl);
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

function ajaxGetWaveData(url) {
    const xhr = new XMLHttpRequest();
// .dat file generated by audiowaveform program
    xhr.responseType = 'arraybuffer';
    xhr.open("GET", url);

    xhr.addEventListener('load', function (progressEvent) {
        gWaveform = WaveformData.create(progressEvent.target);
        gWaveform4096 = gWaveform.resample({scale: 4096});
        gWaveform2048 = gWaveform.resample({scale: 2048});
        gWaveform1024 = gWaveform.resample({scale: 1024});
        gWaveform512 = gWaveform.resample({scale: 512});

        trace("APPREADY: gWaveform Ajax loaded");
        trace(gWaveform.duration);
        wavDataLoaded();
    });
    xhr.send();
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

function trace(str) {
    var debug = true;
    if (debug === true) {
        try {
            console.log(str);
        } catch (e) {
            //no console, no trace
        }
    }
}

function interpolateHeight(total_height, size) {
    var amplitude = 256;
    return total_height - (size + 128) * total_height / amplitude;
}