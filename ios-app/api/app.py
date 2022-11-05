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

### This function takes in a particular patient, FP, and conversation decision
@app.route('/download_media', methods=["POST"])
def download_media():
    
    ## Setting up dummy parameters
    patientID = 1 # ID of patient
    FPID = 1 # FP's ID for that particular patient
    prompt = 1 # Prompt 1 was selected, i.e. "How are you doing?"

    # print(request.files)
    # files = request.files
    # print(files["files"])
    # wav_file = files["files"]
    # Imports the Google Cloud client library
    from google.cloud import speech
    from google.cloud import storage
    import os
    import io

    try:
        # NEED TO DO: get key for bucket 'familiar-person-data'
        bucket_name = "familiar-person-data" 
        # REPLACE KEY
        os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Users\ellen\Downloads\indigo-replica-365820-a02e63c8d4a5.json'

        storage_client = storage.Client()
        bucket = storage_client.bucket(bucket_name)

        # Set path to download audio file from
        source_blob_name_audio = 'Patients/'+str(patientID)+'/Familiar Person/'+str(FPID)+"/Audio/Prompt "+str(prompt)
        blob_audio = bucket.blob(source_blob_name_audio)

        # Set path to download video file from
        source_blob_name_video = 'Patients/'+str(patientID)+'/Familiar Person/'+str(FPID)+"/Video/Prompt "+str(prompt)
        blob_video = bucket.blob(source_blob_name_video)

        # EDIT FILE PATH TO SAVE MEDIA FILES
        destination_file_name = "C:\\Users\\ellen\\Virtual-Assistant-for-Dementia-Patients\\ios-app\\api\\tmp\\media-from-bucket\\"
        destination_file_name_audio = destination_file_name+"audio_clip.mp3"
        destination_file_name_video = destination_file_name+"video_clip.mp4"

        start_byte = 0 # Reading from beginning
        end_byte = 99999 # SETTING MAX SIZE FOR VIDEO & AUDIO

        # Downloading video and audio clips from bucket
        blob_audio.download_to_filename(destination_file_name_audio, start=0, end=end_byte)

        print("Downloaded bytes {} to {} of audio object {} from bucket {} to local file {}.".format(
            start_byte, end_byte, source_blob_name_audio, bucket_name, destination_file_name_audio
        ))

        blob_video.download_to_filename(destination_file_name_video, start=0, end=end_byte)

        print("Downloaded bytes {} to {} of video object {} from bucket {} to local file {}.".format(
            start_byte, end_byte, source_blob_name_video, bucket_name, destination_file_name_video
        ))

        with io.open(destination_file_name_audio, "rb") as audio_file:
            audio_content = audio_file.read()

        with io.open(destination_file_name_video, "rb") as video_file:
            video_content = video_file.read()

        # Next step: trim/pad audio file to match video length

    except e:
        print(e)

    return
