import json
import math
from pprint import pprint

# samples_per_ms = 8
samples_per_peakval = 256
samples_per_second = 8000

peakvals_per_second = 31.25
peakvals_per_4seconds = 125

with open('F:/mp3/T648_defluttered_mp3_16/audiowaveform_json/defluttered_A11_T648_HR1U_CH2.json') as data_file:
    json_data = json.load(data_file)
    sample_counter = 0
    seconds_counter = 0
    accum_val = 0
    last_second = 0
    for peak_val in json_data["data"]:
        accum_val += math.fabs(peak_val)
        sample_counter += samples_per_peakval
        curr_second = math.floor(sample_counter / samples_per_second)
        if curr_second > last_second:  # each second
            last_second = curr_second
            peak_average_over_second = accum_val / peakvals_per_second
            print(str(curr_second) + " second : " + str(peak_average_over_second))
            accum_val = 0

        if curr_second > 1000:
            break
