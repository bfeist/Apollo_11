__author__ = 'Feist'
import requests
import re


def cleanseString(str):
    result = re.sub('</font>', '', str)
    result = re.sub('<font.+?>', '', result)
    result = re.sub('<\/*p>', '', result)
    result = re.sub('<\/*blockquote>', '', result)
    result = re.sub('<\/*br>', '', result)
    result = re.sub(' +', ' ', result).strip()
    return result


urlArray = ["https://www.hq.nasa.gov/office/pao/History/alsj/a11/images11.html"]
filename = "./data/scrape_alsj_image_page_cleaned_page_data.html"

outputFilePath = "../MISSION_DATA/scraped_photoinfo.csv"
outputFile = open(outputFilePath, "w")
outputFile.write("")
outputFile.close()
outputFile = open(outputFilePath, "a")

# for url in urlArray:
#     request = requests.get(url)
# pageAscii = request.text.encode('ascii', 'ignore').decode('ascii')
# lines = pageAscii.split("\r\r\n")

with open(filename, 'r') as content_file:
    content = content_file.read()

lines = content.splitlines()

gSectionStart = False  #tracks if we're in the right section of the page to start looking for images
itemStarted = False  #tracks if we've found a new filename and need to go through looking for everything else
blockquoteStarted = False #tracks if we're in the middle of gathering description data, including GET

image_name = ''
filename = ''
hrfilename = ''
timestamp = ''
description = ''

linecounter = 0
for line in lines:
    linecounter += 1
    if not gSectionStart:  #look for beginning of the section we're interested in
        start_match = re.search(r'<a name="Suit">', line)
        if start_match:
            gSectionStart = True
    else:
        if linecounter == 6337:
            print('test area')

        image_name_match = re.search(r'\s*?(<p> )?([[a-zA-Z0-9-\s\']+?)(\s\(OF300\))?\s\(\s(<a name)', line)
        if image_name_match is not None:
            # if len(new_image_name) < 17:  #try to catch bad filenames
            description = cleanseString(description)
            filename = hrfilename if hrfilename != '' else filename
            print(str(linecounter) + " GET: " + timestamp + " Name: " + image_name + " Filename: " + filename + " Description: " + description)
            outputFile.write(timestamp + "|" + image_name + "|" + filename + "|" + description + "\n")

            timestamp = ''
            image_name = ''
            filename = ''
            hrfilename = ''
            description = ''

            image_name = image_name_match.group(2).strip()
            itemStarted = True

        if itemStarted:
            file_name_match = re.search(r'href="(.+?.jpg)"', line)
            if file_name_match is not None:
                filename = file_name_match.group(1).strip()

            hrfile_name_match = re.search(r'href="(.+?HR.jpg)"', line)
            if hrfile_name_match is not None:
                hrfilename = hrfile_name_match.group(1).strip()

        if not blockquoteStarted:
            double_blockquote_match = re.search(r'<blockquote>(.*)</blockquote>', line)  #look for open and close blockquote on the same line
            if double_blockquote_match is not None:
                description = double_blockquote_match.group(1).strip()
            else:
                opening_blockquote_match = re.search(r'<blockquote>', line)
                if opening_blockquote_match is not None:  #if open blockquote found, start compiling description and looking for a GET
                    blockquoteStarted = True
                    description = line[opening_blockquote_match.end():].strip()

        else:
            closing_blockquote_match = re.search(r'</blockquote>', line)
            if closing_blockquote_match is not None:  #if blockquote ended, finish the description string and write record
                blockquoteStarted = False
                itemStarted = False
                description += " " + line[:closing_blockquote_match.start()].strip()
            else:
                description += " " + line.strip()

        GET_match = re.search(r'target="new">(.\d\d:\d\d:\d\d)</a>', line)
        if GET_match is not None:  #if a GET is found, finish the description string and save the timestamp
            timestamp = GET_match.group(1)

description = cleanseString(description)
filename = hrfilename if hrfilename != '' else filename
print(str(linecounter) + " GET: " + timestamp + " Name: " + image_name + " Filename: " + filename + " Description: " + description)
outputFile.write(timestamp + "|" + image_name + "|" + filename + "|" + description + "\n")
outputFile.close()
