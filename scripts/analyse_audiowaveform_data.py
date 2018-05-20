import json
import math
from pprint import pprint

# samples_per_ms = 8
samples_per_peakval = 128
samples_per_second = 8000
peakvals_per_second = 62.5

silent_seconds_before_closing_noise_range = 5

def TimestampBySeconds(seconds):
    hours = int(math.fabs(seconds / 3600))
    minutes = int(math.fabs(seconds / 60)) % 60 % 60
    seconds = math.floor(int(math.fabs(seconds)) % 60)

    return str(hours).zfill(3) + ":" + str(minutes).zfill(2) + ":" + str(seconds).zfill(2)


with open('F:/mp3/T648_defluttered_mp3_16/audiowaveform_json/defluttered_A11_T648_HR1U_CH2.json') as data_file:
    json_data = json.load(data_file)
    sample_counter = 0
    seconds_counter = 0
    accum_val = 0
    prev_second = 0
    range_start = 0
    range_stop = 0
    range_stop_concurrent_seconds = 0
    for peak_val in json_data["data"]: # loop through the json sample array. these are in min/max val pairs, so 128 samples per value
        accum_val += math.fabs(peak_val)  # add together all of the peak values over one second
        sample_counter += samples_per_peakval
        curr_second = math.floor(sample_counter / samples_per_second)  # seconds rollover detector
        if curr_second > prev_second:  # process previous second
            peak_average_over_second = accum_val / peakvals_per_second  # how loud was this second
            if peak_average_over_second > 1:  # TODO somehow figure out how to compare to average tape noise to avoid detecting hum
                if range_start == 0:
                    range_start = prev_second  # start counting a noise range
                range_stop_concurrent_seconds = 0  #  reset the concurrent seconds of silence because we heard a new noise
            elif range_start != 0:  # if a noise detection range has already been started
                range_stop_concurrent_seconds += 1  # increment seconds of silence detection
                if range_stop_concurrent_seconds == silent_seconds_before_closing_noise_range:  # if silence range detection duration has been hit
                    range_stop = prev_second - (silent_seconds_before_closing_noise_range - 1)  # calculate range stop as at the beginning of silence range
                    print(TimestampBySeconds(range_start) + " - " + TimestampBySeconds(range_stop))
                    range_start = 0  # reset range
                    range_stop = 0
                    range_stop_concurrent_seconds = 0
            accum_val = 0
            prev_second = curr_second

        if curr_second > 1000:
            break
