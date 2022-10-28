import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

// const axios = require("axios");

API_KEY="AIzaSyBnBJgVDH5E0_bJ_9xzaCWIEl9JczBXRvU";
NGROK_API = "https://cd05-184-146-153-206.ngrok.io";

export default function RecordAudio() {
  const [recording, setRecording] = React.useState();
  const [transcript, setTranscript] = React.useState("");
  const [soundIsPlaying, setSoundIsPlaying] = React.useState(false);
  const [recordingLocation, setRecordingLocation] = React.useState("");
  // const [finishedRecording, setFinishedRecording] = React.useState(false);
  
  const [sound, setSound] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);

  // let recordingLocation = "";

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync(); 
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    // setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    // recordingLocation = uri;
    setRecordingLocation(uri);
    console.log('Recording stopped and stored at', uri);
  }

  async function playRecording() {
    console.log('Playing Recording');
    const uri = recording.getURI(); 
    const { sound } = await Audio.Sound.createAsync({uri: recording. getURI() || URIFROMFileSystem});
    
    setSound(sound);
    setSoundIsPlaying(true);
    await sound.playAsync();
  }

  async function playSampleSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./assets/sounds/example.mp3')
    );
    setSound(sound);
    setSoundIsPlaying(true);
    console.log('Playing Sound');
    await sound.playAsync();
  }

  const getRecordingTranscription = async () => {
    setIsFetching(true);
    try {
        // const info = await Audio.Sound.getInfoAsync(recording.getURI());
        // console.log(`FILE INFO: ${JSON.stringify(info)}`);
    //     const recording = await Audio.Sound.createAsync( require('./assets/sounds/example.mp3')
    // );'
    // console.log(this.recording);
    // const info = await FileSystem.getInfoAsync(recording.getURI());
    // console.log(`FILE INFO: ${JSON.stringify(info)}`);
    // const uri = info.uri;
    const uri = recording.getURI();
        console.log(`FILE INFO: ${JSON.stringify(uri)}`);
        // const uri = recording.getURI();
        // console.log(uri);
        const formData = new FormData();
        // form.append('files[]', file)
        const file = {
          uri,
          type: 'audio/x-wav',
          name: 'speech2text'
      };
        formData.append('files', file);
        formData.append("woor","w")
        let str = JSON.stringify(formData);
        console.log(str);
        const header = {
          headers: { 'Content-Type': 'multipart/form-data'}
     }
        // console.log("formData");
        console.log(str);
        const response = await axios.post(NGROK_API+"/transcribe_audio",formData, {
          headers: header,
          method: 'POST',
            
            // body: {'hello':'world'}
        },           
        );
        const data = response.data;
        // console.log(data.data);
        // console.log("data");
        // console.log(data);
        setTranscript(data.transcript);
    } catch(error) {
        console.log('There was an error reading file', error);
        // stopRecording();
        // resetRecording();
    }
    setIsFetching(false);
}

  const getSampleAudioTranscription = async () => {
    setIsFetching(true);
    try {
        // const info = await Audio.Sound.getInfoAsync(recording.getURI());
        // console.log(`FILE INFO: ${JSON.stringify(info)}`);
    //     const recording = await Audio.Sound.createAsync( require('./assets/sounds/example.mp3')
    // );'
    // console.log(this.recording);
    // const info = await FileSystem.getInfoAsync(recording.getURI());
    // console.log(`FILE INFO: ${JSON.stringify(info)}`);
    // const uri = info.uri;
    // const uri = recording.getURI();
        // const uri = recording.getURI();
        // console.log(uri);
        // const formData = new FormData();
        // formData.append('file', {
        //     uri,
        //     type: 'audio/x-wav',
        //     name: 'speech2text'
        // });
        // console.log("formData");
        // console.log(formData);
        const response = await fetch(NGROK_API+"/transcribe_sample_audio", {
            method: 'POST',
            // body: formData
        });
        const data = await response.json();
        console.log("data");
        console.log(data);
        setTranscript(data.transcript);
    } catch(error) {
        console.log('There was an error reading file', error);
        // stopRecording();
        // resetRecording();
    }
    setIsFetching(false);
}


  async function stopPlayingRecording() {
    console.log("stop playing sound")
    setSoundIsPlaying(false);
    sound.unloadAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
        {/* <Button title={"Play Sample Sound"}
      onPress={playSampleSound
    }></Button> */}
    {
      !recordingLocation &&
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
    }
      {
      recording && <Text>Recording saved at: {recordingLocation}</Text>
    }
      {recording && <Button
      title={"Play Recording"}
      onPress={playRecording
    }
    ></Button>
        }
        
        { soundIsPlaying && 
           <Button
            title={"Stop Playing"}
            onPress={stopPlayingRecording}>
            </Button>
        }
        <Button title={"Get Sample Transcription"} onPress={getSampleAudioTranscription}></Button>
        <Button title={"Get Recording Transcription"} onPress={getRecordingTranscription}></Button>
        <Text>Transcription: {transcript}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
});

const recordingOptions = {
    // android not currently in use, but parameters are required
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};