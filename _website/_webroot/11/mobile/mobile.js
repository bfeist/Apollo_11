//constants
var cMissionDurationSeconds = 713311;
var cCountdownSeconds = 74768;
var cDefaultStartTimeId = '-000109';
var cLaunchDate = Date.parse("1969-07-16 9:33 -500");
var cCountdownStartDate = Date.parse("1969-07-15 1:46:57 -500");

var gCurrMissionTime = '';
var gActiveChannel = '15';
var gMobileSite = true;
var gPlaybackState = 'paused';

//non-mobile detect and redirect
if(! /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    var url = "..";
    $(location).attr('href',url);
}

$(document).ready(function() {
    var t = getUrlParameter('t');
    if (typeof t !== "undefined") {
        gCurrMissionTime = t;
        $('#button1m').css("display", "none");
    } else {
        gCurrMissionTime = timeIdToTimeStr(getNearestHistoricalMissionTimeId());
    }

    var ch = getUrlParameter('ch');
    if (typeof ch !== "undefined") {
        gActiveChannel = ch;
    }

    displayHistoricalTimeDifferenceByTimeId(timeStrToTimeId(gCurrMissionTime));
    setTimeUpdatePoller();

    // var splashLayerSelector = document.querySelectorAll('.splash-content');
    // splashLayerSelector[0].addEventListener('click', function() {
    //     var html = $('#MOCROverlayTemplate').html();
    //     $('#thirtytrack-iframe').append(html);
    //
    //     $('.splash-content').hide();
    // });

    var playPauseBtn = document.getElementById('playPauseBtn');
    playPauseBtn.onclick = function () {
            // var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
            if ($("#playPauseBtn").hasClass('pause')) {
                ga('send', 'event', 'button', 'click', 'pause');
                gPlaybackState = 'paused';
                // MOCRvizIframeSelector.contentWindow.gPlayer.pause();
                // $('#playPauseBtn').addClass("blink_me_orange");
                $("#playPauseBtn").removeClass('pause');
            } else {
                ga('send', 'event', 'button', 'click', 'play');
                // MOCRvizIframeSelector.contentWindow.gPlayer.play();
                // $('#playPauseBtn').removeClass("blink_me_orange");
                $("#playPauseBtn").addClass('pause');
                gPlaybackState = 'normal';
            }
        };
});

function setTimeUpdatePoller() {
    return window.setInterval(function () {
        // gCurrMissionTime = secondsToTimeStr(MOCRvizIframeSelector.contentWindow.gCurrGETSeconds);
        gCurrMissionTime = secondsToTimeStr(timeStrToSeconds(gCurrMissionTime) + 1);
        displayHistoricalTimeDifferenceByTimeId(timeStrToTimeId(gCurrMissionTime));
    }, 1000);
}

// function seekToTime(timeId) {
//     gCurrMissionTime = timeIdToTimeStr(timeId);
//
// }

function launchButtonClick() {
    $('.splash-content').hide();
    var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
    gCurrMissionTime = '-00:01:05';
    MOCRvizIframeSelector.contentWindow.gCurrGETSeconds = timeStrToSeconds(gCurrMissionTime);
    MOCRvizIframeSelector.contentWindow.gActiveChannel = gActiveChannel;
    MOCRvizIframeSelector.contentWindow.loadChannelSoundfile();
    MOCRvizIframeSelector.contentWindow.playFromCurrGET();
    MOCRvizIframeSelector.contentWindow.refreshTapeActivityDisplay(true);
    MOCRvizIframeSelector.contentWindow.gWaveformRefresh = true;
    gPlaybackState = 'normal';
}

function historicalButtonClick() {
    $('.splash-content').hide();
    var MOCRvizIframeSelector = $('#MOCRvizIframe')[0];
    MOCRvizIframeSelector.contentWindow.gCurrGETSeconds = timeStrToSeconds(gCurrMissionTime);
    MOCRvizIframeSelector.contentWindow.gActiveChannel = gActiveChannel;
    MOCRvizIframeSelector.contentWindow.loadChannelSoundfile();
    MOCRvizIframeSelector.contentWindow.playFromCurrGET();
    MOCRvizIframeSelector.contentWindow.refreshTapeActivityDisplay(true);
    MOCRvizIframeSelector.contentWindow.gWaveformRefresh = true;
    gPlaybackState = 'normal';
}

