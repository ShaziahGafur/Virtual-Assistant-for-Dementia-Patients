import time
from datetime import date, datetime
from pytz import timezone
from flask import Flask, request
from flask_cors import CORS, cross_origin
from config import *

import io
from mutagen.mp3 import MP3
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip, concatenate_videoclips

from pydub import AudioSegment
from pydub.playback import play

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud import storage
import glob, os, shutil
import io
import random, re

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
unused_prompts = []
answers = {}
prompts_list = []
matched_questions = {}
p_name = 'Mirza'
fp_name = 'Shaziah'
hospital = 'North York General Hospital'

tz = timezone('EST')
weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
weekday = weekdays[datetime.now(tz).weekday()]
date_today = weekday + ", " + datetime.now(tz).strftime("%B %d, %Y")
month = datetime.now(tz).strftime("%B")
year = datetime.now(tz).strftime("%Y")

# code to get season from: https://stackoverflow.com/a/28688724
year_int = datetime.now(tz).year
seasons = [('winter', (date(year_int,  1,  1),  date(year_int,  3, 20))),
           ('spring', (date(year_int,  3, 21),  date(year_int,  6, 20))),
           ('summer', (date(year_int,  6, 21),  date(year_int,  9, 22))),
           ('fall', (date(year_int,  9, 23),  date(year_int, 12, 20))),
           ('winter', (date(year_int, 12, 21),  date(year_int, 12, 31)))]
season = next(season for season, (start, end) in seasons
                if start <= datetime.today().date() <= end)

@app.route('/time')
@cross_origin()
def get_current_time():
    return {'time': time.time()}

@app.route('/hello')
def welcome():
    return {'welcome': 'welcome!!'}

@app.route('/transcribe_sample_audio', methods=["POST"])
def transcribe_sample_audio():

    result = ""

    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS

        # Instantiates a client
        client = speech.SpeechClient()

        # The name of the audio file to transcribe
        gcs_uri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw"

        audio = speech.RecognitionAudio(uri=gcs_uri)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=16000,
            language_code="en-US",
        )

        # Detects speech in the audio file
        response = client.recognize(config=config, audio=audio)
        
        for result in response.results:
            print("Transcript: {}".format(result.alternatives[0].transcript))
            return {"transcript":result.alternatives[0].transcript}
    except e:
        print(e)
        return {"transcript": "error"}

    return {"transcript": "error: EOF"}

