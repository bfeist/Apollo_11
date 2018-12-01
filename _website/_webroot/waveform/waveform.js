var gWaveform;
var gPaperWaveformGroup;

$(document).ready(function(){
    paper.install(window);
    resizeAndRedrawCanvas();

    var url = '/mp3/T867_defluttered_mp3_16/audiowaveform/defluttered_A11_T867_HR1L_CH14.dat';
    ajaxGetWaveData(url);
});

function mainApplication() {
    var canvas = document.getElementById('myCanvas');
    var ctx = canvas.getContext('2d');
    ctx.lineWidth = 0.1;
    ctx.strokeStyle="green"; // Green path
    ctx.fillStyle="green";
    ctx.beginPath();

    // var resampled_waveform = gWaveform.resample({ width: canvas.width });
    var resampled_waveform = gWaveform.resample({ scale: 4096 });

    function interpolateHeight(total_height, size) {
        var amplitude = 256;
        return total_height - (size + 128) * total_height / amplitude;
    }

    resampled_waveform.min.forEach(function (val, x) {
        ctx.lineTo(x + 0.5, interpolateHeight(canvas.height, val) + 0.5);
    });

    resampled_waveform.max.reverse().forEach(function (val, x) {
        ctx.lineTo(resampled_waveform.offset_length - x - 0.5, interpolateHeight(canvas.height, val) - 0.5);
    });

    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    var canvas2 = document.getElementById('myCanvas2');
    paper.setup(canvas2);

    gPaperWaveformGroup = new paper.Group;
    var wavePath1 = new paper.Path({
        strokeWidth: 0.1,
        strokeColor: 'black',
        fillColor: 'black'
    });

    resampled_waveform.min.forEach(function (val, x) {
        wavePath1.add(new Point(x + 0.5, interpolateHeight(canvas.height, val) + 0.5));
    });
    resampled_waveform.max.reverse().forEach(function (val, x) {
        wavePath1.add(new Point(resampled_waveform.offset_length - x - 0.5, interpolateHeight(canvas.height, val) - 0.5));
    });

    paper.view.draw();
}

function ajaxGetWaveData(url) {
    const xhr = new XMLHttpRequest();
// .dat file generated by audiowaveform program
    xhr.responseType = 'arraybuffer';
    xhr.open("GET", url);

    xhr.addEventListener('load', function (progressEvent) {
        gWaveform = WaveformData.create(progressEvent.target);

        trace("APPREADY: gWaveform Ajax loaded");
        trace(gWaveform.duration);
        mainApplication();
    });
    xhr.send();
}

function resizeAndRedrawCanvas()
{
    var canvas = document.getElementById('myCanvas');
    var canvas2 = document.getElementById('myCanvas2');
    var desiredWidth = $(window).width(); // For instance: $(window).width();
    var desiredHeight = 225; // For instance $('#canvasContainer').height();

    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
    canvas2.width = desiredWidth;
    canvas2.height = desiredHeight;
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