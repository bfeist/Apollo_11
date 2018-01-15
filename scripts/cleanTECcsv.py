import csv
import sys 
import re


def sterilize_token(token):
    bs0 = BadNumberSub(0, ["o","Q","O","C","X"])
    bs1 = BadNumberSub(1, ["i","J", "I","!","L","l"])
    bs4 = BadNumberSub(4, ["h", "^"])
    bs6 = BadNumberSub(6, ["b"])
    bs7 = BadNumberSub(7, ["?", "T"])
    bs8 = BadNumberSub(8, ["B"])
    bs9 = BadNumberSub(9, ["g"])

    tempToken = token

    for badSub in [ bs0, bs1, bs4, bs6, bs7, bs8, bs9 ]:
        for sub in badSub.badSubList:
            tempToken = tempToken.replace(sub, str(badSub.number))

    return tempToken


def scrub_timestamp(timestamp):
    values =  re.split(" ", timestamp);
    i = 0
    days = 0
    days = sterilize_token(values[i])
    i += 1
    hours = sterilize_token(values[i])
    i += 1
    minutes = sterilize_token(values[i])
    i += 1
    seconds = sterilize_token(values[i])

    cleanTimestamp = days + " " + hours + " " + minutes + " " + seconds

    testCleanTimestamp = cleanTimestamp.replace(' ', '')
    if not testCleanTimestamp.isdigit():
        print "Uncleanable timestamp: " + cleanTimestamp + " - " + timestamp

    return cleanTimestamp


class BadNumberSub:
    def __init__(self, number, badSubList):
        self.number = number
        self.badSubList = badSubList


def scrub_callsign(callsign):
    callsign = callsign.upper()
    callsign = callsign.strip()
    if callsign == "MCC":
        callsign = "CC"
    return callsign


pageCounter = 2
curRow = 0

output_file_name_and_path = "../MISSION_DATA/A11_TEC_cleaned.csv"
outputFile = open(output_file_name_and_path, "w")

callsignList = []
lastTimestamp = 0

inputFilePath = "../MISSION_DATA/tec.csv"
reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')
for row in reader:
    curRow += 1
    outputLine = '|||'
    #print(row)
    if len(row) == 1:
        outputLine = "||" + row[0] + "||\n"
    elif len(row) == 2 and row[1].startswith("BEGIN LUNAR"):
        outputLine = row[0] + "||" + row[1] + "||\n"
    elif row[2].startswith("Tape") and not row[2].startswith("Tape recorder") and not row[2].startswith("Tape?"):
        pagestart = row[2].find("Page")
        tapeNumber = row[2][:pagestart - 1]
        pageCounter = row[2][pagestart + 4:].strip()
        outputLine = "||{0}|Page {1}|\n".format(tapeNumber, pageCounter)
    elif row[0].startswith("Page") or row[2].startswith("Page"):
        print "-----------------------" + str(pageCounter)
    elif row[2] == '' or row[2] == 'APOLLO' or row[1] == 'APOLLO' or row[2] == 'END OF TAPE':
        pass
    elif row[0] == '':
        scrubbedCallsign = scrub_callsign(row[1])
        outputLine = '|{0}|{1}||\n'.format(scrubbedCallsign, row[2])
        pass
    else:
        scrubbedCallsign = scrub_callsign(row[1])
        curTimestamp = scrub_timestamp(row[0]).replace(' ', '')
        if not curTimestamp > lastTimestamp:
            print 'Timestamp out of order: Page{0} Timestamp:{1}'.format(pageCounter, row[0])
        lastTimestamp = curTimestamp

        outputLine = '{0}|{1}|{2}||\n'.format(scrub_timestamp(row[0]), scrubbedCallsign, row[2])

        # if curTimestamp != row[0]:
            # print "Timestamp scrubbed: " + outputLine.rstrip()

    outputFile.write(outputLine)
    # print outputLine
outputFile.close()
