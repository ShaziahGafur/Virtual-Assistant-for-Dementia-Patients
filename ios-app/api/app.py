import time
from flask import Flask
from flask_cors import CORS, cross_origin
from flask import request

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
    # body = request.json['body']
    # uri = request.json['body']
    # print(uri)
    # Imports the Google Cloud client library
    from google.cloud import speech
    import os

    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Users\ellen\Downloads\indigo-replica-365820-a02e63c8d4a5.json'

        # Instantiates a client
        client = speech.SpeechClient()

        # The name of the audio file to transcribe
        gcs_uri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw"

        audio = speech.RecognitionAudio(uri=gcs_uri)

        config = speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
            sample_rate_hertz=44100,
            language_code="en-US",
        )

        # Detects speech in the audio file
        response = client.recognize(config=config, audio=audio)
        
        for result in response.results:
            print("Transcript: {}".format(result.alternatives[0].transcript))
    except e:
        print(e)
    return {"transcript":result.alternatives[0].transcript}


@app.route('/transcribe_audio', methods=["POST"])
def transcribe_audio():
    # uri = request.json['data']
    # print(uri)
    print(request.files)
    files = request.files
    print(files["files"])
    wav_file = files["files"]
    # Imports the Google Cloud client library
    from google.cloud import speech
    from google.cloud import storage
    import os
    import io

    try:
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Users\ellen\Downloads\indigo-replica-365820-a02e63c8d4a5.json'

        # # Instantiates a client
        client = speech.SpeechClient()

        stored_file = "C:\\Users\\ellen\\Virtual-Assistant-for-Dementia-Patients\\ios-app\\api\\tmp" + "\\" + wav_file.filename + ".wav"
        wav_file.save(stored_file)

        audio_file_name = wav_file.filename +'.wav'

        print(stored_file)
        
        bucket_name = "indigo-replica-365820.appspot.com" 

        if wav_file:
            print("wav_file!")
            bucket_name = "indigo-replica-365820.appspot.com" 
            storage_client = storage.Client()
            bucket = storage_client.bucket(bucket_name)
            print(bucket)
            # Upload file to Google Bucket
            blob = bucket.blob(wav_file.filename) 
            blob.upload_from_filename(stored_file)

        gcs_uri = 'gs://'+bucket_name+'/' + wav_file.filename

        # with io.open(stored_file, "rb") as audio_file:
        #     content = audio_file.read()

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
