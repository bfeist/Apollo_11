__author__ = 'Feist'
import requests
import re


def cleanseString(str):
    result = re.sub('<a name=".*"></a>', '', str)
    result = re.sub(' +', ' ', result).strip()
    return result


urlArray = ["08day3-africa-breakfast.html", "09day3-entering-eagle.html", "10day3-flight-plan-update.html", "11day4-loi1.html", "12day4-loi2.html", "13day4-eagle-checkout.html", "14day5-landing-prep.html", "15day5-undock-doi.html", "19day6-rendezvs-dock.html", "20day6-reboard-lmjett.html", "21day6-tei.html", "22day7-leave-lsi.html", "23day7-tv-food-prep.html", "24day8-news-checks.html", "25day8-reentry-stowage.html", "26day9-reentry.html"]

# urlArray = ["08day3-africa-breakfast.html"]

outputFilePath = "../MISSION_DATA/scraped_commentary_AFJ_fromoldstyle.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    # page = requests.get('https://history.nasa.gov/afj/ap11fj/' + url)
    # pageAscii = page.text.encode('ascii', 'ignore')
    # lines = pageAscii.split('\r')

    request = requests.get('https://history.nasa.gov/afj/ap11fj/' + url)
    pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
    lines = pageAscii.split("\r\n")

    timestamp = ''
    commentary = ''
    linecounter = 0
    commentary_multiline_started = False

    for line in lines:
        linecounter += 1
        if linecounter == 185:
            print('test area')
        timestamp_match = re.search(r'<b>(\d{3}:\d{2}:\d{2}).*</b>', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)

        commentary_match = re.search(r'<blockquote><font color="#000080"><i>\[(.*)\]', line)
        if commentary_match is not None:
            if not any(re.findall(r'omm break.|ong pause|href="audio', commentary_match.group(1), re.IGNORECASE)):
                commentary = cleanseString(commentary_match.group(1))
                print(str(linecounter) + " GET: " + timestamp + " Commentary: " + commentary)
                outputFile.write(timestamp + "|" + commentary + "\n")
                commentary = ''

    print("************* DONE page:", url)
outputFile.close()