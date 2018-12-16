const cMissionDurationSeconds = 784086;
const cCountdownSeconds = 74768;
const cAppStartGET = -74768;
const cNumberOfActiveTapeChannels = 50;

const cCanvasHeight = 350;
const cWavVerticaloffset = (cCanvasHeight / 2 + 65);
const cWavHeight = 100;
const cChannelStrokeWidth = 4;
const cFillerStrokeWidth = 1;

const cTrackInfo = {
    ch1: ['HR1 Datastream', ''],
    ch2: ['FLIGHT OPS DIR', 'Overall responsibility for the mission interface to program Management.'],
    ch3: ['MISSION DIRECTOR', 'The primary interface between NASA Headquarters and the Flight Control Team.'],
    ch4: ['DOD MANAGER', 'Primary interface with NASA for any Department of Defense support required during a mission, including recovery ships and DoD controlled tracking resources.'],
    ch5: ['OPS AND PRO', 'Operations and Procedures Officer – Supervised the application of mission rules and detailed implementation of the Mission Control Center/Ground Operational Support Systems mission control procedures.'],
    ch6: ['ASST FLIGHT DIR', 'Responsible to the Flight Director for detailed control of the mission and assumed the duties of the Flight Director in his absence.'],
    ch7: ['FLIGHT DIRECTOR [L]', 'Left seat - Responsible to the Mission Director for detailed control of the mission from launch (tower clear) to splashdown and assumed the duties of the Mission Director in his absence. In real time was responsible to take any actions needed for crew safety and mission success.'],
    ch8: ['FLIGHT DIRECTOR [R]', 'Right seat - Responsible to the Mission Director for detailed control of the mission from launch (tower clear) to splashdown and assumed the duties of the Mission Director in his absence. In real time was responsible to take any actions needed for crew safety and mission success.'],
    ch9: ['FLT PLANS OFFICER', ''],
    ch10: ['NETWORK CTRLR [L]', 'Network Controller - Had detailed operational control of the world wide Ground Operational Support System (GOSS), which included the tracking stations. (left seat)'],
    ch11: ['NETWORK CTRLR [R]', 'Network Controller - Had detailed operational control of the world wide Ground Operational Support System (GOSS), which included the tracking stations. (right seat)'],
    ch12: ['SURGEON [L]', 'Directed all operational medical activities and crew’s medical status. (left seat)'],
    ch13: ['SURGEON [R]', 'Directed all operational medical activities and crew’s medical status. (right seat)'],
    ch14: ['CAPCOM [L]', 'Spacecraft Communicator – or Capsule Communicator - An astronaut who provided all the voice communications between the ground and the spacecraft. (left seat)'],
    ch15: ['CAPCOM [R]', 'Spacecraft Communicator – or Capsule Communicator - An astronaut who provided all the voice communications between the ground and the spacecraft. (right seat)'],
    ch16: ['INCO', 'Instrumentation and Communications Officer – With the advent of dual spacecraft operations, lunar surface operations, science TV, and extensive data recovery, a new operating position was added, beginning with the Apollo 11 mission.'],
    ch17: ['EECOM', 'Electrical, Environmental and Consumables Manager - Monitored cryogenic levels for fuel cells, and cabin cooling systems; electrical distribution systems; cabin pressure control systems; and vehicle lighting systems. EECOM originally stood for Electrical, Environmental and COMmunication systems'],
    ch18: ['GNC', 'Guidance, Navigation, and Controls Systems Engineer - Monitored all vehicle guidance, navigation and control systems. Also responsible for propulsion systems such as the Service Propulsion System and Reaction Control System (RCS).'],
    ch19: ['RETRO', 'Retrofire Officer - Drew up abort plans and was responsible for determination of retrofire times. During lunar missions the RETRO planned and monitored Trans Earth Injection (TEI) maneuvers, where the Apollo Service Module fired its engine to return to Earth from the Moon.'],
    ch20: ['FIDO', 'Flight Dynamics Officer - Responsible for the flight path of the space vehicle, both atmospheric and orbital. During lunar missions the FDO was also responsible for the lunar trajectory. The FDO monitored vehicle performance during the powered flight phase and assessed abort modes, calculated orbital maneuvers and resulting trajectories, and monitored vehicle flight profile and energy levels during re-entry.'],
    ch21: ['GUIDO [L]', 'Guidance Officer - Monitored onboard navigational systems and onboard guidance computer software. Responsible for determining the position of the spacecraft in space. One well-known Guidance officer was Steve Bales, who gave the GO call when the Apollo 11 guidance computer came close to overloading during the first lunar descent. (left seat)'],
    ch22: ['GUIDO [R]', 'Guidance Officer - Monitored onboard navigational systems and onboard guidance computer software. Responsible for determining the position of the spacecraft in space. One well-known Guidance officer was Steve Bales, who gave the GO call when the Apollo 11 guidance computer came close to overloading during the first lunar descent. (right seat)'],
    ch23: ['CCATS LOAD CONTROL', 'Communications, Command and Telemetry Support, Command Load Controller.'],
    ch24: ['CCATS RTC', 'Communications, Command and Telemetry Support, Real-Time Command Controller.'],
    ch25: ['CCATS CMD', 'Communications, Command and Telemetry Support, Command Controller.'],
    ch26: ['CCATS TIC', 'Communications, Command and Telemetry Support, Telemetry Instrumentation Contoller.'],
    ch27: ['CCATS TM', 'Communications, Command and Telemetry Support, Telemetry Controller.'],
    ch28: ['TRACK [L]', 'Instrumentation Tracking Controller.'],
    ch29: ['TRACK [R]', 'Instrumentation Tracking Controller, Unified S-Band.'],
    ch30: ['HR1 VOICE ANNOTATION', ''],
    ch31: ['HR2 Datastream', ''],
    ch32: ['NASA RECOVERY COORD', 'NASA Recovery Officer - In charge of the Recovery Operations Control Room (ROCR).'],
    ch33: ['ASST NASA RCVY COORD', 'NASA Assistant Recovery Officer - Taking the lead for interfacing with other ROCR personnel.'],
    ch34: ['RECOVERY STATUS', 'Recovery Operations Control Room (ROCR), Recovery Status Monitor - Assembling and displaying, on ROCR group displays, information on recovery force positions and status, pertinent recovery weather data and significant mission events.'],
    ch35: ['RECOVERY EVALUATOR', 'Recovery Operations Control Room (ROCR), Evaluator / Display Controller - Assimilating and evaluating all data necessary to select the most desirable target points for any situation and recommending them to the Recovery Officer.'],
    ch36: ['DOD COORD', ''],
    ch37: ['DOD PRIMARY OP', ''],
    ch38: ['DOD MANAGER [RCVY]', ''],
    ch39: ['DOD EXEC', ''],
    ch40: ['DOD ASST FOR COMM 1', ''],
    ch41: ['DOD PIO', ''],
    ch42: ['COMM TECH [3RD FL]', ''],
    ch43: ['COMM CTRLR [3RD FL]', ''],
    ch44: ['SPACE ENVIRONMENT', 'Supplied information on meteorological and space radiation.'],
    ch45: ['COMPUTER SUPPORT', 'Apollo Guidance Computer Support - Often pronounced \'computer soup\'.'],
    ch46: ['SPAN', 'Spacecraft Analysis Room - Official interface for the Manager of the Apollo Spaceflight Program Office. Located on the 3rd floor the mission control building.'],
    ch47: ['BOOSTER [L]', 'Monitored and evaluated performance of propulsion-related aspects of the launch vehicle during prelaunch and ascent. During the Apollo program there were three Booster positions, who worked only until Trans Lunar Injection (TLI); after that, their consoles were vacated. Booster had the power to send an abort command to the spacecraft. All Booster technicians were employed at the Marshall Space Flight Center and reported to JSC for the launches. (left seat)'],
    ch48: ['BOOSTER [C]', 'Monitored and evaluated performance of propulsion-related aspects of the launch vehicle during prelaunch and ascent. During the Apollo program there were three Booster positions, who worked only until Trans Lunar Injection (TLI); after that, their consoles were vacated. Booster had the power to send an abort command to the spacecraft. All Booster technicians were employed at the Marshall Space Flight Center and reported to JSC for the launches. (center seat)'],
    ch49: ['BOOSTER [R]', 'Monitored and evaluated performance of propulsion-related aspects of the launch vehicle during prelaunch and ascent. During the Apollo program there were three Booster positions, who worked only until Trans Lunar Injection (TLI); after that, their consoles were vacated. Booster had the power to send an abort command to the spacecraft. All Booster technicians were employed at the Marshall Space Flight Center and reported to JSC for the launches. (right seat)'],
    ch50: ['3 FLIGHT DIRECTOR LOOP', 'FD clean voice-only recording of Flight Director [R]'],
    ch51: ['3 AFD CONF LOOP', 'Assistant Flight Director - Comm line.'],
    ch52: ['3 GOSS 2 LOOP', 'Ground Operational Support System (GOSS) - Comm line.'],
    ch53: ['ALSEP EAO 2', ''],
    ch54: ['3 MOCR DYN LOOP', 'Comm line.'],
    ch55: ['3 GOSS CONF LOOP', 'Ground Operational Support System (GOSS) - Comm line.'],
    ch56: ['3 GOSS 4 LOOP', 'Ground Operational Support System (GOSS) - Comm line.'],
    ch57: ['LM GNC ENGINEER', 'Lunar Module Guidance, Navigation, and Controls Systems Engineer.'],
    ch58: ['LM EECOM ENGINEER', 'Lunar Module Electrical, Environmental and Consumables Management Engineer.'],
    ch59: ['EXPMT ACTIVITIES OFSR', 'Experiments Officer.'],
    ch60: ['HR2 VOICE ANNOTATION', '']
};

