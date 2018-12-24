import csv
import operator

# This script takes all of the results of commentary scraping and sorts it into a master file.
# The master file is used as a source by CreateAllHTML.py -- the main mission data build script

afjnewPath = "../MISSION_DATA/scraped_data/scraped_commentary_AFJ_fromnewstyle.csv"
afjoldPath = "../MISSION_DATA/scraped_data/scraped_commentary_AFJ_fromoldstyle.csv"
alsjPath = "../MISSION_DATA/scraped_data/scraped_commentary_ALSJ.csv"

tempRecord = []
allCommList = []

reader = csv.reader(open(afjnewPath, "rU"), delimiter='|')
for row in reader:
    tempRecord.clear()
    if row[0] != "":
        tempRecord.append(int(row[0].replace(":", "")))
        tempRecord.append(row[0])
        tempRecord.append("AFJ")
        tempRecord.append("")
        if row[1].endswith("</div>"):
            tempRecord.append(row[1][:-len('</div>')])
        else:
            tempRecord.append(row[1])
        allCommList.append(tempRecord.copy())

reader = csv.reader(open(afjoldPath, "rU"), delimiter='|')
for row in reader:
    tempRecord.clear()
    if row[0] != "":
        tempRecord.append(int(row[0].replace(":", "")))
        tempRecord.append(row[0])
        tempRecord.append("AFJ")
        tempRecord.append("")
        tempRecord.append(row[1])
        allCommList.append(tempRecord.copy())


reader = csv.reader(open(alsjPath, "rU"), delimiter='|')
for row in reader:
    tempRecord.clear()
    if row[0] != "":
        tempRecord.append(int(row[0].replace(":", "")))
        tempRecord.append(row[0])
        tempRecord.append("ALSJ")
        tempRecord.append(row[2])
        tempRecord.append(row[3])
        allCommList.append(tempRecord.copy())

allCommSorted = sorted(allCommList, key=operator.itemgetter(0))

output_file_name_and_path = "../MISSION_DATA/A11_merged_commentary.csv"
outputFile = open(output_file_name_and_path, "w")
outputFile.write('')
outputFile.close()

outputFile = open(output_file_name_and_path, "a")

for item in allCommSorted:
    outputLine = '{0}|{1}|{2}|{3}\n'.format(item[1], item[2], item[3], item[4])
    outputFile.write(outputLine)

outputFile.close()
print("done")
