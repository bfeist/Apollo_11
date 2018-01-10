__author__ = 'Feist'
# import requests

import csv
from datetime import datetime
from datetime import timedelta


def GET_time_delta(startStopDatetime):
    launchDatetime = datetime.strptime("July 16, 1969, 13:32", '%B %d, %Y, %H:%M')
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


inputFilePath = "E:/Apollo_11_Data_Delivery/Tape_time_ranges.txt"
outputPath = "E:/Apollo_11_Data_Delivery/"
# outputPath = "/Volumes/Feist1TB/"

csv.register_dialect('pipes', delimiter='|', doublequote=True, escapechar='\\')
reader = csv.reader(open(inputFilePath, "rU"), dialect='pipes')

outputTimelist = open(outputPath + "tape_GET_time_list.txt", "w")

for row in reader:
    startDatetime = datetime.strptime("1969 " + row[3].replace("-", " "), '%Y %j %H %M %S')
    endDatetime = datetime.strptime("1969 " + row[4].replace("-", " "), '%Y %j %H %M %S')

    print row[0] + "|" + row[1] + "|" + row[2] + "|" + GET_time_delta(startDatetime) + "|" + GET_time_delta(endDatetime)
    outputTimelist.write(row[0] + "|" + row[1] + "|" + row[2] + "|" + GET_time_delta(startDatetime) + "|" + GET_time_delta(endDatetime) + "\n")

outputTimelist.close()

print "************* DONE"