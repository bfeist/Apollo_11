import csv

output_file_name_and_path = "../MISSION_DATA/A11_TEC_cleaned_phase2.csv"
outputFile = open(output_file_name_and_path, "w")
outputFile.write('')
outputFile.close()

callsignList = []
lastTimestamp = 0
lastTimestampStr = "00 00 00 00"
outputLine = ""

inputFilePath = "../MISSION_DATA/A11_TEC_cleaned.csv"
reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')