@app.route('/download_fp_media', methods=["GET"])
def download_FP_media_dialogue():
    print("in download_FP_media_dialogue!!")
    patient_ID = request.args.get("patient_ID")
    FP_ID = request.args.get("FP_ID")

    print(patient_ID, FP_ID)

    decision_setup()

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS
    client=storage.Client()
    bucket_name = "familiar-person" 

    finished_videos_folder = "Patients/"+patient_ID+"/Familiar Person/"+FP_ID+"/FinishedVideos/"
    videos_folder="Patients/"+patient_ID+"/Familiar Person/"+FP_ID+"/Videos/"
    audio_folder="Patients/"+patient_ID+"/Familiar Person/"+FP_ID+"/Audio/"
    combined_videos_folder = "Patients/"+patient_ID+"/Familiar Person/"+FP_ID+"/combinedVideos/"

    # Retrieve all blobs with a prefix matching the folder
    destination_dir = "tmp/media_from_bucket/fp_videos/"
    bucket=client.get_bucket(bucket_name)

    # this won't throw an error if this doesn't exist
    # however, it will return an empty list, which is why the below if statement must be <= 1
    # finished_video_blobs = list(bucket.list_blobs(prefix=finished_videos_folder))

    # video_blobs=list(bucket.list_blobs(prefix=videos_folder))
    # audio_blobs=list(bucket.list_blobs(prefix=audio_folder))

    combined_video_blobs = list(bucket.list_blobs(prefix=combined_videos_folder))

    for blob in combined_video_blobs:
        if(not blob.name.endswith("/")):
            file_name = blob.name.split("/")[-1]
            print(file_name)
            # download video from file bucket
            blob.download_to_filename(destination_dir+file_name)

    # the first in the list will always be the own folder, but should probably make it so that 
    # it will check if the number of videos in the cloud bucket match the number of 
    # prompts there are, or else it will never make videos of new prompts if the folder is not empty
    # if (len(finished_video_blobs) <= 1):
    #     print("Videos have NOT been created! Creating now:")
    #     for blob in audio_blobs:
    #         if(not blob.name.endswith("/")):
    #             file_name = blob.name.split("/")[-1]
    #             # only download mp3 files, not wav ones
    #             if file_name[-4:] == ".mp3":
    #                 print(file_name)
    #                 blob.download_to_filename(destination_dir+file_name)

    #     for blob in video_blobs:
    #         if(not blob.name.endswith("/")):
    #             file_name = blob.name.split("/")[-1]
    #             print(file_name)
    #             # download video from file bucket
    #             file_path = destination_dir+file_name[:-4] # file path without .mp4
    #             blob.download_to_filename(file_path + "_no_audio.mp4")

    #             # create final video with audio
    #             video_clip = VideoFileClip(file_path + "_no_audio.mp4")

    #             video_with_audio = video_clip.set_audio(AudioFileClip(file_path + ".mp3"))
    #             video_with_audio.write_videofile(file_path + ".mp4",
    #                             codec='libx264',
    #                             audio_codec='aac',
    #                             temp_audiofile='temp-audio.m4a',
    #                             remove_temp=True)

    #             # remove clips that are no longer necessary
    #             os.remove(file_path + "_no_audio.mp4")
    #             os.remove(file_path + ".mp3")

    #     print("Videos and Audio combined, now uploading to Google Cloud FinishedVideos folder")

    #     for file in os.listdir(destination_dir):
    #         if file.endswith(".mp4"):
    #             complete_file_name = os.path.join(destination_dir, file)
    #             blob = bucket.blob(finished_videos_folder + file)
    #             blob.upload_from_filename(complete_file_name)


    # else:
    #     print("Videos are already created! Pulling from the FinishedVideos folder")
    #     for blob in finished_video_blobs:
    #         if(not blob.name.endswith("/")):
    #             file_name = blob.name.split("/")[-1]
    #             # download video from file bucket
    #             file_path = destination_dir
    #             blob.download_to_filename(file_path + file_name)

    # print("Videos all downloaded! Starting video call set-up.")

    # set up initial greeting
    shutil.copy(destination_dir+"How are you doing today.mp4", "tmp/media_from_bucket/")
    os.rename("tmp/media_from_bucket/How are you doing today.mp4", "tmp/media_from_bucket/new_video_clip.mp4")

    global unused_prompts
    unused_prompts = prompts_list.copy()
    unused_prompts.remove("How are you doing today?")

    return {"Result": "Success"}

@app.route('/transcribe_audio', methods=["POST"])
def transcribe_audio(request):
    files = request.files
    wav_file = files["files"]
    transcript = ""

    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS

        # # Instantiates a client
        client = speech.SpeechClient()

        stored_file = os.getcwd() + r"/tmp/" + wav_file.filename + ".wav"

        wav_file.save(stored_file)

        audio_file_name = wav_file.filename +'.wav'

        with open(stored_file, "rb") as audio_file:
            content = audio_file.read()

        ## pull from the local file on the server instead, probably will be faster
        audio = speech.RecognitionAudio(content = content)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=44100,
            language_code="en-US",
            enable_automatic_punctuation=True,
        )

        response = client.recognize(config=config, audio=audio)
        print(response.results)
        for result in response.results:
            transcript += result.alternatives[0].transcript
            # return {"Transcript": result.alternatives[0].transcript}
    except e:
        print(e)
        
    return {"Transcript": transcript}

