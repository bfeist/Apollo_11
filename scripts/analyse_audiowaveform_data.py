import json
import math
import numpy
from pprint import pprint

# samples_per_ms = 8
samples_per_peakval = 128
samples_per_second = 8000
peakvals_per_second = 62.5
silent_seconds_before_closing_noise_range = 12


def getMedian(numericValues):
    theValues = sorted(numericValues)

    if len(theValues) % 2 == 1:
        return theValues[int((len(theValues)+1)/2-1)]
    else:
        lower = theValues[int(len(theValues)/2-1)]
        upper = theValues[int(len(theValues)/2)]
        return (float(lower + upper)) / 2


def TimestampBySeconds(seconds):
    hours = int(math.fabs(seconds / 3600))
    minutes = int(math.fabs(seconds / 60)) % 60 % 60
    seconds = math.floor(int(math.fabs(seconds)) % 60)

    return str(hours).zfill(3) + ":" + str(minutes).zfill(2) + ":" + str(seconds).zfill(2)


with open('F:/mp3/T648_defluttered_mp3_16/audiowaveform_json/defluttered_A11_T648_HR1U_CH24.json') as data_file:
    json_data = json.load(data_file)
    abs_wav_data = [abs(number) for number in json_data["data"]]
    unique_values = numpy.unique(abs_wav_data)

    # c = 0
    # for peak_val in abs_wav_data:
    #     if peak_val != 0:
    #         print(str(c) + " - " + str(peak_val))
    #     c += 1
    #     if c > 10000:
    #         break


    # calculate noise threshold for silence
    median_loudness = getMedian(abs_wav_data)
    silence_threshold = numpy.percentile(abs_wav_data,  25)
    # silence_threshold = numpy.percentile(abs_wav_data, numpy.arange(0, 100, 25))

    sample_counter = 0
    seconds_counter = 0
    accum_val = 0
    prev_second = 0
    range_start = 0
    range_stop = 0
    concurrent_seconds_of_silence = 0
    for peak_val in abs_wav_data: # loop through the json sample array. these are in min/max val pairs, so 128 samples per value
        accum_val += peak_val  # add together all of the peak values over one second
        sample_counter += samples_per_peakval
        curr_second = math.floor(sample_counter / samples_per_second)  # seconds rollover detector
        if curr_second > prev_second:  # process previous second
            peak_average_over_second = accum_val / peakvals_per_second  # how loud was this second
            if peak_average_over_second > 3:  # TODO somehow figure out how to compare to average tape noise to avoid detecting hum
                if range_start == 0:
                    range_start = prev_second  # start counting a noise range
                concurrent_seconds_of_silence = 0  #  reset the concurrent seconds of silence because we heard a noise
            elif range_start != 0:  # if a noise detection range has already been started
                concurrent_seconds_of_silence += 1  # increment seconds of silence detection
                if concurrent_seconds_of_silence == silent_seconds_before_closing_noise_range:  # if silence range detection duration has been hit
                    range_stop = prev_second - (silent_seconds_before_closing_noise_range - 1)  # calculate range stop as at the beginning of silence range
                    if range_stop - range_start >= 2:  # if two or more seconds of sound
                        print(TimestampBySeconds(range_start) + " - " + TimestampBySeconds(range_stop))
                    range_start = 0  # reset range
                    range_stop = 0
                    concurrent_seconds_of_silence = 0
            accum_val = 0
            prev_second = curr_second

        if curr_second > 1000:
            break
