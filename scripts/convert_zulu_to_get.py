__author__ = 'Feist'
# import requests

import csv
from datetime import datetime
from datetime import timedelta
import subprocess


def GET_time_delta(startStopDatetime, launchDateTime):
    dateDifference = startStopDatetime - launchDatetime

    seconds = dateDifference.total_seconds()

    sign_string = '-' if seconds < 0 else ''
    seconds = abs(int(seconds))
    days, seconds = divmod(seconds, 86400)
    hours, seconds = divmod(seconds, 3600)
    minutes, seconds = divmod(seconds, 60)
    if days > 0:
        return '%s%s:%s:%s' % (sign_string, zeroPad(days * 24 + hours, 3), zeroPad(minutes, 2), zeroPad(seconds, 2))
    elif hours > 0:
        return '%s%s:%s:%s' % (sign_string, zeroPad(hours, 3), zeroPad(minutes, 2), zeroPad(seconds, 2))
    elif minutes > 0:
        return '%s000:%s:%s:' % (sign_string, zeroPad(minutes, 2), zeroPad(seconds, 2))
    else:
        return '%s000:00:%s' % (sign_string, zeroPad(seconds, 2))


def zeroPad(number, length):
    return str(number).zfill(length)


mission = "Apollo13"
if mission == "Apollo11":
    launchDatetime = datetime.strptime("July 16, 1969, 13:32", '%B %d, %Y, %H:%M')
elif mission == "Apollo13":
    launchDatetime = datetime.strptime("April 11, 1970, 19:13", '%B %d, %Y, %H:%M')

inputPath = "E:/Apollo_13_Data_Delivery/Apollo13/"
outputPath = "E:/Apollo_13_Data_Delivery/"


# csv.register_dialect('pipes', delimiter='|', doublequote=True, escapechar='\\')
# reader = csv.reader(open(inputFilePath, "rU"), dialect='pipes')


command = "dir /b /a-d *.wav"
# sys.stdout.write(command)
# os.system(command)

# proc = subprocess.Popen(command, shell=True)
# (out, err) = proc.communicate()
# print "program output:", out

import glob
wav_files = glob.glob(inputPath + "*.wav")

outputTimelist = open(outputPath + "tape_GET_time_list.txt", "w")

firstLoop = 1
lastTapeNum = 0
firstChannelNum = 0

firstStartDatetime = 0
lastEndDatetime = 0

startDatetime = 0
endDatetime = 0

for wav_file in wav_files:
    # print(wav_file[-55:])
    wav_file = wav_file[-55:]
    if wav_file[0:1] == "\\":
        wav_file = wav_file[1:17] + "0" + wav_file[17:]

    # print wav_file
    tapeNum = wav_file[4:8]
    channelNum = wav_file[14:18]

    startDateString = wav_file[19:22] + ", " + datetime.strftime(launchDatetime, '%Y') + ", " + wav_file[23:25] + ":" + wav_file[26:28] + ":" + wav_file[29:31]
    startDatetime = datetime.strptime(startDateString, '%j, %Y, %H:%M:%S')
    # print startDatetime.strftime('%Y-%m-%d %H:%M:%S')

    if firstChannelNum == 0:
        firstChannelNum = channelNum
        firstStartDatetime = startDatetime

    if channelNum != firstChannelNum:
        firstStartDatetime = startDatetime

    if tapeNum != lastTapeNum and firstLoop != 1:
        lastEndDatetime = endDatetime
        #print wav_file
        #print "RANGE: " + tapeNum + " " + str(firstStartDatetime.strftime('%Y-%m-%d %H:%M:%S')) + " TO " + str(lastEndDatetime.strftime('%Y-%m-%d %H:%M:%S'))
        print tapeNum + "|" + GET_time_delta(firstStartDatetime, launchDatetime) + "|" + GET_time_delta(lastEndDatetime, launchDatetime)
        lastTapeNum = tapeNum
        outputTimelist.write(tapeNum + "|" + GET_time_delta(firstStartDatetime, launchDatetime) + "|" + GET_time_delta(lastEndDatetime, launchDatetime) + "\n")

    endDateString = wav_file[32:35] + ", " + datetime.strftime(launchDatetime, '%Y') + ", " + wav_file[36:38] + ":" + wav_file[39:41] + ":" + wav_file[42:44]
    endDatetime = datetime.strptime(endDateString, '%j, %Y, %H:%M:%S')
    # print endDatetime.strftime('%Y-%m-%d %H:%M:%S')

    firstLoop = 0


outputTimelist.close()

print "************* DONE"