### This function takes in a particular patient, FP, and conversation decision
@app.route('/download_media', methods=["POST"])
def prepare_video(decision):
    prompts = re.split("\? |\. |\! |\, ", decision)
    videos_dir = "tmp/media_from_bucket/fp_videos/"
    destination_dir = "tmp/media_from_bucket/"

    video_clip_filenames = []

    for prompt in prompts:
        print("prompt: ", prompt)
        prompt = prompt.replace('?', '')
        prompt = prompt.replace('.', '')

        if len(prompts) == 1:
            shutil.copy(videos_dir+prompt+".mp4", destination_dir)
            os.rename(destination_dir+prompt+".mp4", destination_dir+"new_video_clip.mp4")
            return

        video_clip_filenames.append(videos_dir+prompt+".mp4")

    clips = [VideoFileClip(c) for c in video_clip_filenames]
        
    final_video = concatenate_videoclips(clips)
    final_video.write_videofile("tmp/media_from_bucket/new_video_clip.mp4",
                                codec='libx264',
                                audio_codec='aac',
                                temp_audiofile='temp-audio.m4a',
                                remove_temp=True)

    return

def decision_setup():
    global answers, prompts_list, matched_questions
    greetings = ["Hi!",
             "Hello!",
             "Hey!",
             "Hello {0}".format(p_name),
             "Hi {0}, nice to see you again!".format(p_name)]

    answers = {
        # "who are you" : ["I am {0}.".format(fp_name)],
        "where am i" : ["You are in {0}.".format(hospital)],
        "why am i here" : ["You are in hospital because you are sick."],
        # "what day is it today" : ["Today is {0}.".format(date_today)],
        # "what month is it" : ["It is {0}.".format(month)],
        "what year is it" : ["It is the year {0}.".format(year)]
        # "what season is it" : ["It is {0} now.".format(season)],
    }

    prompts_list = ["How are you doing today?",
            "Do you know where you are?",
            # "Do you know what year it is?",
            "Do you know what month it is?",
            "Do you know what season it is?",
            "How many children do you have?",
            "Do you have a spouse What is their name?",
            # "Where do you live?",
            # "What are your hobbies?",
            "Are you feeling scared or afraid Tell me more about how you are feeling.",
            "Do you like to read?",
            # "Do you like to sew?",
            "Do you like to exercise?",
            "Tell me about your friends in school.",
            "Tell me about your children.",
            "Did you know that an ostrichs eye is bigger than its brain?",
            "Did you know that potato chips were invented by mistake?",
            "Did you know that the heart of a shrimp is located in its head?"
            ]

    matching_questions = {
        ('where', 'where am i'): "where am i",
        ('what day', 'what is today', 'what\'s today\'s date', 'what is today\'s date', 'what date is it today', 'which day'): "what day is it today",
        ('what month', 'which month'): "what month is it",
        ('what year', 'which year'): "what year is it",
        ('what season', 'which season'): "what season is it"
    }

    matched_questions = {}
    for k, v in matching_questions.items():
        for key in k:
            matched_questions[key] = v
    
    return

def find_matching_question(matched_questions, phrase):
  question = phrase
  
  for substring in matched_questions:
    if substring in phrase:
      question = matched_questions[substring]
  
  return question

def get_response(p_input):
  global unused_prompts
  phrases = re.split("\? |\. |\! |\, ", p_input.lower())
  # re.split() does not remove last phrase's punctuation
  # if it exists, remove question mark at the end of last question to match ones in "answers" list
  phrases[-1] = phrases[-1].replace('?', '')
  response = ""
#   print("phrases: ", phrases)

#   print("answers: ", answers)
#   print("prompts_list: ", prompts_list)
#   print("answers: ", matched_questions)
#   print("unused_prompts: ", unused_prompts)

  for phrase in phrases:
    question = find_matching_question(matched_questions, phrase)
    if question in answers:
      response = response + random.choice(answers[question]) + " "
  
  if not unused_prompts:
      unused_prompts = prompts_list.copy()

  prompt = random.choice(unused_prompts)
  unused_prompts.remove(prompt)

  if "You are in {0}.".format(hospital) in response and prompt == "Do you know where you are?":
    # get new prompt so that we don't ask them if they know where they are right after telling them where they are
    prompt = random.choice(unused_prompts)
    unused_prompts.remove(prompt)

  response = response + prompt

  print(response)
  prepare_video(response)
  
  return response

