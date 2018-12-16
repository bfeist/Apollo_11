import requests
import csv

videos = []


url = ("https://www.googleapis.com/youtube/v3/playlistItems?"
       "part=snippet&maxResults=50&"
       "playlistId=PLEpiLO4bexp_S3S6n2TAbAslFbO0U56Fi&"
       "key=AIzaSyCVJ5-ovvgJOHw0yjb4sMBBYPgt6sLmVtU")

resp = requests.get(url)
data = resp.json()

for i in data['items']:
    videos.append(i)

# # iterate through result pagination
# is_next = data.get('nextPageToken')
# if is_next:
#     page_token = is_next
# else:
#     next = False

# structuring the data
rows = []
for i in videos:
    title = i['snippet']['title']
    description = i['snippet']['description']
    videoId = i['snippet']['resourceId']['videoId']

    rows.append([title, videoId])
    rows.sort(key=lambda x: x[0])
    # data is now ready to write to csv file

for row in rows:
    print(row[0] + "|" + row[1])

# writing to csv file
# path = "videos.csv"
# with open(path, "w") as csv_file:
#     writer = csv.writer(csv_file, delimiter=";")
#     for row in rows:
#         writer.writerow(row.split(";"))
print('done')

