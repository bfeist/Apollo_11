__author__ = 'Feist'
import requests
import re

# urlArray = ["79155"]
urlArray = ["10010", "10021", "10022", "10023", "10024", "10025", "10026", "10027", "10028", "10029", "10030", "10031", "10032", "10033", "10002", "10044", "10045", "10046", "10047", "10048", "10049", "10050", "10054", "10056", "10057", "10058", "10059", "10084", "10085", "10086", "10087", "10089", "10090", "10091", "10092", "10001", "10003", "10004", "10005", "10008", "10009", "10011", "10014", "10015", "10017", "10018", "10019", "10020", "10060", "10061", "10062", "10063", "10064", "10065", "10066", "10067", "10068", "10069", "10070", "10071", "10072", "10073", "10074", "10075", "10082", "10093", "10094"]
# urlArray = ["a17.eva3post.html"]

for url in urlArray:
    page = requests.get('https://curator.jsc.nasa.gov/lunar/samplecatalog/sampleinfo.cfm?sample=' + url)
    pageAscii = page.text.encode('ascii', 'ignore')
    lines = pageAscii.split('\r')

    images = ''
    firstimage = True
    for line in lines:
        image_match = re.search(r'Photo Number: (.*)</p>', line)
        if image_match is not None:
            image_name = image_match.group(1)
            if firstimage:
                outputFilePath = "../_website/_webroot/11/indexes/geosampledetails/" + url + ".csv"
                outputFile = open(outputFilePath, "w")
                outputFile.write("")
                outputFile.close()
                outputFile = open(outputFilePath, "a")
                images = image_name
                firstimage = False
            else:
                images = images + "|" + image_name

            #print 'Image found:', image_name
        else:
            pass

    print("************* DONE page:", url)
    if not firstimage:
        outputFile.write(images)
        outputFile.close()


#
# __author__ = 'Feist'
# import requests
# import re
#
# urlArray = ["79155"]
#
# # urlArray = ["a17.eva3post.html"]
#
# outputFilePath = "../../MISSION_DATA/geoSampleDetails.csv"
# outputFile = open(outputFilePath, "w")
# outputFile.write("")
# outputFile.close()
# outputFile = open(outputFilePath, "a")
#
# for url in urlArray:
#     page = requests.get('https://curator.jsc.nasa.gov/lunar/samplecatalog/sampleinfo.cfm?sample=' + url)
#     pageAscii = page.text.encode('ascii', 'ignore')
#     lines = pageAscii.split('\r')
#
#     for line in lines:
#         image_match = re.search(r'Photo Number: .*<br />Sample:', line)
#         if image_match:
#             image_name = line[image_match.start()+14:image_match.end()-13].lower()
#             print 'Image found:', image_name
#         else:
#             pass
#
#
#     print "************* DONE page:", url