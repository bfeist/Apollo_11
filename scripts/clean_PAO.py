import csv
import sys
import re
import datetime

output_file_name_and_path = "../MISSION_DATA/A11_PAO_cleaned.csv"
outputFile = open(output_file_name_and_path, "w")

inputFilePath = "../MISSION_DATA/PAO.txt"
with open(inputFilePath) as f:
    inputFile = f.readlines()
# remove whitespace characters like `\n` at the end of each line
inputFile = [x.strip() for x in inputFile]

GET = ''
nextLinePAO = False
for line in inputFile:
    GETSearchIndex = line.find("GET ")
    if GETSearchIndex > -1 and line.startswith('APOLLO 11 MISSION COMMENTARY'):
        GETEndIndex = line.find(" ", GETSearchIndex + 7)
        tMinusIndex = line.find("  T -")
        if tMinusIndex != -1:
            GET = line[tMinusIndex + 4:GETEndIndex]
        else:
            GET = line[GETSearchIndex + 4:GETEndIndex]
        if GET.count(':') == 1:  # add seconds to items with only minutes
            GET = GET + ':00'
        if GET.startswith('-'):
            pass
        timesplit = GET.split(':')
        GET = timesplit[0].zfill(3) + ':' + timesplit[1].zfill(2) + ':' + timesplit[2].zfill(2)
        # print GET + " -- " + line
    if nextLinePAO:
        outputLine = GET + "|PAO|" + line
        outputFile.write(outputLine + "\n")
        print outputLine
        nextLinePAO = False
    if line.startswith('PAO'):
        nextLinePAO = True
outputFile.close()
