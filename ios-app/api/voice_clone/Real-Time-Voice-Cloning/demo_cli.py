import argparse
import os
from pathlib import Path

import librosa
import numpy as np
import soundfile as sf
import torch

from encoder import inference as encoder
from encoder.params_model import model_embedding_size as speaker_embedding_size
from synthesizer.inference import Synthesizer
from utils.argutils import print_args
from utils.default_models import ensure_default_models
from vocoder import inference as vocoder


def text_to_speech_voice_cloner(dialogues):

    ## Load the models one by one.
    ensure_default_models(Path("saved_models"))
    encoder.load_model(Path("saved_models/default/encoder.pt"))
    synthesizer = Synthesizer(Path("saved_models/default/synthesizer.pt"))
    vocoder.load_model(Path("saved_models/default/vocoder.pt"))

    filename = "audio_clips\FP_audio_clip.mp3"

    for phrase in dialogues:
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

            # # Play the audio (non-blocking)
            
            # import sounddevice as sd
            # try:
            #     sd.stop()
            #     sd.play(generated_wav, synthesizer.sample_rate)
            # except sd.PortAudioError as e:
            #     print("\nCaught exception: %s" % repr(e))
            #     print("Continuing without audio playback. Suppress this message with the \"--no_sound\" flag.\n")
            # except:
            #     raise

            # Save it on the disk
            filename = ("audio_clips\output\\"+phrase+".wav").replace("?", "")
            print(generated_wav.dtype)
            sf.write(filename, generated_wav.astype(np.float32), synthesizer.sample_rate)      
            print("\nSaved output as %s\n\n" % filename)


        except Exception as e:
            print("Caught exception: %s" % repr(e))
            print("Restarting\n")


dialogues = [
"How are you doing today",
"Do you know where you are",
"Do you know what month it is",
"Do you know what season it is",
"How many children do you have",
"Do you have a spouse What is their name",
"What are your hobbies",
"Are you feeling scared or afraid?", 
"Tell me more about how you are feeling",
"Do you like to read",
"Do you like to sew",
"Do you like to exercise",
"Tell me about your friends in school",
"Tell me about your children",
"You are in hospital because you are sick",
"You are in North York General Hospital",
]

text_to_speech_voice_cloner(dialogues)