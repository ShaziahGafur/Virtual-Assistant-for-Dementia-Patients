//https://www.waldo.com/blog/add-an-image-picker-react-native-app

import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  Button,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import * as ImagePicker from "expo-image-picker";
import { Audio } from 'expo-av';
import * as FileSystem from "expo-file-system";

import { REACT_APP_BACKEND_API } from "@env"

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


const fetchData = async () => {
  const header = {
    headers: { "Content-Type": "application/json" },
  };
  const response = await axios.get(
    REACT_APP_BACKEND_API + "/db/patients",
    {
      headers: header,
      method: "GET",
    }
  );
  return response.data;
};

let recordingOne = new Audio.Recording();
let recordingTwo = new Audio.Recording();
let recordingThree = new Audio.Recording();


export default function CreateProfile({navigation}) {
  const [image, setImage] = useState(null);
  const [patients, setPatients] = useState([]);

  const [firstNameFP, setFirstNameFP] = React.useState(null);
  const [lastNameFP, setLastNameFP] = React.useState(null);

  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value, setValue] = useState(null);

  const [sound, setSound] = React.useState();
  const [recordingOneIsPlaying, setRecordingOneIsPlaying] = React.useState(false);
  const [recordingTwoIsPlaying, setRecordingTwoIsPlaying] = React.useState(false);
  const [recordingThreeIsPlaying, setRecordingThreeIsPlaying] = React.useState(false);

  const [recordingOneRecording, setRecordingOneRecording] = React.useState(null);
  const [recordingTwoRecording, setRecordingTwoRecording] = React.useState(null);
  const [recordingThreeRecording, setRecordingThreeRecording] = React.useState(null);
  
  const [recordingOneLocation, setRecordingOneLocation] = React.useState(null);
  const [recordingTwoLocation, setRecordingTwoLocation] = React.useState(null);
  const [recordingThreeLocation, setRecordingThreeLocation] = React.useState(null);

      // let recording = new Audio.Recording();

    startRecording = async(number) => {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      if (number == 1){
        console.log("record 1");
        
      recordingOne = new Audio.Recording();
      await recordingOne.prepareToRecordAsync(recordingOptions);
      await recordingOne.startAsync();
        setRecordingOneRecording(recordingOne);
      }
      else if (number == 2){
        console.log("record 2");

      recordingTwo = new Audio.Recording();
      await recordingTwo.prepareToRecordAsync(recordingOptions);
      await recordingTwo.startAsync();
        setRecordingTwoRecording(recordingTwo);
      }
      else if (number == 3){
        console.log("record 3");

      recordingThree = new Audio.Recording();
      await recordingThree.prepareToRecordAsync(recordingOptions);
      await recordingThree.startAsync();
        setRecordingThreeRecording(recordingThree);
      }
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  stopRecording = async(number) => {
    console.log("Stopping recording..");
    if (number == 1){
        console.log("stop 1");
        await recordingOne.stopAndUnloadAsync();
        const uri = recordingOne.getURI();
        setRecordingOneLocation(uri);
      }
      else if (number == 2){
        console.log("stop 2");
        await recordingTwo.stopAndUnloadAsync();
        const uri = recordingTwo.getURI();
        setRecordingTwoLocation(uri);
      }
      else if (number == 3){
        console.log("stop 3");
        await recordingThree.stopAndUnloadAsync();
        const uri = recordingThree.getURI();
        setRecordingThreeLocation(uri);
      }
    // console.log("Recording stopped and stored at", uri);
  }


  stopPlayingRecording = async(number) => {
    console.log("stop playing sound");
    if (number == 1){
    setRecordingOneIsPlaying(false);
      }
      else if (number == 2){
    setRecordingTwoIsPlaying(false);
      }
      else if (number == 3){
    setRecordingThreeIsPlaying(false);
      }
    sound.unloadAsync();
  }

  // TODO: change the state of which recording is playing back to false when the sound finishes
  //   React.useEffect(() => {
  //   return sound
  //     ? () => {
  //         console.log('Unloading Sound');
  //         setRecordingOneIsPlaying(false);
  //         setRecordingTwoIsPlaying(false);
  //         setRecordingThreeRecording(false);
  //         sound.unloadAsync();
  //       }
  //     : undefined;
  // }, [sound]);


  playRecording = async(number) => {
    console.log("Playing Recording");
    //const uri = recording.getURI();
    let uri; 
    if (number == 1){
        uri = recordingOneLocation;
        setRecordingOneIsPlaying(true);
      }
      else if (number == 2){
        uri = recordingTwoLocation;
        setRecordingTwoIsPlaying(true);

      }
      else if (number == 3){
        uri = recordingThreeLocation;
        setRecordingThreeIsPlaying(true);
      }
    const { sound } = await Audio.Sound.createAsync({
      uri: uri || URIFROMFileSystem,
    });

    setSound(sound);
    await sound.playAsync();
  }

  deleteRecording = async(number) => {
    console.log("now deleting recording");
    console.log(number);
    let recordingToDelete;
        if (number == 1){
        recordingToDelete = recordingOne;
      }
      else if (number == 2){
                recordingToDelete = recordingTwo;
      }
      else if (number == 3){
                recordingToDelete = recordingThree;
      }
    try {
      // this for whatever reason the bottom two lines arent working ?? so uh just setting them back to null 
      // (TODO) actually delete them later on because right now we're just setting a new recording and the old file is still there
      // const info = await FileSystem.getInfoAsync(recordingToDelete.getURI());
      // await FileSystem.deleteAsync(info.uri);
      let recordingToDelete;
        if (number == 1){
        setRecordingOneIsPlaying(false);
        recordingOne = null;
        setRecordingOneLocation(null);
        setRecordingOneRecording(null);
      }
      else if (number == 2){
        
        setRecordingTwoIsPlaying(false);
        recordingTwo = null;
        setRecordingTwoLocation(null);
        setRecordingTwoRecording(null);
      }
      else if (number == 3){
        
        setRecordingThreeIsPlaying(false);
        recordingThree = null;
        setRecordingThreeLocation(null);
        setRecordingThreeRecording(null);
      }
    } catch (error) {
      console.log("There was an error deleting recording file", error);
    }
  }

  const deleteConfirmationAlert = (number) =>
    Alert.alert('Confirm Recording Deletion', 'Are you sure you want to delete Recording '+ number + "?", [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Delete', onPress: () => deleteRecording(number)},
    ]);

  getPatients = async () => {
    let data = await fetchData();
    // console.log(data);
    let new_data = [];
    for (let i = 0; i <data.length; i++){
      new_data.push({label: data[i]["FirstName"] +" "+ data[i]["LastName"] + " (ID: " + data[i]["PatientID"] + ")", value: data[i]["PatientID"]});
    }
    setPatients(new_data);
  };

  useEffect(() => {
    getPatients();
  }, [patients]);


  const addImageFromStorage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(JSON.stringify(_image));
    if (!_image.cancelled) {
      setImage(_image.uri);
      const wholeFileName = _image.url;
      const fileName = _image.uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      console.log("image", wholeFileName, fileName, fileType);
    }
  };

  const takeImageWithCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    // Explore the result
    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
      const wholeFileName = result.url;
      const fileName = result.uri.split('/').pop();
      const fileType = fileName.split('.').pop();
      console.log("image", wholeFileName, fileName, fileType);
    }
  };

  const onSubmit = async () => {
    const header = {
        headers: { "Content-Type": "multipart/form-data" },
      };
    const FP_info = {
      firstName: firstNameFP,
      lastName: lastNameFP,
      patientID: value,
    };
    const formData = new FormData();
      const photo_file = {
        uri:"file://"+image,
        type: "image/jpg",
        name: "photo",
      };
      
      const recording_one_uri = recordingOne.getURI();
      console.log(`FILE INFO: ${JSON.stringify(recording_one_uri)}`);
      // const recording_two_uri = recordingTwo.getURI();
      // const recording_three_uri = recordingThree.getURI();

      const recording_one_file = {
        uri: recording_one_uri,
        type: "audio/x-wav",
        name: "recording_1",
      };
      
      // const recording_two_file = {
      //   uri: recording_two_uri,
      //   type: "audio/x-wav",
      //   name: "recording_2",
      // };
      
      // const recording_three_file = {
      //   uri: recording_three_uri,
      //   type: "audio/x-wav",
      //   name: "recording_3",
      // };
      console.log(recording_one_file);
      formData.append("recordingOneFile", recording_one_file);
      // formData.append("recordingTwoFile", recording_two_file);
      // formData.append("recordingThreeFile", recording_three_file);
      formData.append("photoFile", photo_file);

      //remember you can't add an object to a form data if its not a file, so you need to following for loop
      for ( var key in FP_info ) {
    formData.append(key, FP_info[key]);
}
      let str = JSON.stringify(formData);

    const response = await axios.post(
      REACT_APP_BACKEND_API + "/db/favouritepersons",
      formData,
      {
        headers: header,
        method: "POST",
      }
    );
    const data = response.data;
    if (data["result"] == "Success") {
      console.log("in success!!");
      setFormSubmitted(true);
    }
  };
 
  if (formSubmitted == false) {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.subtitleText}>PATIENT SEARCH</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={value}
          items={patients}
          placeholder={"Select a Patient"}
          setOpen={setDropdownOpen}
          setValue={setValue}
          setItems={setPatients}
        />
        <Text></Text>
        <Text style={styles.subtitleText}>FAMILIAR PERSON'S FIRST NAME</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFirstNameFP}
          value={firstNameFP}
        />
        <Text style={styles.subtitleText}>FAMILIAR PERSON'S LAST NAME</Text>
        <TextInput
          style={styles.input}
          onChangeText={setLastNameFP}
          value={lastNameFP}
        />
        <Text style={styles.subtitleText}>ADD PHOTO</Text>
        <Text style={styles.text}>Image Preview: </Text>
        <View style={{flexDirection:"row"}}>
          <View style={{flex:1}}>
        <View style={imageUploaderStyles.container}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <View style={imageUploaderStyles.uploadBtnContainer}>
            <TouchableOpacity
              onPress={addImageFromStorage}
              style={imageUploaderStyles.uploadBtn}
            >
              <Text style={imageUploaderStyles.uploadImageText}>
                {image ? "Edit" : "Upload"} Image
              </Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        </View>
        <View style={{position:"absolute", left:"30%", top:"50%"}}>
          <Text style={{fontSize:"20"}}>OR</Text>
          </View>
        <View style={{position:"absolute", left:"40%", top:"45%"}}>
          <Pressable
          style={styles.regularButtonStyling}
          onPress={() => takeImageWithCamera()}
        >
          <Text style={styles.regularButtonTextStyling}>Open Camera</Text>
          </Pressable> 
        </View>
        </View>
        <Text></Text>
        <Text style={styles.subtitleText}>Voice Recordings</Text>
        <View>
        <View>{! recordingOneLocation && 
              <Button
                title={recordingOneRecording ? 'Stop Recording One' : 'Start Recording One'}
                onPress={recordingOneRecording ? ()=>stopRecording(1) : ()=>startRecording(1)}
              />
              }
            </View>
            {recordingOneLocation && (
        <Button title={recordingOneIsPlaying == false ? "Play Recording One" : "Stop Playing Recording One"} onPress={recordingOneIsPlaying == false ? ()=>playRecording(1) : ()=>stopPlayingRecording(1)}></Button>
      )}
          {recordingOneLocation && (
        <Button title={"Delete Recording One"} onPress={() => deleteConfirmationAlert(1)}></Button>
      )}
      </View>
      {/* <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }}
/>
      <View>
        <View>{! recordingTwoLocation && 
              <Button
                title={recordingTwoRecording ? 'Stop Recording Two' : 'Start Recording Two'}
                onPress={recordingTwoRecording ? ()=>stopRecording(2) : ()=>startRecording(2)}
              />
              }
            </View>
            {recordingTwoLocation && (
        <Button title={recordingTwoIsPlaying == false ? "Play Recording Two" : "Stop Playing Recording Two"} onPress={recordingTwoIsPlaying ==false ? ()=>playRecording(2) : ()=>stopPlayingRecording(2)}></Button>
      )}
          {recordingTwoLocation && (
        <Button title={"Delete Recording Two"} onPress={() => deleteConfirmationAlert(2)}></Button>
      )}
      </View>
      <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }}
/>
      <View>
        <View>{! recordingThreeLocation && 
              <Button
                title={recordingThreeRecording ? 'Stop Recording Three' : 'Start Recording Three'}
                onPress={recordingThreeRecording ? ()=>stopRecording(3) : ()=>startRecording(3)}
              />
              }
            </View>
            {recordingThreeLocation && (
        <Button title={recordingThreeIsPlaying == false ? "Play Recording Three" : "Stop Playing Recording Three"} onPress={recordingThreeIsPlaying ==false ? ()=>playRecording(3) : ()=>stopPlayingRecording(3)}></Button>
      )}
          {recordingThreeLocation && (
        <Button title={"Delete Recording Three"} onPress={() => deleteConfirmationAlert(3)}></Button>
      )}
      
      </View> */}
      <Pressable
          style={styles.button}
          onPress={() => onSubmit()}
        >
          <Text style={styles.buttonText}>Submit</Text>
          </Pressable> 
      </View>
      
    );
  } else {
    return (
      <View style={styles.formContainer}>
        <Text style={{fontSize: 25, color: "#AAAAAA", fontStyle: "italic",textAlign:"center"}}>FP {firstNameFP} {lastNameFP} profile submitted!</Text>
        <Pressable style={styles.button}
          onPress={() => navigation.navigate("Home")}>
            <Text style={styles.buttonText}>Go home</Text>
          </Pressable>
      </View>
    );
  }
}
const imageUploaderStyles = StyleSheet.create({
  container: {
    elevation: 2,
    height: 200,
    width: 200,
    backgroundColor: "#fff",
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    marginTop: 10,
    borderColor: "black",
    borderWidth: 1,
    
  },
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadImageText: {
    marginTop: 5,
  },
  uploadBtn: {
    borderTopWidth: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    //   flex: 1,
    height:"90%",
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: "10%",
  },
  formContainer: {
    height:"100%",
    flex: 1,
    justifyContent: "center",
    paddingLeft: "2%",
    paddingRight: "2%",
  },
  titleText: {
    fontSize: 60,
  },
  subtitleText: {
    fontSize: 25,
    color: "#AAAAAA",
    fontStyle: "italic",
  },
  subHeadingText: {
    fontSize: 20,
    color: "#AAAAAA",
    fontStyle: "italic",
  },
  text: {
    fontSize: 15,
    color: "black",
  },
  hospitalPng: {
    height: 750,
    width: 600,
    resizeMode: "contain",
  },
  buttonText: {
    fontSize: 22,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  buttonStyling: {
    marginTop: 20,
    marginBottom: 10,
    position:"absolute",
    width:"100%",
    bottom: -80, // dont @ me, i'll change this later
    borderRadius: 15,
  },
    regularButtonStyling: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#06038D',
  },
  regularButtonTextStyling: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  input: {
    height: 50,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "white",
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width:800,
    marginVertical:20,
    backgroundColor: '#06038D',
  },
  buttonText: {
    fontSize: 22,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});
