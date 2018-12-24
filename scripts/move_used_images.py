import os
import shutil
import csv


sourcePath = r'E:\temp\A11_images\A11_images\www.hq.nasa.gov\office\pao\History\alsj\a11\\'
destPath = r'D:\Apollo_11\_website\_webroot\mission_images\\'
inputFilePath = "../MISSION_DATA/scraped_data/scraped_photoinfo.csv"
reader = csv.reader(open(inputFilePath, "rU"), delimiter='|')
for row in reader:
    fileToMove = row[2]
    print(fileToMove)
    if os.path.isfile(sourcePath + fileToMove):
        shutil.copy(sourcePath + fileToMove, destPath)
