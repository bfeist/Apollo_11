__author__ = 'Feist'
import requests
import re

urlArray = ["43-t.html"]

# urlArray = ["01launch.html"]

outputFilePath = "../MISSION_DATA/scraped_data/scraped_photoindex_AFJ.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

for url in urlArray:
    request = requests.get('https://history.nasa.gov/afj/ap11fj/photos/' + url)
    pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
    lines = pageAscii.split("\r\n")

    nextLineCaption = False
    linecounter = 0

    for line in lines:
        linecounter += 1
        if linecounter > 47:
            if nextLineCaption == True:
                captionMatch = re.search(r'(.*)<br>', line)
                if captionMatch is not None:
                    caption = captionMatch.group(1)
                    nextLineCaption = False
                    print(str(linecounter) + " photoName: " + photoName + " caption: " + caption)
                    outputFile.write("|" + photoName + "||" + caption + "\n")

            photoNameMatch = re.search(r'(AS11-\d\d-\d\d\d\d)<br>', line)
            if photoNameMatch is not None:
                photoName = photoNameMatch.group(1)

            match = re.search(r'print resolution</a>.<br>', line)
            if match is not None:
                nextLineCaption = True

    print("************* DONE page:", url)
outputFile.close()
