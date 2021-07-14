import os
from urllib import request

# directory_in_str = 'E:/temp/A10_images/AS10-32/cdn10.picryl.com/photo/2012/12/31/'
directory_in_str = 'E:/temp/A10_images/Apollo 10-2/cdn10.picryl.com/photo/2012/12/31/'

directory_out_str = 'E:/temp/A10_images/scraped_images/'

directory = os.fsencode(directory_in_str)

for file in os.listdir(directory):
    filename = os.fsdecode(file)
    print()

    k = filename.rfind("-")
    largeImageFilename = filename[:k] + '-1600.jpg'

    exists = os.path.isfile(directory_out_str + largeImageFilename)
    if exists:
        print('skipping - ' + filename)
    else:
        print('downloading - ' + filename)
        url = 'https://cdn10.picryl.com/photo/2012/12/31/'
        request.urlretrieve(url + largeImageFilename, directory_out_str + largeImageFilename)

