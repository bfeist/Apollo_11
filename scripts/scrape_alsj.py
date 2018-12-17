__author__ = 'Feist'
import requests
import re

urlArray = ["01launch.html", "02earth-orbit-tli.html", "03tde.html", "04nav-housekeep.html", "05day2-mcc.html", "06day2-tv.html", "07day2-laser.html", "08day3-africa-breakfast.html", "09day3-entering-eagle.html", "10day3-flight-plan-update.html", "11day4-loi1.html", "12day4-loi2.html", "13day4-eagle-checkout.html", "14day5-landing-prep.html", "15day5-undock-doi.html", "19day6-rendezvs-dock.html", "20day6-reboard-lmjett.html", "21day6-tei.html", "22day7-leave-lsi.html", "23day7-tv-food-prep.html", "24day8-news-checks.html", "25day8-reentry-stowage.html", "26day9-reentry.html"]

urlArray = ["01launch.html"]

outputFilePath = "../MISSION_DATA/commentaryALSJ.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    page = requests.get('https://history.nasa.gov/afj/ap11fj/' + url)
    pageAscii = page.text.encode('ascii', 'ignore')
    lines = pageAscii.split('\r')
    timestamp = ''
    gCommentaryStarted = False
    gCommentaryEnded = False
    gConcatenatedLine = ''
    for line in lines:
        timestamp_match = re.search(r'a name="(\d{7})"', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            # print 'Timestamp found:', timestamp

        commentarySegment = ''

        commentaryStartMatch = re.search(r'\[', line)
        if commentaryStartMatch:
            gCommentaryStarted = True
            gConcatenatedLine = ''

        commentaryEndMatch = re.search(r'\]', line)
        if commentaryEndMatch:
            gCommentaryEnded = True
            commentarySegment = line[:commentaryEndMatch.end() - 1]

        if gCommentaryStarted and not gCommentaryEnded:
            commentarySegment = line + ' '

        commentarySegment = commentarySegment.replace('<blockquote><i>', '')
        commentarySegment = commentarySegment.replace('  ', ' ')
        commentarySegment = commentarySegment.replace('[', '')
        commentarySegment = commentarySegment.replace(']', '')
        commentarySegment = commentarySegment.replace('\n', ' ')
        gConcatenatedLine = gConcatenatedLine + commentarySegment

        if gCommentaryStarted & gCommentaryEnded:
            gCommentaryStarted = False
            gCommentaryEnded = False
            commentary = gConcatenatedLine
            gConcatenatedLine = ''
            who = ''
            urlMatch = re.search(r'<a href=".*"', commentary)
            if urlMatch:
                if commentary[urlMatch.start()+9:urlMatch.start()+11] == "..":
                    commentary = commentary.replace('<a href="../', '<a href="http://www.hq.nasa.gov/alsj/')
                elif commentary[urlMatch.start()+9:urlMatch.start()+13] == "http":
                    pass
                else:
                    commentary = commentary.replace('<a href="', '<a href="http://www.hq.nasa.gov/alsj/a17/')
            commentary = commentary.replace('target="new"', 'target="alsj"')
            commentary = commentary.replace('&quot;', '"')

            whoMatch = re.match('Cernan|Schmitt|Evans', commentary)
            # source = 'Eric Jones, <a href="http://www.hq.nasa.gov/alsj/a17/a17.html" target="alsj">ALSJ</a>'
            source = 'Eric Jones, ALSJ'
            if whoMatch:
                commentary = commentary[whoMatch.end() + 1 : len(commentary) - 1]
                if "Cernan" in whoMatch.group():
                    who = "Cernan"
                    source = "ALSJ"
                elif "Schmitt" in whoMatch.group():
                    who = "Schmitt"
                    source = "ALSJ"
                elif "Evans" in whoMatch.group():
                    who = "Evans"
                    source = "ALSJ"

            print 'commentary found:', timestamp, '|', who, '|', commentary
            outputFile.write(timestamp + "|" + source + "|" + who + "|" + commentary + "\n")
        else:
            pass

    print "************* DONE page:", url
