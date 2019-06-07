<html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <link rel="copyright" href="http://creativecommons.org/licenses/by-nc-sa/3.0/" />

    <title>Apollo 11 in Real-time</title>
    <link rel="image_src" href="https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Apollo_11_insignia.png/761px-Apollo_11_insignia.png" / >
    <meta name="description" content="A real-time interactive journey through the Apollo 11 mission. Relive every moment as it occurred in 1969." />

    <meta property="fb:app_id" content="2082429458513047" />
    <meta property="og:title" content="Apollo 11 in Real-time" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://apolloinrealtime.org/11/img/screenshot.png" />
    <meta property="og:url" content="https://apolloinrealtime.org/" />
    <meta property="og:description" content="A real-time interactive journey through the Apollo 11 mission. Relive every moment as it occurred in 1969." />
    <meta property="og:site_name" content="Apollo 11 in Real-time" />

    <link rel="apple-touch-icon" sizes="180x180" href="favicons/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="favicons/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="favicons/favicon-16x16.png">
    <link rel="manifest" href="favicons/site.webmanifest">
    <link rel="mask-icon" href="favicons/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">

    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="msapplication-TileImage" content="favicons/mstile-144x144.png">
    <meta name="msapplication-config" content="favicons/browserconfig.xml">
    <meta name="theme-color" content="#000000">

    <meta name="robots" content="index,follow" />

    <?php include "inc/style_tags.html" ?>
    
    <script type="text/javascript" src="https://www.youtube.com/iframe_api"></script>
    <script>
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

        ga('create', 'UA-37086725-6', 'auto');
        ga('send', 'pageview');
    </script>
    <script type="text/javascript" src="lib/webfontloader.js"></script>
<!--    <script type="text/javascript" src="lib/jquery-2.1.4.min.js"></script>-->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.js"></script>
    <script type="text/javascript" src="lib/jquery_plugins.js"></script>
    <script type="text/javascript" src="lib/jquery.fullscreen.js"></script>
    <script type="text/javascript" src='lib/jquery.lazyload.js'></script>
    <script type="text/javascript" src="lib/paper-full.min.js"></script>
    <script type="text/javascript" src="lib/date.js"></script>
    <script type="text/javascript" src='lib/jquery.waitforimages.min.js'></script>
    <script type="text/javascript" src='lib/size_manager.js'></script>
    <script type="text/javascript" src='lib/help_overlay_manager.js'></script>
    <script type="text/javascript" src='lib/modemizr.js'></script>
    <script type="text/javascript" src="navigator.js"></script>
    <script type="text/javascript" src="index.js"></script>
    <script type="text/javascript" src="ajax.js"></script>

</head>
<body>

  <?php include "inc/app.html"; ?>

  <?php include "inc/splash.html"; ?>

  <?php include "inc/help_about.html"; ?>

</body>

<script type="text/html" id="photoTemplate">
    <div class="imageBlock">
        <div class="imageContainer" style="background-image: url('@imageURL')">

            <a href="@imageURL" target="photowindow">
                <img src="img/placeholder-square.png" class="aspect-holder">
            </a>

            <div id="imageOverlay">
                <div class="photodivcaption">@caption</div>
                <table class="photoTable">
                    <tr>
                        <td>
                            <div>Mission Time Taken:</div>
                            <div>@timeStr</div>
                        </td>
                        <td>
                            <div>Photo:</div>
                            <div>@photo_name</div>
                        </td>
                        <td>
                            <div>Source:</div>
                            <div>@source</div>
                        </td>
                    </tr>
                </table>
            </div>

        </div>
    </div>
</script>

<script type="text/html" id="utteranceTemplate">
    <tr class="utterance utt_pao uttid@uttid" id="uttid@uttid" style="@style" onclick="seekToTime('@uttid')">
        <td class="timestamp">@timestamp</td>
        <td class="who @uttType">@who</td>
        <td class="spokenwords @uttType">@words</td>
    </tr>
</script>

<script type="text/html" id="commentaryTemplate">
    <tr class="commentary utt_pao comid@comid" id="comid@comid" onclick="seekToTime('@comid')" >
        <td class="timestamp">@timestamp</td>
        @whocell
        @wordscell
    </tr>
</script>

<script type="text/html" id="photoGalleryTemplate">
    <div class="galleryItemContainer" id="gallerytimeid@timeid" onclick="galleryClick('@timeid')">
        <img class="galleryImage" data-original="@imageURL">
        <div class="galleryOverlay">@timestamp</div>
    </div>
</script>

<script type="text/html" id="searchResultTemplate">
    <tr class="utterance utt_pao" style="@style" onclick="searchResultClick('@searchResultid', '@entrytypevar')">
        <td class="timestamp">@timestamp<BR>@entrytype</td>
        <td class="who @uttType">@who</td>
        <td class="spokenwords @uttType"> @words</td>
    </tr>
</script>

<script type="text/html" id="geosampleTemplate">
    <div class="sampleframe">
        <div class="sampletitle">Sample @samplenumber</div>
        <div class="samplesubtitle"><a href="http://moondb.org" target="_blank"><img src="./img/moondb-logo.png" height="25px"></a> Sample Information</div>
        <div class="externallinks" id="externallinks@samplenumber">
            <table class='sampleinfotable'>
                <tr>
                    <td>External links</td>
                    <td colspan="3">
                        <span><a href='https://curator.jsc.nasa.gov/lunar/samplecatalog/sampleinfo.cfm?sample=@samplenumber' target='geoImage'>Lunar Sample Curation Info</a></span>
                        @geocompendium
                    </td>
                </tr>
            </table>
        </div>
        <div class="moondb" id="moondb@samplenumber"></div>
        <div class="geoImages" id="geoImages@samplenumber"></div>
        <div class="geoPapers" id="geoPapers@samplenumber">@papers</div>
    </div>
</script>

<script type="text/html" id="MOCROverlayTemplate">
    <div class="thirtytrack-overlay">
        <iframe id="MOCRvizIframe" src="./MOCRviz/MOCRviz.html?v=0.1&ch=@ch" style="display: block; width: 100%; height: 100%; border: none;"></iframe>
    </div>
</script>

</html>