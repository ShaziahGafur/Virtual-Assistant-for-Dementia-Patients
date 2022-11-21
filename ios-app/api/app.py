import time
from flask import Flask, request
from flask_cors import CORS, cross_origin
from config import *

import io
from mutagen.mp3 import MP3
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

from pydub import AudioSegment
from pydub.playback import play

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud import storage
import os
import io
import random

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
p_name = 'Mirza'
fp_name = 'Shaziah'
hospital = 'North York General Hospital'
date = 'Sunday, November 13th, 2022'
month = 'November'
year = '2022'
season = 'fall'

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


@app.route('/transcribe_audio', methods=["POST"])
def transcribe_audio(request):
    files = request.files
    wav_file = files["files"]
    transcript = ""

    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS

        # # Instantiates a client
        client = speech.SpeechClient()

        # stored_file = "C:\\Users\\ellen\\Virtual-Assistant-for-Dementia-Patients\\ios-app\\api\\tmp\\" + wav_file.filename + ".wav"
        stored_file = "tmp\\" + wav_file.filename + ".wav"
        wav_file.save(stored_file)

        audio_file_name = wav_file.filename +'.wav'
        
        bucket_name = BUCKET_NAME

        if wav_file:
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            # Upload file to Google Bucket
            blob = bucket.blob(wav_file.filename) 
            blob.upload_from_filename(stored_file)

        gcs_uri = 'gs://'+bucket_name+'/' + wav_file.filename

        audio = speech.RecognitionAudio(uri=gcs_uri)
        print(audio)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=44100,
            language_code="en-US",
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
def download_media(decision):
    
    ## Setting up dummy parameters
    patientID = 1 # ID of patient
    FPID = 1 # FP's ID for that particular patient
    prompt = decision[0] # Prompt 1 was selected, i.e. "How are you doing?"
    prompt = prompt.replace('?', '')

    try:
        bucket_name = "familiar-person-data" 
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GOOGLE_APPLICATION_CREDENTIALS

        storage_client = storage.Client()

        bucket = storage_client.bucket(bucket_name)

        # Set path to download audio file from
        source_blob_name_audio = 'Patients/'+str(patientID)+'/Familiar Person/'+str(FPID)+"/Audio/"+str(prompt)+".mp3"
        blob_audio = bucket.blob(source_blob_name_audio)

        # Set path to download video file from
        source_blob_name_video = 'Patients/'+str(patientID)+'/Familiar Person/'+str(FPID)+"/Videos/"+str(prompt)+".mp4"
        blob_video = bucket.blob(source_blob_name_video)

        # EDIT FILE PATH TO SAVE MEDIA FILES
        destination_file_name = "tmp\\media_from_bucket\\"
        destination_file_name_audio = destination_file_name+"audio_clip.mp3"
        destination_file_name_video = destination_file_name+"video_clip.mp4"

        start_byte = 0 # Reading from beginning
        end_byte = 99999 # SETTING MAX SIZE FOR VIDEO & AUDIO

        # Downloading video and audio clips from bucket
        blob_audio.download_to_filename(destination_file_name_audio, start=0, end=end_byte)

        print("\n[SUCCESS] Downloaded bytes {} to {} of audio object {} from bucket {} to local file {}.".format(
            start_byte, end_byte, source_blob_name_audio, bucket_name, destination_file_name_audio
        ))

        blob_video.download_to_filename(destination_file_name_video, start=0, end=end_byte)

        print("\n[SUCCESS] Downloaded bytes {} to {} of video object {} from bucket {} to local file {}.".format(
            start_byte, end_byte, source_blob_name_video, bucket_name, destination_file_name_video
        ))

    except Exception as e: 
        if str(e).startswith('404'):
            print("[WARNING] Did not find file(s) in bucket! Perhaps this prompt is invalid.\n")
            print(e)

        else:
            print("[ERROR]: Could not download media files from bucket.\n")
            print(e)

        # Play default video 
        print("Retrieving default video & audio.\n")
        
        # Set path to download audio file from
        source_blob_name_audio = 'Patients/'+str(patientID)+'/Familiar Person/'+str(FPID)+"/Audio/Default.mp3"
        blob_audio = bucket.blob(source_blob_name_audio)

        # Set path to download video file from
        source_blob_name_video = 'Patients/'+str(patientID)+'/Familiar Person/'+str(FPID)+"/Videos/Default.mp4"
        blob_video = bucket.blob(source_blob_name_video)

        # Downloading video and audio clips from bucket
        blob_audio.download_to_filename(destination_file_name_audio, start=0, end=end_byte)

        print("\n[SUCCESS] Downloaded bytes {} to {} of DEFAULT audio object {} from bucket {} to local file {}.".format(
            start_byte, end_byte, source_blob_name_audio, bucket_name, destination_file_name_audio
        ))

        blob_video.download_to_filename(destination_file_name_video, start=0, end=end_byte)

        print("\n[SUCCESS] Downloaded bytes {} to {} of DEFAULT video object {} from bucket {} to local file {}.".format(
            start_byte, end_byte, source_blob_name_video, bucket_name, destination_file_name_video
        ))


    ## Trim/pad audio file to match video length

    audio = MP3(destination_file_name_audio)
    audio_duration = audio.info.length


    video_clip = VideoFileClip(destination_file_name_video)
    video_duration = video_clip.duration

    difference = video_duration - audio_duration # difference in seconds
    difference = difference * 1000 # convert to milliseconds
    difference = int(difference)

    audio_out_file = destination_file_name_audio
    video_out_file = destination_file_name_video

    # read mp3 file to an audio segment
    song = AudioSegment.from_mp3(destination_file_name_audio)

    if (difference < 0): # Audio clip is larger than video clip! Trim audio
        final_song = song[:(difference)]
        final_song.export(audio_out_file, format="mp3")

    elif (difference > 0): # Audio clip is too short! Pad clip with silence

        # create silence audio segment, with length = padding_needed
        silence_segment = AudioSegment.silent(duration=difference)  # duration in milliseconds

        #Add above two audio segments    
        final_song = song + silence_segment

        #Either save modified audio
        final_song.export(audio_out_file, format="mp3")

    else:
        song.export(audio_out_file, format="mp3")

    ## Overlay video clip with audio 

    audio_clip = AudioFileClip(audio_out_file)

    new_audio_clip = CompositeAudioClip([audio_clip])
    video_clip.audio = new_audio_clip
    video_clip.write_videofile(video_out_file)

    return