cRedactedChannelsArray = [1, 4, 10, 31, 36, 37, 38, 39, 40, 41];
cAvailableChannelsArray = [2, 3, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 33, 34, 35, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60];

const cColors = {
    activeLine: '#636363',
    activeLineSelectedChannel: '#7cb7e0',
    inactiveLine: '#292929',
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
var gTapesActivityArray = [];
var gCurrGETSeconds = cAppStartGET;
var gLastRoundedGET = cAppStartGET;


var gChannelLinesGroup;
var gTimeCursorGroup;
var gChannelNameGroup;

var gWavDataLoaded = false;

var gWaveform;
var gWaveform4096;
var gWaveform2048;
var gWaveform1024;
var gWaveform512;
var gPaperWaveformGroup;
var gLastWaveformFullDrawGET = -1000000;
var gLastWaveformOnFrameGET = -1000000;
var gWaveformRefresh = false;
var gLastChannelsFullDrawGET = -1000000;
var gLastChannelsOnFrameGET = -1000000;

var gTool;
var gTooltipGroup;
// var gCurrGETSeconds = -74768; //start at beginning of countdown

var gPlayer;
var gOnplaying = true;
var gOnpause = false;
var gSliderDragging = false;

window.onload = function() {
    gPlayer = document.getElementById("audio-element");
    paper.install(window);

    $.when(ajaxGetTapeRangeData(),
        ajaxGetTapesActivityData()).done(function() {
        trace("APPREADY: Ajax loaded");

        mainApplication();
    });

    document.getElementById('myCanvas').addEventListener("mouseleave", function(event) {
        trace("canvas mouseleave triggered");
        gTooltipGroup.removeChildren();
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
        //if in the top mulitrack area
        if (event.point.y > 0 && event.point.y < cNumberOfActiveTapeChannels * (cChannelStrokeWidth + cFillerStrokeWidth) + (cChannelStrokeWidth + cFillerStrokeWidth)) {
            // paper.project.activeLayer.children['tooltip'].remove();
            gTooltipGroup.removeChildren();

            var availableChannelsIndex = Math.round((event.point.y - cChannelStrokeWidth / 2) / (cChannelStrokeWidth + cFillerStrokeWidth));
            availableChannelsIndex = availableChannelsIndex > cNumberOfActiveTapeChannels - 1 ? cNumberOfActiveTapeChannels - 1 : availableChannelsIndex;
            availableChannelsIndex = availableChannelsIndex < 0 ? 0 : availableChannelsIndex;
            var hoverChannelNum = 'ch' + cAvailableChannelsArray[availableChannelsIndex];

            var tooltipText = new paper.PointText({
                justification: 'left',
                fontWeight: 'bold',
                // fontFamily: graphFontFamily,
                fontSize: 11,
                fillColor: cColors.tooltipColor
            });

            tooltipText.content = hoverChannelNum + " " + cTrackInfo[hoverChannelNum][0] + " \n" + secondsToTimeStr(gCurrGETSeconds - Math.round($(window).width() / 2) + event.point.x);
            tooltipText.point = new paper.Point(event.point.x + 20, event.point.y + 13);
            gTooltipGroup.addChild(tooltipText);

            var tooltip = new paper.Path.Rectangle(tooltipText.bounds.x - 5, tooltipText.bounds.y - 5, tooltipText.bounds.width + 10, tooltipText.bounds.height + 10);
            tooltip.fillColor = cColors.tooltipFillColor;
            tooltip.strokeColor = cColors.tooltipColor;

            gTooltipGroup.addChild(tooltip);
            tooltip.moveBelow(tooltipText);
            gTooltipGroup.bringToFront();
        } else {
            gTooltipGroup.removeChildren();
        }
    };

    gTool.onMouseDown = function (event) {
        if (event.point.y < cNumberOfActiveTapeChannels * (cChannelStrokeWidth + cFillerStrokeWidth) + (cChannelStrokeWidth + cFillerStrokeWidth)) { //if in the top mulitrack area
            //determine channel clicked
            var availableChannelsIndex = Math.round((event.point.y - cChannelStrokeWidth / 2) / (cChannelStrokeWidth + cFillerStrokeWidth));
            availableChannelsIndex = availableChannelsIndex > cNumberOfActiveTapeChannels - 1 ? cNumberOfActiveTapeChannels - 1 : availableChannelsIndex;
            availableChannelsIndex = availableChannelsIndex < 0 ? 0 : availableChannelsIndex;
            var hoverChannelNum = 'ch' + cAvailableChannelsArray[availableChannelsIndex];

            gActiveChannel = parseInt(hoverChannelNum.substr(2, 2));
            loadChannelSoundfile();

            //set GET
            var mouseGEToffset = event.point.x - Math.round($(window).width() / 2);
        } else { //if in the wav form area
            mouseGEToffset = (event.point.x - Math.round($(window).width() / 2)) * gWaveform512.seconds_per_pixel;
        }
        gCurrGETSeconds = gCurrGETSeconds + mouseGEToffset;
        gCurrGETSeconds = gCurrGETSeconds < cCountdownSeconds * -1 ? cCountdownSeconds * -1 : gCurrGETSeconds;
        if (gCurrGETSeconds > (cMissionDurationSeconds - cCountdownSeconds)) {
            gCurrGETSeconds = cMissionDurationSeconds - cCountdownSeconds;
        }
        gLastRoundedGET = Math.round(gCurrGETSeconds);

        playFromCurrGET();
        drawChannels(true);
        gWaveformRefresh = true;
        drawTimeCursor();

    };

    paper.view.onFrame = function(event) {
        if (!gPlayer.paused && !gSliderDragging) {

            // SYNC WITH PARENT GET CLOCK
            if (parent.gCurrMissionTime !== '' && parent.gCurrMissionTime !== undefined) {
                var parentMissionTimeSeconds = timeStrToSeconds(parent.gCurrMissionTime);
                if (parentMissionTimeSeconds >= gCurrGETSeconds - 1 && parentMissionTimeSeconds <= gCurrGETSeconds + 1) {
                    // then we're close enough, don't correct the time
                } else {
                    if (parentMissionTimeSeconds !== NaN) {
                        gCurrGETSeconds = parentMissionTimeSeconds;

                        loadChannelSoundfile();
                        gWaveformRefresh = true;

                        playFromCurrGET();
                        drawChannels(true);
                        drawTimeCursor();
                    } else {
                        trace("parentMissionTimeSeconds is NaN!");
                    }
                }
            }

            var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
            var currSeconds = gPlayer.currentTime;
            currSeconds = currSeconds === undefined ? 0 : currSeconds;
            gCurrGETSeconds = currSeconds + timeStrToSeconds(tapeData[2]);

            var slider = document.getElementById("myRange");
            slider.value = (((gCurrGETSeconds + cCountdownSeconds) * 99) / cMissionDurationSeconds);

            var missionTimeDisplay = document.getElementById("missionTimeDisplay");
            missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);
            gLastRoundedGET = Math.round(gCurrGETSeconds);

            //trace(parent.gCurrMissionTime);

            drawChannels(false);
            drawTimeCursor();

            if (gWavDataLoaded) {
                if (gWaveformRefresh || gCurrGETSeconds > gLastWaveformFullDrawGET + ($(window).width() * gWaveform512.seconds_per_pixel)) {
                    gWaveformRefresh = false;
                    gLastWaveformFullDrawGET = gCurrGETSeconds;
                    gLastWaveformOnFrameGET = gCurrGETSeconds;
                    gPaperWaveformGroup.removeChildren();

                    var wavePath1 = new paper.Path({
                        strokeWidth: 0.1,
                        strokeColor: cColors.activeLineSelectedChannel,
                        fillColor: cColors.activeLineSelectedChannel,
                        name: "wav"
                    });

                    var offsetStart = Math.round(gPlayer.currentTime * gWaveform512.pixels_per_second) - Math.round($(window).width() / 2);
                    var lineXVal = Math.round($(window).width() / 2);
                    if (offsetStart < 0) {
                        gWaveformRefresh = true;
                        lineXVal = Math.round($(window).width() / 2) + offsetStart;

                        // Draw play cursor over wav
                        var startPoint = new paper.Point(lineXVal + 0.5, cCanvasHeight - 100);
                        var endPoint = new paper.Point(lineXVal + 0.5, cCanvasHeight - 10);
                        var aLine = new paper.Path.Line(startPoint, endPoint);
                        aLine.strokeColor = cColors.cursorColor;
                        aLine.strokeWidth = 1;
                        aLine.name = "offsetCursor";

                        gTimeCursorGroup.addChild(aLine);

                        offsetStart = 0;
                    }
                    var offsetEnd = offsetStart + $(window).width() * 2;

                    gWaveform512.offset(offsetStart, offsetEnd);

                    gWaveform512.min.forEach(function (val, x) {
                        wavePath1.add(new Point(x + 0.1, interpolateHeight(cWavHeight, val) + 0.5 + cWavVerticaloffset));
                    });
                    gWaveform512.max.reverse().forEach(function (val, x) {
                        wavePath1.add(new Point(gWaveform512.offset_length - x - 0.5, interpolateHeight(cWavHeight, val) - 0.5 + cWavVerticaloffset));
                    });
                    // var wavePath1Raster = wavePath1.rasterize();
                    gPaperWaveformGroup.addChild(wavePath1);
                    gPaperWaveformGroup.moveBelow(gTimeCursorGroup);

                } else {
                    var pixelsToMove = (gLastWaveformOnFrameGET - gCurrGETSeconds) * gWaveform512.pixels_per_second;
                    gPaperWaveformGroup.translate(new Point(pixelsToMove, 0));
                    gLastWaveformOnFrameGET = gCurrGETSeconds;
                }

            }
        }
    };

    slider.onmousedown = function() {
        trace("slider mousedown");
        // gPeaksInstance.gPlayer.pause();
        // pauseAudio();
        gSliderDragging = true;
    };

    // Update the current slider value (each time you drag the slider handle)
    slider.oninput = function () {
        trace("slider oninput");
        var tempGET = (((this.value - 1) * cMissionDurationSeconds) / 99) - cCountdownSeconds;
        missionTimeDisplay.innerHTML = secondsToTimeStr(tempGET);
        // gLastRoundedGET = Math.round(tempGET);
    };

    slider.onmouseup = function() {
        trace("slider mouseup");

        gCurrGETSeconds = (((this.value - 1) * cMissionDurationSeconds) / 99) - cCountdownSeconds;
        missionTimeDisplay.innerHTML = secondsToTimeStr(gCurrGETSeconds);
        gLastRoundedGET = Math.round(gCurrGETSeconds);

        loadChannelSoundfile();
        gWaveformRefresh = true;

        playFromCurrGET();
        drawChannels(true);
        drawTimeCursor();

        gSliderDragging = false;
    };

    // On video playing toggle values
    gPlayer.onplaying = function() {
        gOnplaying = true;
        gOnpause = false;
    };

    // On video pause toggle values
    gPlayer.onpause = function() {
        gOnplaying = false;
        gOnpause = true;
    };

    gPaperWaveformGroup = new paper.Group;

    resizeAndRedrawCanvas();
    loadChannelSoundfile();
    playFromCurrGET();
    drawChannels(true);
    drawTimeCursor();
    // startInterval();

}

function loadChannelSoundfile() {
    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);

    if (tapeData.length !== 0 && tapeData[0] !== 'T999') {
        gActiveTape = tapeData[0];
        var channel = (gActiveChannel > 30) ? gActiveChannel - 30 : gActiveChannel;
        var filename = "defluttered_A11_" + tapeData[0] + "_" + tapeData[1] + "_CH" + channel;

        gPlayer.src = "/mp3/" + tapeData[0] + "_defluttered_mp3_16/" + filename + '.mp3';
        gPlayer.load();

        var datFile = "/mp3/" + tapeData[0] + "_defluttered_mp3_16/audiowaveform/" + filename + '.dat';

        trace("loading tape: " + filename + " :datFile: " + datFile);

        gWavDataLoaded = false;
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
        strokeColor: cColors.tooltipColor,
        strokeWidth: 0.1
    });
    channelText.content = cTrackInfo['ch' + gActiveChannel][0];
    channelText.point = new paper.Point(10, cCanvasHeight - 75);
    var cornerSize = new paper.Size(3, 3);

    var channelTextRect = new paper.Path.RoundRectangle(channelText.bounds, cornerSize);
    channelTextRect.strokeColor = cColors.tooltipColor;
    channelTextRect.fillColor = cColors.tooltipFillColor;
    channelTextRect.scale(1.1, 1.3);

    gChannelNameGroup.addChild(channelTextRect);
    gChannelNameGroup.addChild(channelText);

    document.getElementById("channelDescription").innerHTML = cTrackInfo['ch' + gActiveChannel][1];
}

