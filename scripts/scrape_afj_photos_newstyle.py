__author__ = 'Feist'
import requests
import re

urlArray = ["01launch.html", "02earth-orbit-tli.html", "03tde.html", "04nav-housekeep.html", "05day2-mcc.html", "06day2-tv.html", "07day2-laser.html", "08day3-africa-breakfast.html", "09day3-entering-eagle.html", "10day3-flight-plan-update.html", "11day4-loi1.html", "12day4-loi2.html", "13day4-eagle-checkout.html", "14day5-landing-prep.html", "15day5-undock-doi.html", "19day6-rendezvs-dock.html", "20day6-reboard-lmjett.html", "21day6-tei.html", "22day7-leave-lsi.html", "23day7-tv-food-prep.html", "24day8-news-checks.html", "25day8-reentry-stowage.html", "26day9-reentry.html"]

# urlArray = ["01launch.html"]

outputFilePath = "../MISSION_DATA/scraped_data/scraped_photoinfo_AFJ_newstyle.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    request = requests.get('https://history.nasa.gov/afj/ap11fj/' + url)
    pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
    lines = pageAscii.split("\r\n")

    timestamp = ''
    photosection = False
    linecounter = 0

    for line in lines:
        linecounter += 1
        if linecounter == 608:
            print('test area')
        timestamp_match = re.search(r'a name="(\d{7})"', line)
        if timestamp_match is not None:
            timestamp = timestamp_match.group(1)
            timestamp = timestamp[0:3] + ":" + timestamp[3:5] + ":" + timestamp[5:7]

        if photosection:
            big_photo_match = re.search(r'href="(.*)" target="new"', line)
            if big_photo_match is not None:
                big_photo_url = big_photo_match.group(1)
                if big_photo_url[:4] != 'http':
                    big_photo_url = 'https://history.nasa.gov/afj/ap11fj/' + big_photo_url

            photo_match = re.search(r'<img src="(.*.jpg)"', line)
            if photo_match is not None:
                sm_photo_url = photo_match.group(1)
                if sm_photo_url[:4] != 'http':
                    sm_photo_url = 'https://history.nasa.gov/afj/ap11fj/' + sm_photo_url

            caption_match = re.search(r'<div class="caption">(.*)</div>', line)
            if caption_match is not None:
                if " - " in caption_match.group(1):
                    captionObj = caption_match.group(1).split(' - ')
                    photoname = captionObj[0]
                    caption = captionObj[1]
                else:
                    photoname = ''
                    caption = caption_match.group(1)

                print(str(linecounter) + " timestamp: " + timestamp + " photoname: " + photoname + " small: " + sm_photo_url + " big: " + big_photo_url + " caption: " + caption)
                outputFile.write(timestamp + "|" + photoname + "|" + sm_photo_url + "|" + big_photo_url + "|" + caption + "\n")
                photosection = False

        photosection_match = re.search(r'<div class="photo">', line)
        if photosection_match is not None:
            photosection = True
            big_photo_url = ''
            sm_photo_url = ''

    print("************* DONE page:", url)
outputFile.close()
