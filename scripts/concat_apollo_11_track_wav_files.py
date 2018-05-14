__author__ = 'Feist'
# import requests
import re
import csv
import sys
import os
# import subprocess

inputPath = "/Volumes/A11_30_Track/Apollo_11_Data_Delivery/Apollo11/"
outputPath = "/Volumes/E/Apollo_11_Data_Delivery/concatenated_wav_files/"

#inputPath = "E:/Apollo_13_Data_Delivery/Apollo11/"
# outputPath = "E:/Video Projects/! Media Files/A11/30-track/"
# outputPath = "/Volumes/Feist1TB/"

csv.register_dialect('pipes', delimiter='_', doublequote=True, escapechar='\\')
reader = csv.reader(open(inputPath + "wav_files", "rU"), dialect='pipes')

# outputFilePath = "E:/Video Projects/! Media Files/A11/30-track/file_metadata/"
outputFilelist = open("filelist.txt", "w")
# ffmpeg_command_outputFile = open(outputFilePath + "ffmpeg.sh", "w")

lasttape = 'T973'
outputDirectoryName = 'T973/'
lasttrack = 'CH2'
last_Filename = 'A11_T973_HR2L_CH2'
outputWavFilename = "A11_T973_HR2L_CH1"
for row in reader:
    if row[3] != lasttrack or row[1] != lasttape:
        lasttape = row[1]
        lasttrack = row[3]
        outputFilelist.close()

        # concat previous track wav file
        # ffmpeg_command_outputFile.write('ffmpeg -f concat -i E:\\Video Projects\\! Media Files\\A11\\30-track\\file_metadata\\' + outputFilename + ' -c copy E:\\Video Projects\\! Media Files\\A11\\30-track\\' + outputFilename + ".wav\n")
        # ffmpeg_command_outputFile.write('ffmpeg -f concat -safe 0 -i ' + outputFilename + ' -c copy /Volumes/Feist1TB/' + outputFilename + ".wav\n")
        command = 'ffmpeg -f concat -safe 0 -i filelist.txt -c copy ' + outputPath + outputDirectoryName + outputWavFilename + ".wav\n"

        if os.path.exists(outputPath + outputDirectoryName + outputWavFilename + ".wav"):
            sys.stdout.write("EXISTS, SKIPPING: " + command)
        else:
            if not os.path.exists(outputPath + outputDirectoryName):
                os.makedirs(outputPath + outputDirectoryName)
            sys.stdout.write(command)
            os.system(command)

        # make new wav output file name and restart file list
        outputWavFilename = row[0] + "_" + row[1] + "_" + row[2] + "_" + row[3]
        outputDirectoryName = row[1] + "/"
        outputFilelist = open("filelist.txt", "w")

    # sys.stdout.write("_".join(map(str, row)) + "\n")
    outputFilelist.write("file '" + inputPath + "_".join(map(str, row)) + ".wav'\n")

outputFilelist.close()
command = 'ffmpeg -f concat -safe 0 -i filelist.txt -c copy ' + outputPath + outputDirectoryName + outputWavFilename + ".wav\n"
if os.path.exists(outputPath + outputDirectoryName + outputWavFilename + ".wav"):
    sys.stdout.write("EXISTS, SKIPPING: " + command)
else:
    if not os.path.exists(outputPath + outputDirectoryName):
        os.makedirs(outputPath + outputDirectoryName)
    sys.stdout.write(command)
    os.system(command)

outputFilelist.close()

print "************* DONE"