import argparse
import os
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf
import torch

from voice_clone.Real_Time_Voice_Cloning.encoder import inference as encoder
from voice_clone.Real_Time_Voice_Cloning.encoder.params_model import model_embedding_size as speaker_embedding_size
from voice_clone.Real_Time_Voice_Cloning.synthesizer.inference import Synthesizer
from voice_clone.Real_Time_Voice_Cloning.utils.argutils import print_args
from voice_clone.Real_Time_Voice_Cloning.utils.default_models import ensure_default_models
from voice_clone.Real_Time_Voice_Cloning.vocoder import inference as vocoder

from pydub import AudioSegment

def text_to_speech_voice_cloner(dialogues):

    ## Load the models one by one.
    ensure_default_models(Path("voice_clone/Real_Time_Voice_Cloning/saved_models"))
    encoder.load_model(Path("voice_clone/Real_Time_Voice_Cloning/saved_models/default/encoder.pt"))
    synthesizer = Synthesizer(Path("voice_clone/Real_Time_Voice_Cloning/saved_models/default/synthesizer.pt"))
    vocoder.load_model(Path("voice_clone/Real_Time_Voice_Cloning/saved_models/default/vocoder.pt"))

    filename = "voice_clone/Real_Time_Voice_Cloning/audio_clips/FP_audio_clip.wav"

    finish = False

    for phrase in dialogues:
        if finish:
            break
        if len(dialogues) == 1:
            phrase = dialogues[0]
            finish = True
        phrase = phrase.replace(".", "")
        
        try:
            # Get the reference audio filepath
            in_fpath = filename

            ## Computing the embedding
            # First, we load the wav using the function that the speaker encoder provides. This is
            # important: there is preprocessing that must be applied.

            # The following two methods are equivalent:
            # - Directly load from the filepath:
            preprocessed_wav = encoder.preprocess_wav(in_fpath)
            # - If the wav is already loaded:
            original_wav, sampling_rate = librosa.load(str(in_fpath))
            preprocessed_wav = encoder.preprocess_wav(original_wav, sampling_rate)

            # Then we derive the embedding. There are many functions and parameters that the
            # speaker encoder interfaces. These are mostly for in-depth research. You will typically
            # only use this function (with its default parameters):
            embed = encoder.embed_utterance(preprocessed_wav)
            print("Created the embedding")


            ## Generating the spectrogram
            text = phrase
            if text == "ninth":
                text = "nineth"

            # The synthesizer works in batch, so you need to put your data in a list or numpy array
            texts = [text]
            embeds = [embed]
            # If you know what the attention layer alignments are, you can retrieve them here by
            # passing return_alignments=True
            specs = synthesizer.synthesize_spectrograms(texts, embeds)
            spec = specs[0]
            print("Created the mel spectrogram")


            ## Generating the waveform
            print("Synthesizing the waveform:")

            # Synthesizing the waveform is fairly straightforward. Remember that the longer the
            # spectrogram, the more time-efficient the vocoder.
            generated_wav = vocoder.infer_waveform(spec)


            ## Post-generation
            # There's a bug with sounddevice that makes the audio cut one second earlier, so we
            # pad it.
            generated_wav = np.pad(generated_wav, (0, synthesizer.sample_rate), mode="constant")

            # Trim excess silences to compensate for gaps in spectrograms (issue #53)
            generated_wav = encoder.preprocess_wav(generated_wav)

            phrase = phrase.replace("!", "")
            phrase = phrase.replace("?", "")
            # Save it on the disk
            filename = ("voice_clone\\Real_Time_Voice_Cloning\\audio_clips\output\\"+phrase+".wav")
            print(generated_wav.dtype)
            sf.write(filename, generated_wav.astype(np.float32), synthesizer.sample_rate)      
            print("\nSaved output as %s\n\n" % filename)

            # convert .wav files into mp3
            phrase = phrase.replace('?','')
            phrase = phrase.replace('.','')
            AudioSegment.from_wav("voice_clone\\Real_Time_Voice_Cloning\\audio_clips\output\\"+phrase+".wav").export("voice_clone\\Real_Time_Voice_Cloning\\audio_clips\output\\mp3\\"+phrase+".mp3", format="mp3")

        except Exception as e:
            print("Caught exception: %s" % repr(e))
            print("Continuing\n")
            dialogues.append(phrase)

dialogues = [
        "How are you doing today?",
        "Do you know where you are?",
        "Do you know what month it is?",
        "Do you know what year it is?",
        "Do you know what season it is?",
        "How many children do you have?",
        "Do you remember the time when you lost your first tooth?",
        "Do you remember the time when you were going to school?",
        "Do you have a spouse? What is their name?",
        "Where do you live?",
        "What are your hobbies?",
        "Are you feeling scared or afraid? Tell me more about how you are feeling",
        "Do you like to read?",
        "Do you like to sew?",
        "Do you like to exercise?",
        "Tell me about your friends in school",
        "Tell me about your children",
        "You are in hospital because you are sick",
        "You are in North York General Hospital",
        "You must be feeling very scard right now",
        "Did you know that an ostrich's eye is bigger than its brain?",
        "Did you know that the heart of a shrimp is located in its head?",
        "Did you know that potato chips were invented by mistake?",
        "It is",
        "It is fall now",
        "It is winter now",
        "It is spring now",
        "It is summer now",
        "Today is",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
        "first",
        "second",
        "third",
        "fourth",
        "fifth",
        "sixth",
        "seventh",
        "eighth",
        "ninth",
        "tenth",
        "eleventh",
        "twelfth",
        "thirteenth",
        "fourteenth",
        "fifteenth",
        "sixteenth",
        "seventeenth",
        "eighteenth",
        "nineteenth",
        "twentieth",
        "twenty-first",
        "twenty-second",
        "twenty-third",
        "twenty-fourth",
        "twenty-fifth",
        "twenty-sixth",
        "twenty-seventh",
        "twenty-eighth",
        "twenty-ninth",
        "thirtieth",
        "thirty-first",
        "twenty twenty-three",
        "It is the year twenty twenty-three"
    ]

for i, v in enumerate(dialogues):
    text_to_speech_voice_cloner(dialogues[i:i+1])