@app.route('/generate_decision', methods=["POST"])
def generate_decision():
    transcript = transcribe_audio(request)
    return_value = {"Return":"Failure"}
    print("***TRANSCRIPT: " + transcript["Transcript"] + "\n")
    # if transcript["Transcript"]:
    # call the decision functions
    # change return_value here
    return_value = {"Return": get_response(transcript["Transcript"])}
    print("***CHOSEN RESPONSE:", return_value["Return"])
    return return_value

# (TODO) Database stuff below -- put this in another file later
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, Column, ForeignKey
import sqlite3

# Returns the result as a dict with the column names
def clean_sql_output(res):
    columns = res.description 
    result = [{columns[index][0]:column for index, column in enumerate(value)} for value in res.fetchall()]
    return result

def get_all_patients():
    # (TODO) find a way to make the first two lines able to be taken out, it'll throw a wrong thread error otherwise
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM Patients")

    result = clean_sql_output(res)

    return result

# (TODO) Add error checking
def insert_a_patient(request):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()
    patient_info = request.get_json()

    first_name = patient_info["firstName"]
    last_name = patient_info["lastName"]
    if patient_info["hospitalID"]:
        hospital_ID = patient_info["hospitalID"]
        sql_input = (first_name, last_name, hospital_ID)
        res = cur.execute("INSERT INTO Patients(FirstName, LastName, HospitalPatientID) VALUES (?,?,?)", sql_input)
    else:
        sql_input = (first_name, last_name)
        res = cur.execute("INSERT INTO Patients(FirstName, LastName) VALUES (?,?)", sql_input)
    con.commit()
    return {"result":"Success"}

# (TODO) Need to add delete and modify but later 
@app.route("/db/patients", methods=["GET","POST"])
def patients():
    if request.method == "GET":
        return get_all_patients()
    elif request.method == "POST":
        print("post!")
        return insert_a_patient(request)

def get_all_favourite_persons():
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM FavouritePersons")

    result = clean_sql_output(res)
   
    return result

def get_favourite_persons_for_patient(patientID):
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM FavouritePersons where PatientID=?", (patientID,))

    result = clean_sql_output(res)
   
    return result

