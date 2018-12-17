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
    commentary = ''
    photosection = False
    photoList = []

    for line in lines:

        timestamp_match = re.search(r'a name="(\d{7})"', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            commentary = ''
            # print 'Timestamp found:', timestamp

        commentary_match = re.search(r'<div class="comment">(.*)</div>"', line)
        if commentary_match is not None:
            if 'omm break.' not in commentary_match.group(1):
                commentary += commentary_match.group(1).strip() + " "

        photosection_match = re.search(r'<div class="photo">', line)
        if photosection_match is not None:
            photosection = True
    else:
        big_photo_match = re.search(r'href="(.*)" target="new"', line)
        if big_photo_match is not None:
            big_photo_url = big_photo_match.group(1)

        photo_match = re.search(r'<img src="(.*)">', line)
        if photo_match is not None:
            sm_photo_url = photo_match.group(1)

        photoList.append(sm_photo_url + "|" + big_photo_url)


    print("************* DONE page:", url)
