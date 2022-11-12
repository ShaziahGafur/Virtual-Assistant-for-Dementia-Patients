
# Imports the Google Cloud client library
from google.cloud import speech
import os

os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = r'C:\Users\ellen\Downloads\indigo-replica-365820-a02e63c8d4a5.json'

# Instantiates a client
client = speech.SpeechClient()

# The name of the audio file to transcribe
gcs_uri = "gs://cloud-samples-data/speech/brooklyn_bridge.raw"

audio = speech.RecognitionAudio(uri=gcs_uri)


config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=16000,
    language_code="en-US",
    enable_automatic_punctuation=True
)

# Detects speech in the audio file
response = client.recognize(config=config, audio=audio)

for result in response.results:
    print("Transcript: {}".format(result.alternatives[0].transcript))
    print("Transcript: {}".format(result))