function playFromCurrGET() {
    trace("playFromCurrGET()");
    // var sliderVal = $('#myRange').val();
    // var sliderMissionSeconds = (((sliderVal - 1) * cMissionDurationSeconds) / 99) - cCountdownSeconds;

    var tapeData = getTapeByGETseconds(gCurrGETSeconds, gActiveChannel);
    var tapeCueTimeSeconds = gCurrGETSeconds - timeStrToSeconds(tapeData[2]);

    // if (tapeData.length !== 0) {
    gPlayer.currentTime = tapeCueTimeSeconds;
    // gPlayer.play();
    playAudio();
    // }
}

//CANVAS ---

function drawChannels(forceRefresh) {
    var startGETSeconds = gCurrGETSeconds - Math.round($(window).width() / 2);
    var durationSeconds = $(window).width() * 2;

    var displayRangeStart = startGETSeconds + cCountdownSeconds;
    var displayRangeEnd = displayRangeStart + durationSeconds;

    if (displayRangeEnd > gTapesActivityArray.length - 1)
        displayRangeEnd = gTapesActivityArray.length - 1;

    if (forceRefresh || startGETSeconds > gLastChannelsFullDrawGET + $(window).width()) {
        gChannelLinesGroup.removeChildren();
        var partialSecond = startGETSeconds % 1;

        gLastChannelsFullDrawGET = startGETSeconds;
        gLastChannelsOnFrameGET = startGETSeconds;

        cAvailableChannelsArray.forEach(function (channelNum, x) {
            //get interval start/end based on GET

            var lineGroup = new paper.Group;
            var xCoord = partialSecond;
            var yCoord = x * (cChannelStrokeWidth + cFillerStrokeWidth) + cChannelStrokeWidth / 2;
            var currSegStart = -1;
            var prevXCoordActive = false;

            //draw inactive line background
            var inactiveLine = new paper.Path.Line({
                from: [xCoord, yCoord],
                to: [durationSeconds, yCoord],
                strokeWidth: cChannelStrokeWidth
                // name: 'ch' + channelCount
            });
            if (channelNum === gActiveChannel) {
                inactiveLine.strokeColor = cColors.inactiveLineSelectedChannel;
            } else {
                inactiveLine.strokeColor = cColors.inactiveLine;
            }
            lineGroup.addChild(inactiveLine);
            for (var i = Math.round(displayRangeStart); i <= displayRangeEnd; i++) {
                if (i >= 0) {
                    if (gTapesActivityArray[i].includes(channelNum)) {
                        if (!prevXCoordActive) {
                            currSegStart = xCoord;
                            prevXCoordActive = true;
                        }
                    } else {
                        if (prevXCoordActive) {
                            var aLine = new paper.Path.Line({
                                from: [currSegStart, yCoord],
                                to: [xCoord, yCoord],
                                strokeWidth: cChannelStrokeWidth
                                // name: "ch" + tapeChannelNum
                            });
                            if (channelNum === gActiveChannel) {
                                aLine.strokeColor = cColors.activeLineSelectedChannel;
                            } else {
                                aLine.strokeColor = cColors.activeLine;
                            }
                            lineGroup.addChild(aLine);
                            prevXCoordActive = false;
                        }
                    }
                }
                xCoord++;
            }
            if (prevXCoordActive) {
                aLine = new paper.Path.Line({
                    from: [currSegStart, yCoord],
                    to: [xCoord, yCoord],
                    strokeWidth: cChannelStrokeWidth
                    // name: "ch" + tapeChannelNum
                });
                if (channelNum === gActiveChannel) {
                    aLine.strokeColor = cColors.activeLineSelectedChannel;
                } else {
                    aLine.strokeColor = cColors.activeLine;
                }
                lineGroup.addChild(aLine);
            }

            lineGroup.name = 'ch' + channelNum;
            gChannelLinesGroup.addChild(lineGroup);

        });
    } else {
        var pixelsToMove = gLastChannelsOnFrameGET - startGETSeconds;
        gChannelLinesGroup.translate(new Point(pixelsToMove, 0));

        gLastChannelsOnFrameGET = startGETSeconds;
    }
}

