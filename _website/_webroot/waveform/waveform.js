var gWaveform;
var gWaveform4096;
var gWaveform2048;
var gWaveform1024;
var gWaveform512;
var gPaperWaveformGroup;
var gTimeCursorGroup;
var gCurrGETSeconds = 500;
var gInterval;

var gLastPlayerTime;

const cColors = {
    activeLine: 'black',
    activeLineSelectedChannel: '#00FF00',
    inactiveLine: '#DDDDDD',
    inactiveLineSelectedChannel: '#cdffcc',
    fillerLine: '#FFFFFF',
    cursorColor: 'red',
    cursorFillColor: 'black',
    tooltipColor: 'black',
    tooltipFillColor: 'white'
};

$(document).ready(function(){
    paper.install(window);
    resizeAndRedrawCanvas();

    var url = '/mp3/T867_defluttered_mp3_16/audiowaveform/defluttered_A11_T867_HR1L_CH14.dat';
    ajaxGetWaveData(url);
});

$(window).resize(resizeAndRedrawCanvas);

function mainApplication() {
    // //--------------------------
    // var canvas = document.getElementById('myCanvas');
    // var ctx = canvas.getContext('2d');
    // ctx.lineWidth = 0.1;
    // ctx.strokeStyle = "green"; // Green path
    // ctx.fillStyle = "green";
    // ctx.beginPath();
    //
    // // var resampled_waveform = gWaveform.resample({ width: canvas.width });
    // var resampled_waveform = gWaveform.resample({ scale: 4096 });
    //
    // resampled_waveform.min.forEach(function (val, x) {
    //     ctx.lineTo(x + 0.5, interpolateHeight(canvas.height, val) + 0.5);
    // });
    //
    // resampled_waveform.max.reverse().forEach(function (val, x) {
    //     ctx.lineTo(resampled_waveform.offset_length - x - 0.5, interpolateHeight(canvas.height, val) - 0.5);
    // });
    //
    // ctx.closePath();
    // ctx.stroke();
    // ctx.fill();
    // //--------------------------

    var canvas = document.getElementById('myCanvas');
    paper.setup(canvas);

    gTimeCursorGroup = new paper.Group;
    gPaperWaveformGroup = new paper.Group;

    var audio = document.getElementById('audio-element');
    audio.currentTime = 500;
    audio.play();

    // startInterval();

    paper.view.onFrame = function(event) {
        // trace("interval firing");
        var canvas = document.getElementById('myCanvas');
        audio = document.getElementById('audio-element');
        gCurrGETSeconds = audio.currentTime;

        gPaperWaveformGroup.removeChildren();
        gTimeCursorGroup.removeChildren();

        var wavePath1 = new paper.Path({
            strokeWidth: 0.5,
            strokeColor: 'green',
            fillColor: 'green'
        });

        var offsetStart = Math.round(gCurrGETSeconds * gWaveform512.pixels_per_second) - Math.round(canvas.width / 2);
        var offsetEnd = offsetStart + canvas.width;

        gWaveform512.offset(offsetStart, offsetEnd);
        // trace("gWaveform offset_duration: " + gWaveform4096.offset_duration);

        gWaveform512.min.forEach(function (val, x) {
            wavePath1.add(new Point(x + 0.1, interpolateHeight(canvas.height, val) + 0.5));
        });
        gWaveform512.max.reverse().forEach(function (val, x) {
            wavePath1.add(new Point(gWaveform512.offset_length - x - 0.5, interpolateHeight(canvas.height, val) - 0.5));
        });
        // var wavePath1Raster = wavePath1.rasterize();
        gPaperWaveformGroup.addChild(wavePath1);

        var startPoint = new paper.Point(Math.round(canvas.width / 2) + 0.5, 0);
        var endPoint = new paper.Point(Math.round(canvas.width / 2) + 0.5, 210);
        var aLine = new paper.Path.Line(startPoint, endPoint);
        aLine.strokeColor = cColors.cursorColor;
        aLine.strokeWidth = 1;
        aLine.name = "timeCursor";
        gTimeCursorGroup.addChild(aLine);
    }
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
        mainApplication();
    });
    xhr.send();
}

function resizeAndRedrawCanvas() {
    var canvas = document.getElementById('myCanvas');
    var desiredWidth = $(window).width(); // For instance: $(window).width();
    var desiredHeight = 100; // For instance $('#canvasContainer').height();

    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
}

function interpolateHeight(total_height, size) {
    var amplitude = 256;
    return total_height - (size + 128) * total_height / amplitude;
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