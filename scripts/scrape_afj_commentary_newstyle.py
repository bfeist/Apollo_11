__author__ = 'Feist'
import requests
import re


def cleanseString(str):
    result = re.sub('<a name=".*"></a>', '', str)
    result = re.sub(' +', ' ', result).strip()
    return result


urlArray = ["01launch.html", "02earth-orbit-tli.html", "03tde.html", "04nav-housekeep.html", "05day2-mcc.html", "06day2-tv.html", "07day2-laser.html", "08day3-africa-breakfast.html", "09day3-entering-eagle.html", "10day3-flight-plan-update.html", "11day4-loi1.html", "12day4-loi2.html", "13day4-eagle-checkout.html", "14day5-landing-prep.html", "15day5-undock-doi.html", "19day6-rendezvs-dock.html", "20day6-reboard-lmjett.html", "21day6-tei.html", "22day7-leave-lsi.html", "23day7-tv-food-prep.html", "24day8-news-checks.html", "25day8-reentry-stowage.html", "26day9-reentry.html"]

# urlArray = ["01launch.html"]

outputFilePath = "../MISSION_DATA/commentaryAFJ_fromnewstyle.csv"
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
        if linecounter == 243:
            print('test area')
        timestamp_match = re.search(r'a name="(\d{7})"', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            timestamp = timestamp[0:3] + ":" + timestamp[3:5] + ":" + timestamp[5:7]

        if commentary_multiline_started:
            commentary_closing_match = re.search(r'(.*)</div>', line)
            if commentary_closing_match is not None:
                commentary += commentary_closing_match.group(1).strip() + " "
                commentary_multiline_started = False
                commentary = cleanseString(commentary)
                print(str(linecounter) + " GET: " + timestamp + " Commentary: " + commentary)
                outputFile.write(timestamp + "|" + commentary + "\n")
                commentary = ''
            else:
                commentary += line.strip() + " "

        commentary_match = re.search(r'<div class="comment">(.*)', line)
        if commentary_match is not None:
            commentary_single_line_match = re.search(r'<div class="comment">(.*)</div>', line)
            if commentary_single_line_match is not None:
                if 'omm break.' not in commentary_match.group(1):
                    commentary = commentary_match.group(1).strip()
                    commentary = cleanseString(commentary)
                    print(str(linecounter) + " GET: " + timestamp + " Commentary: " + commentary)
                    outputFile.write(timestamp + "|" + commentary + "\n")
                    commentary = ''
            else:
                commentary_multiline_started = True
                commentary += commentary_match.group(1).strip() + " "

    print("************* DONE page:", url)
outputFile.close()