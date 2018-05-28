import csv
import sys
from shutil import copyfile
import time
import datetime
import math

def get_arg(index):
    try:
        sys.argv[index]
    except IndexError:
        return ''
    else:
        return sys.argv[index]


def TimestampBySeconds(seconds):
    hours = int(math.fabs(seconds / 3600))
    minutes = int(math.fabs(seconds / 60)) % 60 % 60
    seconds = math.floor(int(math.fabs(seconds)) % 60)

    return str(hours).zfill(3) + ":" + str(minutes).zfill(2) + ":" + str(seconds).zfill(2)


def SecondsByTimestamp(timestamp_val):
    val_list = timestamp_val.split(":")
    if val_list[0][0:1] == "-":
        hours = int(val_list[0][1:4])
        signToggle = -1
    else:
        hours = int(val_list[0])
        signToggle = 1
    minutes = int(val_list[1])
    seconds = int(val_list[2])

    totalSeconds = round(signToggle * ((abs(hours) * 60 * 60) + (minutes * 60) + seconds))
    return totalSeconds


# get arguments
start_GET = get_arg(1)
end_GET = get_arg(2)
seconds_to_offset = get_arg(3)

if len(start_GET) == 0 or len(end_GET) == 0 or len(seconds_to_offset) == 0:
    print("parameters incomplete. Should be start_GET end_GET seconds_to_offset")
    raise SystemExit


transcript_file_name_and_path = "../MISSION_DATA/A11_merged_utterances.csv"

# backup transcript file and use the backup as the input for processing
timestamp = datetime.datetime.fromtimestamp(time.time()).strftime('%Y-%m-%d_%H-%M-%S')
backup_file_name_and_path = "../MISSION_DATA/transcript_backups/A11_merged_utterances-" + timestamp + ".csv"
copyfile(transcript_file_name_and_path, backup_file_name_and_path)

#
# outputFile.write('')
#

# process transcript
curReadRow = 0
reader = csv.reader(open(backup_file_name_and_path, "rU"), delimiter='|')
outputFile = open(transcript_file_name_and_path, "w")
for row in reader:
    # print(SecondsByTimestamp(row[0]))
    if SecondsByTimestamp(row[0]) >= SecondsByTimestamp(start_GET) and SecondsByTimestamp(row[0]) <= SecondsByTimestamp(end_GET):
        row[0] = TimestampBySeconds(SecondsByTimestamp(row[0]) + int(seconds_to_offset))
    outputLine = "|".join(row) + "\n"
    # print(row[0])
    outputFile.write(outputLine)
outputFile.close()