def decision_setup():
    greetings = ["Hi!",
             "Hello!",
             "Hey!",
             "Hello {0}".format(p_name),
             "Hi {0}, nice to see you again!".format(p_name)]

    answers = {
        "who are you?" : ["I am {0}.".format(fp_name)],
        "where am i?" : ["You are in {0}.".format(hospital)],
        "why am i here?" : ["You are in hospital because you are sick."],
        "what day is it today?" : ["Today is {0}.".format(date)],
        "what month is it?" : ["It is {0}.".format(month)],
        "what year is it?" : ["It is the year {0}.".format(year)],
        "what season is it?" : ["It is {0} now.".format(season)],
    }

    prompts = ["How are you doing today?",
            "Do you know where you are?",
            "Do you know what year it is?",
            "Do you know what month it is?",
            "Do you know what season it is?",
            "How many children do you have?",
            "Do you have a spouse? What is their name?",
            "Where do you live?",
            "What are your hobbies?",
            "Are you feeling scared or afraid? Tell me more about how you are feeling.",
            "Do you like to read?",
            "Do you like to sew?",
            "Do you like to exercise?",
            "Tell me about your friends in school.",
            "Tell me about your children."]

    matching_questions = {
        ('where', 'where am i'): "where am i?",
        ('what day', 'what is today', 'what\'s today\'s date', 'what is today\'s date', 'what date is it today', 'which day'): "what day is it today?",
        ('what month', 'which month'): "what month is it?",
        ('what year', 'which year'): "what year is it?",
        ('what season', 'which season'): "what season is it?"
    }

    match_questions = {}
    for k, v in matching_questions.items():
        for key in k:
            match_questions[key] = v
    
    return greetings, answers, prompts, match_questions

def find_matching_question(match_questions, phrase):
  question = phrase
  
  for substring in match_questions:
    if substring in phrase:
      question = match_questions[substring]
  
  return question

def get_response(answers, prompts, match_questions, p_input):
  phrases = p_input.split(". ")
  response = ""

  for phrase in phrases:
    question = find_matching_question(match_questions, phrase)
    if question in answers:
      answer = random.choice(answers[question])
      download_media(answer)
      response = response + answer + " "
  
  prompt = random.choice(prompts)
  download_media(prompt)
  response = response + prompt
  
  return response

@app.route('/generate_decision', methods=["POST"])
def generate_decision():
    transcript = transcribe_audio(request)
    return_value = {"Return":"Failure"}
    if transcript["Transcript"]:
        # call the decision functions
        greetings, answers, prompts, match_questions = decision_setup()
        # change return_value here
        return_value = {"Return": get_response(answers, prompts, match_questions, transcript["Transcript"])}
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
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    # parse first name and last name
    # parse the photo and audio recordings
    # upload those to the google cloud bucket in a new folder

    res = cur.execute("SELECT * FROM Patients")

    result = clean_sql_output(res)

    return result

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