def insert_a_favourite_person(request):

    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS

    files = request.files
    
    photo = files["photoFile"]
    recording_one = files["recordingOneFile"]
    recording_two = files["recordingTwoFile"]
    recording_three = files["recordingThreeFile"]

    
    request_data = request.form or request.get_json()

    favourite_person_info = dict(request_data)

    first_name = favourite_person_info["firstName"]
    last_name = favourite_person_info["lastName"]
    patient_id = favourite_person_info["patientID"]
    
    google_bucket_link = first_name + last_name+ "/"
    favourite_person_info["pictureLink"] = google_bucket_link
    favourite_person_info["recordingLink"] =  google_bucket_link
    
    # this needs to be unique but its currently not
    # save the photo
    # also need to check the type of the photo too :')
    stored_photo_file = os.getcwd() + r"/tmp/" + photo.filename + ".jpg"
    photo.save(stored_photo_file)
    
    if photo:
        storage_client = storage.Client()
        bucket = storage_client.bucket(FP_FORM_BUCKET_NAME)
        # Upload file to Google Bucket (the "familiar-person-form-data" one)
        blob = bucket.blob(google_bucket_link+ photo.filename) 
        blob.upload_from_filename(stored_photo_file)
    
    # save the recording 1
    stored_recording_one_file = os.getcwd() + r"/tmp/" + recording_one.filename + ".wav"
    recording_one.save(stored_recording_one_file)

    if recording_one:
        storage_client = storage.Client()
        bucket = storage_client.bucket(FP_FORM_BUCKET_NAME)
        # Upload file to Google Bucket (the "familiar-person-form-data" one)
        blob = bucket.blob(google_bucket_link+recording_one.filename) 
        blob.upload_from_filename(stored_recording_one_file)

    # save the recording 2
    stored_recording_two_file = os.getcwd() + r"/tmp/" + recording_two.filename + ".wav"
    recording_two.save(stored_recording_two_file)

    if recording_two:
        storage_client = storage.Client()
        bucket = storage_client.bucket(FP_FORM_BUCKET_NAME)
        # Upload file to Google Bucket (the "familiar-person-form-data" one)
        blob = bucket.blob(google_bucket_link +recording_two.filename) 
        blob.upload_from_filename(stored_recording_two_file)

    # save the recording 3
    stored_recording_three_file = os.getcwd() + r"/tmp/" + recording_three.filename + ".wav"
    recording_three.save(stored_recording_three_file)

    if recording_three:
        storage_client = storage.Client()
        bucket = storage_client.bucket(FP_FORM_BUCKET_NAME)
        # Upload file to Google Bucket (the "familiar-person-form-data" one)
        blob = bucket.blob(google_bucket_link+recording_three.filename) 
        blob.upload_from_filename(stored_recording_three_file)

    # @Ruqhia you can either call your endpoint here (since they're all in Google Bucket)
    # or at the end of the function

    # remove the 4 created files
    os.remove(os.getcwd() + r"/tmp/" +"photo.jpg")
    os.remove(os.getcwd() + r"/tmp/" +"recording_1.wav")
    os.remove(os.getcwd() + r"/tmp/" +"recording_2.wav")
    os.remove(os.getcwd() + r"/tmp/" +"recording_3.wav")

    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    print(first_name, last_name, patient_id)


    # may need to create the picture link and recording link here. 

    if "pictureLink" in favourite_person_info.keys() and "recordingLink" in favourite_person_info.keys():
        picture_link = favourite_person_info["pictureLink"]
        recording_link = favourite_person_info["recordingLink"]
        sql_input = (first_name, last_name, patient_id, picture_link, recording_link)
        res = cur.execute("INSERT INTO FavouritePersons(FirstName, LastName, PatientID, PictureLink, RecordingLink) VALUES (?,?,?,?,?)", sql_input)

    elif "pictureLink"  in favourite_person_info.keys() and "recordingLink" not in favourite_person_info.keys():
        picture_link = favourite_person_info["pictureLink"]
        sql_input = (first_name, last_name,  patient_id, picture_link)
        res = cur.execute("INSERT INTO FavouritePersons(FirstName, LastName, PatientID, PictureLink) VALUES (?,?,?,?)", sql_input)

    elif "pictureLink" not in favourite_person_info.keys() and "recordingLink" in favourite_person_info.keys():
        recording_link = favourite_person_info["recordingLink"]
        sql_input = (first_name, last_name,  patient_id, recording_link)
        res = cur.execute("INSERT INTO FavouritePersons(FirstName, LastName, PatientID, RecordingLink) VALUES (?,?,?,?)", sql_input)

    elif "pictureLink" not in favourite_person_info.keys() and "recordingLink" not in favourite_person_info.keys():
        sql_input = (first_name, last_name, patient_id)
        res = cur.execute("INSERT INTO FavouritePersons(FirstName, LastName,  PatientID) VALUES (?,?,?)", sql_input)
    
    con.commit()
    return {"result":"Success"}

@app.route("/db/favouritepersons", methods=["GET","POST"])
def favourite_persons():
    if request.method == "GET":
        patientID = request.args.get("patientID")
        if patientID:
            return get_favourite_persons_for_patient(patientID)
        else:
            return get_all_favourite_persons()
    elif request.method == "POST":
        return insert_a_favourite_person(request)