function drawTimeCursor() {
    gTimeCursorGroup.removeChildren();
    var startPoint = new paper.Point($(window).width() / 2 + 0.5, 0);
    var endPoint = new paper.Point($(window).width() / 2 + 0.5, cCanvasHeight - 10);
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
    timeText.point = new paper.Point($(window).width() / 2 - timeText.bounds.width / 2, cCanvasHeight - 10);
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
            rec = tapeRanges[index];
            break;
        }
    }
    if (rec.length === 0) {
        trace("getTapeByGETseconds returing EMPTY rec");
    }
    // trace('getTapeByGETseconds: seconds:' + seconds + ' channel: ' + channel + ' tape: ' + rec[0]);
    return rec;
}

// Play video function
function playAudio() {
    if (gPlayer.paused && !gOnplaying) {
        gPlayer.play();
    }
}

// Pause video function
function pauseAudio() {
    if (!gPlayer.paused && !gOnpause) {
        gPlayer.pause();
    }
}

//------------ data import

function ajaxGetTapeRangeData() {
    var urlStr = "data/tape_ranges.csv";
    return $.ajax({
        type: "GET",
        url: urlStr,
        dataType: "text",
        async: false,
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

function ajaxGetTapesActivityData() {
    trace("ajaxGetTapeActivityData()");
    return $.ajax({
        type: "GET",
        url: "/mp3/tape_activity.json",
        dataType: "json",
        async: false,
        success: function(data) {
            trace ("ajaxGetTapeActivityData returned data");
            gTapesActivityArray = data;
        },
        error: function(xhr, ajaxOptions, thrownError){
            alert(xhr.status);
        }
    });
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
        gWavDataLoaded = true;
        // wavDataLoaded();
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
    var hours = parseInt(timeStr.substr(0,3));
    var minutes = parseInt(timeStr.substr(4,2));
    var seconds = parseInt(timeStr.substr(7,2));
    var signToggle = (sign == "-") ? -1 : 1;
    var totalSeconds = Math.round(signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds));
    //if (totalSeconds > 230400)
    //    totalSeconds -= 9600;
    return totalSeconds;
}

function timeStrToTimeId(timeStr) {
    return timeStr.split(":").join("");
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