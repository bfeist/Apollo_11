import csv
import operator

tecFilePath = "../MISSION_DATA/A11_TEC_cleaned_phase2.csv"
onboardFilePath = "../MISSION_DATA/A11_onboard_cleaned.csv"
paoFilePath = "../MISSION_DATA/A11_PAO_cleaned.csv"

tempRecord = []
allCommList = []

reader = csv.reader(open(tecFilePath, "rU"), delimiter='|')
for row in reader:
    tempRecord.clear()
    if row[0] != "":
        tempRecord.append(int(row[0].replace(":", "")))
        tempRecord.append(row[0])
        tempRecord.append("T")
        tempRecord.append(row[1])
        tempRecord.append(row[2])
        # try:
        #     tempRecord.append(row[3])
        #     pass
        # except IndexError:
        #     tempRecord.append('')
        # try:
        #     tempRecord.append(row[4])
        #     pass
        # except IndexError:
        #     tempRecord.append('')
        allCommList.append(tempRecord.copy())

reader = csv.reader(open(onboardFilePath, "rU"), delimiter='|')
for row in reader:
    tempRecord.clear()
    if row[0] != "":
        tempRecord.append(int(row[0].replace(":", "")))
        tempRecord.append(row[0])
        tempRecord.append("O")
        tempRecord.append(row[1])
        tempRecord.append(row[2])
        allCommList.append(tempRecord.copy())


reader = csv.reader(open(paoFilePath, "rU"), delimiter='|')
for row in reader:
    tempRecord.clear()
    if row[0] != "":
        tempRecord.append(int(row[0].replace(":", "")))
        tempRecord.append(row[0])
        tempRecord.append("P")
        tempRecord.append(row[1])
        tempRecord.append(row[2])
        allCommList.append(tempRecord.copy())


allCommSorted = sorted(allCommList, key=operator.itemgetter(0))

output_file_name_and_path = "../MISSION_DATA/A11_merged_utterances.csv"
outputFile = open(output_file_name_and_path, "w")
outputFile.write('')
outputFile.close()

outputFile = open(output_file_name_and_path, "a")

for item in allCommSorted:
    outputLine = '{0}|{1}|{2}|{3}\n'.format(item[1], item[2], item[3], item[4])
    outputFile.write(outputLine)

outputFile.close()
print("done")

# GET = ''
# nextLinePAO = False
# for line in inputFile:
#     GETSearchIndex = line.find("GET ")
#     if GETSearchIndex > -1 and line.startswith('APOLLO 11 MISSION COMMENTARY'):
#         GETEndIndex = line.find(" ", GETSearchIndex + 7)
#         tMinusIndex = line.find("  T -")
#         if tMinusIndex != -1:
#             GET = line[tMinusIndex + 4:GETEndIndex]
#         else:
#             GET = line[GETSearchIndex + 4:GETEndIndex]
#         if GET.count(':') == 1:  # add seconds to items with only minutes
#             GET = GET + ':00'
#         if GET.startswith('-'):
#             pass
#         timesplit = GET.split(':')
#         GET = timesplit[0].zfill(3) + ':' + timesplit[1].zfill(2) + ':' + timesplit[2].zfill(2)
#         # print GET + " -- " + line
#     if nextLinePAO:
#         outputLine = GET + "|PAO|" + line
#         outputFile.write(outputLine + "\n")
#         print outputLine
#         nextLinePAO = False
#     if line.startswith('PAO'):
#         nextLinePAO = True
# outputFile.close()
