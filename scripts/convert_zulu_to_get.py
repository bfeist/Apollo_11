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


wavFilePath = ''
mission = "Apollo13"

if mission == "Apollo11":
    launchDatetime = datetime.strptime("July 16, 1969, 13:32", '%B %d, %Y, %H:%M')
    inputPath = r'\\192.168.0.5/Misc/NASA Archive/Apollo 11 30-Track/Apollo11/'
    outputPath = r'\\192.168.0.5/Misc/NASA Archive/Apollo 11 30-Track/'
    # causes script to use file of dir listing instead of direct dir listing
    wavFilePath = r'\\192.168.0.5/Misc/NASA Archive/Apollo 11 30-Track/wav_files'
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

if wavFilePath == '':
    import glob
    wav_files = glob.glob(inputPath + "*.wav")
else:
    with open(wavFilePath) as f:
        content = f.readlines()
    # remove whitespace characters like `\n` at the end of each line
    wav_files = [x.strip() for x in content]

outputTimelist = open(outputPath + "tape_GET_time_list.txt", "w")

firstStartDatetime = 0
lastEndDatetime = 0

startDatetime = 0
endDatetime = 0

channelOneStartJustSet = False
channelOneEndJustSet = False

counter = 0
for wav_file in wav_files:
    counter = counter + 1

    if len(wav_file) > 56:  # clean the glob wav file listing
        wav_file = wav_file[-55:]
    if wav_file[0:1] == "\\":  # add a leading channel 0 to single digit channels - glob
        wav_file = wav_file[1:17] + "0" + wav_file[17:]
    if len(wav_file) == 54:  # add a leading channel 0 to single digit channels - wav_file
        wav_file = wav_file[0:16] + "0" + wav_file[16:]

    # print wav_file
    tapeNum = wav_file[4:8]
    channelNum = wav_file[14:18]
    tapeHR = wav_file[9:13]

    startDateString = wav_file[19:22] + ", " + datetime.strftime(launchDatetime, '%Y') + ", " + wav_file[23:25] + ":" + wav_file[26:28] + ":" + wav_file[29:31]
    startDatetime = datetime.strptime(startDateString, '%j, %Y, %H:%M:%S')
    # print startDatetime.strftime('%Y-%m-%d %H:%M:%S')

    if channelNum == "CH01" and not channelOneStartJustSet:
        firstStartDatetime = startDatetime
        channelOneStartJustSet = True
        channelOneEndJustSet = False
        # print "start set " + wav_file

    if channelNum == "CH02" and not channelOneEndJustSet:
        channelOneStartJustSet = False
        channelOneEndJustSet = True
        lastEndDatetime = endDatetime
        # print "end set " + prev_wav_file
        # print "RANGE: " + tapeNum + " " + str(firstStartDatetime.strftime('%Y-%m-%d %H:%M:%S')) + " TO " + str(lastEndDatetime.strftime('%Y-%m-%d %H:%M:%S'))
        print tapeNum + "|" + tapeHR + "|" + GET_time_delta(firstStartDatetime, launchDatetime) + "|" + GET_time_delta(lastEndDatetime, launchDatetime)
        outputTimelist.write(tapeNum + "|" + tapeHR + "|" + GET_time_delta(firstStartDatetime, launchDatetime) + "|" + GET_time_delta(lastEndDatetime, launchDatetime) + "\n")

    endDateString = wav_file[32:35] + ", " + datetime.strftime(launchDatetime, '%Y') + ", " + wav_file[36:38] + ":" + wav_file[39:41] + ":" + wav_file[42:44]
    endDatetime = datetime.strptime(endDateString, '%j, %Y, %H:%M:%S')
    # print endDatetime.strftime('%Y-%m-%d %H:%M:%S')

outputTimelist.close()

print "************* DONE"