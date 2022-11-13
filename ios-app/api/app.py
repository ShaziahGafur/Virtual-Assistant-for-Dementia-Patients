import time
from flask import Flask, request
from flask_cors import CORS, cross_origin
from config import *

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud import storage
import os
import io

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
def transcribe_audio():
    files = request.files
    wav_file = files["files"]
    result = ""
    
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

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=44100,
            language_code="en-US",
        )

        response = client.recognize(config=config, audio=audio)

        for result in response.results:
            print("Transcript: {}".format(result))
    except e:
        print(e)
    return {"transcript": result.alternatives[0].transcript}

# Database stuff below -- put this in another file later
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Integer, Column, ForeignKey
import sqlite3

# Returns the result as a dict with the column names
def clean_sql_output(res):
    columns = res.description 
    result = [{columns[index][0]:column for index, column in enumerate(value)} for value in res.fetchall()]
    return result

@app.route("/db/patients")
def select_all_patients():
    # find a way to make the first two lines able to be taken out, it'll throw a wrong thread error otherwise
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM Patients")

    result = clean_sql_output(res)
   
    # print("Total number of schools is", Patients.query.count())
    return result

@app.route("/db/favouritepersons")
def select_all_favourite_persons():
    con = sqlite3.connect(DATABASE)
    cur = con.cursor()

    res = cur.execute("SELECT * FROM FavouritePersons")

    result = clean_sql_output(res)
   
    # print("Total number of schools is", Patients.query.count())
    return result