import csv

# -------------------- Write Utterance Data
output_utterance_data_file_name_and_path = "../_website/_webroot/port/indexes/utteranceData.csv"
output_utterance_data_file = open(output_utterance_data_file_name_and_path, "w")
output_utterance_data_file.write("")
output_utterance_data_file.close()
output_utterance_data_file = open(output_utterance_data_file_name_and_path, "a")

# WRITE ALL UTTERANCE BODY ITEMS
cur_row = 0
input_file_path = "../MISSION_DATA/A11_merged_utterances.csv"
utterance_reader = csv.reader(open(input_file_path, "rU"), delimiter='|')
for utterance_row in utterance_reader:
    cur_row += 1
    colonTable = str.maketrans(dict.fromkeys(':'))
    timeid = "timeid" + utterance_row[0].translate(colonTable)
    timeline_index_id = utterance_row[0].translate(colonTable)
    if utterance_row[1] != "":  # if not a TAPE change or title row
        words_modified = utterance_row[3]
        # words_modified = words_modified.replace("O2", "O<sub>2</sub>")
        # words_modified = words_modified.replace("H2", "H<sub>2</sub>")
        # words_modified = words_modified.replace("Tig ", "T<sub>ig</sub> ")
        who_modified = utterance_row[2]
        # who_modified = who_modified.replace("CDR", "Cernan")
        # who_modified = who_modified.replace("CMP", "Evans")
        # who_modified = who_modified.replace("LMP", "Schmitt")
        # who_modified = who_modified.replace("PAO", "Public Affairs")
        # who_modified = who_modified.replace("CC", "Mission Control")
        # attribution_modified = utterance_row[0]

        output_utterance_data_file.write(timeline_index_id + "|" + who_modified + "|" + words_modified + "\n")
    # print cur_row