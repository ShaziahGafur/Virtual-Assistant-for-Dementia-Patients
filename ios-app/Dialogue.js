import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { REACT_APP_BACKEND_API } from "@env";
import { Audio } from "expo-av";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import axios from "axios";
import PlayAudioVideo from "./PlayAudioVideo";

console.log(REACT_APP_BACKEND_API);

const recordingOptions = {
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

let recording = new Audio.Recording();
let stepOne;

export default function Dialogue() {
  //   const [recording, setRecording] = React.useState();
  const [transcript, setTranscript] = React.useState("");
  const [soundIsPlaying, setSoundIsPlaying] = React.useState(false);
  const [recordingLocation, setRecordingLocation] = React.useState("");

  const [sound, setSound] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);

  const THIRTY_S = 60000 / 6; // this was 2 before

  useEffect(() => {
    startAsyncRecording = async () => {
      await startRecording();
    };

    stopAsyncRecording = async () => {
      await stopRecording();
    };

    asyncGetTranscription = async () => {
      await getRecordingTranscription();
    };

    startAsyncRecording();
    const interval = setInterval(() => {
      if (stepOne == false || stepOne == undefined) {
        console.log("in the step of stopping recording + get transcript");
        stopAsyncRecording();
        asyncGetTranscription();
        stepOne = true;
      } else {
        console.log("in the step of rerecording");
        startAsyncRecording();
        stepOne = false;
      }
    }, THIRTY_S);

    return () => {
      clearInterval(interval);
      recording.stopAndUnloadAsync();
    };
  }, []);

  async function startRecording() {
    recording = new Audio.Recording();
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecordingLocation(uri);
    console.log("Recording stopped and stored at", uri);
  }

  async function getRecordingTranscription() {
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
      {<PlayAudioVideo></PlayAudioVideo>}
      {/* { && <Text>Not Recording</Text>} */}
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
});
