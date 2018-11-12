import csv
import json
import os
import re

def getsec(timeString):
    l = timeString.split(':')
    #print l
    return (int(l[0]) * 3600) + (int(l[1]) * 60) + int(l[2])


# for tapeName in os.listdir(r'F:/mp3'):
#     directory = 'F:/mp3/' + tapeName + '/noiseranges'
#     directory = os.fsencode(directory)

directory = 'F:/mp3/T648_defluttered_mp3_16/noiseranges'

channelNoiseArray = []
noiseItem = []
channelSecondsArray = []
tapeChannelSecondsArray = []
for i in range(0, 31):
    tapeChannelSecondsArray.append(None)
highestEndSecond = 0
maxHighestEndSecond = 0
secondItem = []
secondsChannelArray = []

if os.path.exists(directory):
    for channelfile in os.listdir(directory):
        channelNoiseArray.clear()
        channelSecondsArray.clear()

        channelfile = os.fsdecode(channelfile)
        result = re.search('HR(.*).csv', channelfile)
        channelnumber = result.group(1)[5:]

        csvreader = csv.reader(open(directory + '/' + channelfile, "rU"), delimiter='|')
        for row in csvreader:
            noiseItem.clear()
            noiseItem.append(getsec(row[0]))
            noiseItem.append(getsec(row[1]))
            channelNoiseArray.append(noiseItem.copy())

        if len(channelNoiseArray) > 0:
            highestEndSecond = max(channelNoiseArray, key=lambda x: x[1])[1]
            if highestEndSecond > maxHighestEndSecond:
                maxHighestEndSecond = highestEndSecond
        else:
            highestEndSecond = 0

        for second in range(0, highestEndSecond):
            for noiseStartStop in channelNoiseArray:
                if noiseStartStop[0] <= second <= noiseStartStop[1]:
                    channelSecondsArray.append(1)
                    break
                elif noiseStartStop[0] > second:
                    channelSecondsArray.append(0)
                    break
            # if second > 1000:
            #      break
        tapeChannelSecondsArray[int(channelnumber)] = channelSecondsArray.copy()

    for second in range(0, maxHighestEndSecond):
        secondItem.clear()
        for ichannelnum in range(2, 31):

            try:
                secondHasNoise = tapeChannelSecondsArray[ichannelnum][second]
            except:
                secondHasNoise = 0
            if secondHasNoise == 1:
                secondItem.append(ichannelnum)
        secondsChannelArray.append(secondItem.copy())

    with open('F:/mp3/T648_defluttered_mp3_16/data.json', 'w') as outfile:
        json.dump(secondsChannelArray, outfile)
    # print(json.dumps({"channelsInSeconds": secondsChannelArray}, indent=3))
    print('done')
