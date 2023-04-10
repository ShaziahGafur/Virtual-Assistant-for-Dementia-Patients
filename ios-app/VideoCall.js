import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import { REACT_APP_BACKEND_API } from "@env"
import { Audio } from "expo-av";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import axios from "axios";
import PlayAudioVideo from "./PlayAudioVideo";
import hangup from './assets/hangup.png';
import { useIsFocused } from "@react-navigation/native";


console.log(REACT_APP_BACKEND_API);

const recordingOptions = {
  isMeteringEnabled:true,
  // android not currently in use, but parameters are required
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

// pass these in later on
// const patient_ID = 1;
// const FP_ID = 1;

const RECORDING_STOP_SECONDS = 2 * 1000 / 500; // 5 seconds
const RECORDING_STOP_DB = -27; // if its less than -20, keep going
let counter = 0;

let recording = new Audio.Recording();
let stepOne;

export default function Dialogue({ route, navigation }) {

  const isFocused = useIsFocused();

  const { patient_ID, FP_ID } = route.params;

  //   const [recording, setRecording] = React.useState();
  const [transcript, setTranscript] = React.useState("");
  const [soundIsPlaying, setSoundIsPlaying] = React.useState(false);
  const [recordingLocation, setRecordingLocation] = React.useState("");
  const [recordingStatus, setRecordingStatus] = React.useState(Audio.RecordingStatus);
  const [videoFinished, setVideoFinished] = React.useState(false);

  const [sound, setSound] = React.useState();
  const [loadingScreen, setLoadingScreen] = React.useState(true);
  const [isFetching, setIsFetching] = React.useState(false);

  useEffect(() => {
   
    if (isFocused == true){
    if (loadingScreen == true){
      // you need this or else it won't populate the prompts on the backend
      downloadFPMedia();
      }
      else{
        console.log(recordingStatus);
        if (videoFinished != undefined && videoFinished == true){
            startAsyncRecording();
        }
      }
    }
  }, [loadingScreen, isFocused, videoFinished]);

  startAsyncRecording = async () => {
    await startRecording();
  };

  stopAsyncRecording = async () => {
    await stopRecording();
  };

  asyncGetTranscription = async () => {
    await getRecordingTranscription();
  };

  async function downloadFPMedia() {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      patient_ID:patient_ID,
      FP_ID:FP_ID
    };
    console.log(body);
    const response = await axios.get(
      REACT_APP_BACKEND_API + "/download_fp_media",
      {
        params: body,
        headers: header,
        method: "GET",
      }
    );
    console.log(response.data);
    if (response.data["Result"] == "Success"){ 
      console.log("All videos successfully downloaded, start call");
      setLoadingScreen(false);
    }    
  }

  function handleVideoFinishedChange(videoFinishedStatus){
    console.log("in handle video finished change");
  }

  function checkIfShouldStopRecording(status) {
    // if it is currently recording
    if (status.isRecording == true && status.durationMillis > 0){
      console.log(counter);
      if (status.metering < RECORDING_STOP_DB){
        counter += 1;
      }
      else{
        counter = 0;
      }
      if (counter > RECORDING_STOP_SECONDS){
        counter = 0;
        stopAsyncRecording();
        asyncGetTranscription();
      }
    }
  }

  async function startRecording() {
    console.log("recording status:");
    console.log(recordingStatus);
    if (recordingStatus == undefined || (recordingStatus.isRecording == false && recordingStatus.canRecord == true)){
    recording = new Audio.Recording();
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      recording.setOnRecordingStatusUpdate((status) =>
      {
        // setRecordingStatus(status);
        /*
        Metering: A number that's the most recent reading of the loudness in dB. 
        The value ranges from –160 dBFS, indicating minimum power, to 0 dBFS, 
        indicating maximum power.*/
        checkIfShouldStopRecording(status);
        console.log(status)
      }
        
    );
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      await recording.prepareToRecordAsync(
        recordingOptions
      );
      await recording.startAsync();
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }
  else{
    console.log("tried to start recording, but it's already recording.")
  }
  }

  async function endCall(){
    console.log("call ended!");
    console.log(recordingStatus);
    // if (recordingStatus != undefined){
    //   stopRecording();
    // }
    // if (recordingStatus.isRecording == true){ // is currently recording, stop it immediately
    //   await stopRecording();
    // }
    // recording = new Audio.Recording();
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.get(
      REACT_APP_BACKEND_API + "/end_call",
      {
        headers: header,
        method: "GET",
      }
    );
    navigation.navigate("Home");
  }

  async function stopRecording() {
    try{
    console.log("Stopping recording..");
    recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingLocation(uri);
    console.log("Recording stopped and stored at", uri);
    }
    catch (error){
      console.log(error);
    }
  }

  async function getRecordingTranscription() {
    console.log("in async get transcription!");
    setIsFetching(true);
    try {
      const uri = recording.getURI();
      console.log(`FILE INFO: ${JSON.stringify(uri)}`);
      const formData = new FormData();
      const file = {
        uri,
        type: "audio/x-wav",
        name: "speech2text",
      };
      formData.append("files", file);
      let str = JSON.stringify(formData);
      const header = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const response = await axios.post(
        REACT_APP_BACKEND_API + "/generate_decision",
        formData,
        {
          headers: header,
          method: "POST",
        }
      );
      console.log(response.data);
      const data = response.data;
      setTranscript(data.transcript);
      console.log(transcript);
    } catch (error) {
      console.log("There was an error reading file", error);
    }
    setIsFetching(false);
  }

  return (
    <View style={styles.video}>
      {recording && <Text>Recording</Text>}
      {<PlayAudioVideo loadingScreen={loadingScreen} videoFinished={videoFinished} setVideoFinished={setVideoFinished}></PlayAudioVideo>}
      <View style={styles.hangupView}>
      <TouchableOpacity onPress={()=> endCall()}>
      <Image source={hangup} style={styles.hangup} alt="hangup." />
      </TouchableOpacity>
      </View>
      {!isFetching && transcript && <Text>{transcript}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    alignItems: "center",
  },
  video: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "black",
  },
  button: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonStyling: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
  hangupView:{
    alignItems:'center',
    justifyContent: 'center',
  },
  hangup :{
    resizeMode: 'contain', 
    width: 80,
    height:80,
    marginBottom: 100
  }
});
