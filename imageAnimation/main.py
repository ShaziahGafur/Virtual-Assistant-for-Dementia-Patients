import numpy as np
import sys
import os
import pickle
from google.cloud import storage
def download_model_file(audio, image, name, patient_id, FP_id):
    # Model Bucket details
    BUCKET_NAME        = "familiar-person"
    PROJECT_ID         = "capstone-374405"
    GCS_MODEL_FILE     = "Patients/{}/Familiar Person/{}/Audio/{}".format(patient_id,FP_id,audio)

    BUCKET_NAME2        = "familiar-person-form-data"
    GCS_MODEL_FILE2     = "{}/{}".format(name,image)


    # Initialise a client
    client   = storage.Client(PROJECT_ID)
    
    # Create a bucket object for our bucket
    bucket   = client.get_bucket(BUCKET_NAME)
    bucket2   = client.get_bucket(BUCKET_NAME2)

    # Create a blob object from the filepath
    blob     = bucket.blob(GCS_MODEL_FILE)
    blob2     = bucket2.blob(GCS_MODEL_FILE2)

    folder = '/tmp/'
    if not os.path.exists(folder):
      os.makedirs(folder)
    # Download the file to a destination
    blob.download_to_filename(folder + audio)
    blob2.download_to_filename(folder + image)

    return 0

def add_quotes(a):
    b = '"' + a + '"'
    return b
def upload_model_file(video_name,patient_id,FP_id):
    BUCKET_NAME        = "familiar-person"
    PROJECT_ID         = "capstone-374405"
    GCS_MODEL_FILE     = "Patients/{}/Familiar Person/{}/combinedVideos/{}".format(patient_id,FP_id,video_name)
    client   = storage.Client(PROJECT_ID)
    
    # Create a bucket object for our bucket
    bucket   = client.get_bucket(BUCKET_NAME)
    
    # Create a blob object from the filepath
    blob     = bucket.blob(GCS_MODEL_FILE)
    # Download the file to a destination
    upload_loc = "SadTalker/examples/results/photo##{0}".format(video_name)
    blob.upload_from_filename(upload_loc)
    return 0

def iris_predict(request):
    params = request.get_json()
    download_model_file(params['audio']+".wav", params['image'], params['name'], params['patientId'], params['fpId'])
    req = "ls"
    os.system(req)
    path  = "/tmp/" 
    clone = "git clone https://github.com/ruqhia/SadTalker.git" 
    os.chdir(path) # Specifying the path where the cloned project needs to be copied
    os.system(clone) # Cloning
    img = "photo.png"
    audio = params['audio'] +".wav"
    audio = add_quotes(audio)
    req = "update-alternatives --install /usr/local/bin/python3 python3 /usr/bin/python3.8 2 && update-alternatives --install /usr/local/bin/python3 python3 /usr/bin/python3.9 1 && python --version && apt-get update && apt install software-properties-common && sudo dpkg --remove --force-remove-reinstreq python3-pip python3-setuptools python3-wheel && apt-get install python3-pip && cd SadTalker && export PYTHONPATH=/content/SadTalker:$PYTHONPATH && python3.8 -m pip install torch==1.12.1+cu113 torchvision==0.13.1+cu113 torchaudio==0.12.1 --extra-index-url https://download.pytorch.org/whl/cu113 && apt update && apt install ffmpeg &> /dev/null && python3.8 -m pip install cmake==3.25.2 && python3.8 -m pip install boost==0.1  && python3.8 -m pip install dlib-bin && cd SadTalker && ls -la && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/auido2exp_00300-model.pth -O ./checkpoints/auido2exp_00300-model.pth && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/auido2pose_00140-model.pth -O ./checkpoints/auido2pose_00140-model.pth && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/epoch_20.pth -O ./checkpoints/epoch_20.pth && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/facevid2vid_00189-model.pth.tar -O ./checkpoints/facevid2vid_00189-model.pth.tar && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/shape_predictor_68_face_landmarks.dat -O ./checkpoints/shape_predictor_68_face_landmarks.dat && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/wav2lip.pth -O ./checkpoints/wav2lip.pth && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/mapping_00229-model.pth.tar -O ./checkpoints/mapping_00229-model.pth.tar && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/BFM_Fitting.zip -O ./checkpoints/BFM_Fitting.zip && wget https://github.com/Winfredy/SadTalker/releases/download/v0.0.1/hub.zip -O ./checkpoints/hub.zip && unzip ./checkpoints/hub.zip -d ./checkpoints/ && unzip ./checkpoints/BFM_Fitting.zip -d ./checkpoints/ &&  pip install git+https://github.com/TencentARC/GFPGAN.git@8d2447a2d918f8eba5a4a01463fd48e45126a379 --prefer-binary && ls -la && cd .. && ls -la && mv photo.png SadTalker && mv {0} SadTalker && cd SadTalker && ls -la && pip install -r requirements.txt && python3.8 inference.py --driven_audio {0} --source_image photo.png  --result_dir ./examples/results --cpu && ls -la && cd examples && ls -la && cd results && ls -la".format(audio)

    os.system(req)
    upload_model_file(params['audio']+".mp4", params['patientId'], params['fpId'])
    return '{"status":"200", "data": "OK"}'