function getNearestHistoricalMissionTimeId() { //proc for "snap to real-time" button
    //var nowDate = Date.parse("2015-12-06 10:00pm -500");
    var nowDate = Date.now();
    var histDate = new Date(nowDate.getTime());
    //if (histDate.dst()) {
    //    histDate.setHours(histDate.getHours() + 1); //TODO test DST offset
    //}
    histDate.setMonth(cCountdownStartDate.getMonth());
    histDate.setYear(cCountdownStartDate.getYear());

    var dayOfMonth = 0;
    if (nowDate.getDate() < 9) {
        dayOfMonth = nowDate.getDate() + 15;
    } else if (nowDate.getDate() >= 9 && nowDate.getDate() < 15) {
        dayOfMonth = nowDate.getDate() + 9;
    } else if (nowDate.getDate() > 24) {
        dayOfMonth = nowDate.getDate() - 9;
    } else {
        dayOfMonth = nowDate.getDate()
    }
    histDate.setDate(dayOfMonth);

    if (histDate < cLaunchDate) { //bump to same time next day if in the few hours on the 15th before recording starts
        histDate.setDate(16);
    }

    // Convert dates to milliseconds
    var histDate_ms = histDate.getTime();
    var countdownStartDate_ms = cCountdownStartDate.getTime();
    var launchDate_ms = cLaunchDate.getTime();

    if (histDate_ms < countdownStartDate_ms) { //if now is before the countdownStartDate, shift forward days to start on first day of the mission
        var daysToMoveForward = 1;
        histDate_ms += (1000 * 60 * 60 * 24) * daysToMoveForward;
    } else if (histDate_ms > launchDate_ms + (cMissionDurationSeconds * 1000)) { //hist date occurs after mission ended, shift backward days to start on first day of the mission
        var daysToMoveBackward = 1;
        histDate_ms -= (1000 * 60 * 60 * 24) * daysToMoveBackward;
    }

    var timeSinceLaunch_ms = histDate_ms - launchDate_ms;
    return secondsToTimeId(timeSinceLaunch_ms / 1000);
}

function displayHistoricalTimeDifferenceByTimeId(timeId) {
    //trace("displayHistoricalTimeDifferenceByTimeId():" + timeid);

    var sign = timeId.substr(0,1);
    var hours = Math.abs(parseInt(timeId.substr(0,3)));
    var minutes = parseInt(timeId.substr(3,2));
    var seconds = parseInt(timeId.substr(5,2));

    var conversionMultiplier = 1;
    if (sign === "-") { //if on countdown, subtract the mission time from the launch moment
        conversionMultiplier = -1;
    }

    var timeidDate = new Date(cLaunchDate.getTime());

    timeidDate.add({
        hours: hours * conversionMultiplier,
        minutes: minutes * conversionMultiplier,
        seconds: seconds * conversionMultiplier
    });

    var historicalDate = new Date(timeidDate.getTime()); //for display only
    $(".historicalDate").text(historicalDate.toDateString());

    var options = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    $(".historicalTime").text(historicalDate.toLocaleTimeString('en-US', options));

    // $(".missionElapsedTime").text(gCurrMissionTime);
}

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

function secondsToTimeId(seconds) {
    var timeId = secondsToTimeStr(seconds).split(":").join("");
    return secondsToTimeStr(seconds).split(":").join("");
}

function timeIdToSeconds(timeId) {
    var sign = timeId.substr(0,1);
    var hours = parseInt(timeId.substr(0,3));
    var minutes = parseInt(timeId.substr(3,2));
    var seconds = parseInt(timeId.substr(5,2));
    var signToggle = (sign === "-") ? -1 : 1;
    var totalSeconds = signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds);
    //if (totalSeconds > 230400)
    //    totalSeconds -= 9600;
    return totalSeconds;
}

function timeIdToTimeStr(timeId) {
    return timeId.substr(0,3) + ":" + timeId.substr(3,2) + ":" + timeId.substr(5,2);
}

function timeStrToTimeId(timeStr) {
    return timeStr.split(":").join("");
}

function timeStrToSeconds(timeStr) {
    var sign = timeStr.substr(0,1);
    var hours = parseInt(timeStr.substr(0,3));
    var minutes = parseInt(timeStr.substr(4,2));
    var seconds = parseInt(timeStr.substr(7,2));
    var signToggle = (sign === "-") ? -1 : 1;
    var totalSeconds = Math.round(signToggle * ((Math.abs(hours) * 60 * 60) + (minutes * 60) + seconds));
    return totalSeconds;
}

function padZeros(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};