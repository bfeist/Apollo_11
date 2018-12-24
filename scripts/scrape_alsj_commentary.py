__author__ = 'Feist'
import requests
import re


def cleanseString(str):
    result = str.replace('<blockquote><i>', '')
    # result = result.replace('  ', ' ')
    # result = result.replace('[', '')
    result = re.sub('.*?\[', '', result)
    result = result.replace(']', '')
    result = result.replace('\n', ' ')
    name_match = re.search(r'<a name="\d{7}">(.*?)</a>', result)
    if name_match is not None:
        result = re.sub('<a name="\d{7}">.*?</a>', name_match.group(1), result)
    name_match = re.search(r'<a name=".*">(.*?)</a>', result)
    if name_match is not None:
        result = re.sub('<a name=".*?">.*?</a>', name_match.group(1), result)
    result = re.sub('<a name=".*?">', result, result)
    result = re.sub(' +', ' ', result).strip()
    return result


urlArray = ["a11.landing.html", "a11.postland.html", "a11.evaprep.html", "a11.step.html", "a11.mobility.html", "a11.clsout.html", "a11.posteva.html", "a11.launch.html"]

# urlArray = ["a11.landing.html"]

outputFilePath = "../MISSION_DATA/scraped_data/scraped_commentary_ALSJ.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    # page = requests.get('https://history.nasa.gov/afj/ap11fj/' + url)
    # pageAscii = page.text.encode('ascii', 'ignore')
    # lines = pageAscii.split('\r')

    request = requests.get('https://www.hq.nasa.gov/office/pao/History/alsj/a11/' + url)
    pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
    lines = pageAscii.split("\r\n")

    timestamp = ''
    gCommentaryStarted = False
    gCommentaryEnded = False
    gConcatenatedLine = ''
    linecounter = 0
    for line in lines:
        linecounter += 1
        if linecounter == 37:
            print('test area')
        timestamp_match = re.search(r'a name="(\d{7})"', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            timestamp = timestamp[0:3] + ":" + timestamp[3:5] + ":" + timestamp[5:7]

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
                    commentary = commentary.replace('<a href="', '<a href="http://www.hq.nasa.gov/alsj/a11/')
            commentary = commentary.replace('target="new"', 'target="alsj"')
            commentary = commentary.replace('&quot;', '"')

            CDRMatch = re.search(r'Armstrong.*?"', commentary)
            if CDRMatch:
                who = "CDR"
                commentary = '"' + commentary[CDRMatch.end():len(commentary)]
            LMPMatch = re.search(r'Aldrin.*?"', commentary)
            if LMPMatch:
                who = "LMP"
                commentary = '"' + commentary[LMPMatch.end():len(commentary)]
            CMPMatch = re.search(r'Collins.*?"', commentary)
            if CMPMatch:
                who = "CMP"
                commentary = '"' + commentary[CMPMatch.end():len(commentary)]
            source = 'ALSJ'
            if not any(re.findall(r'omm break.|ong pause', commentary, re.IGNORECASE)):
                commentary = cleanseString(commentary)
                print('commentary found:', timestamp, '|', who, '|', commentary)
                outputFile.write(timestamp + "|" + source + "|" + who + "|" + commentary + "\n")
                commentary = ''

        else:
            pass

    print("************* DONE page:", url)
