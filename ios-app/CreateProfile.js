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
  Alert
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



export default function CreateProfile() {
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

  const [recordingOne, setRecordingOne] = React.useState(null);
  const [recordingTwo, setRecordingTwo] = React.useState(null);
  const [recordingThree, setRecordingThree] = React.useState(null);
  
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
        
      const recordingOne = new Audio.Recording();
      await recordingOne.prepareToRecordAsync(recordingOptions);
      await recordingOne.startAsync();
        setRecordingOne(recordingOne);
      }
      else if (number == 2){
        console.log("record 2");

      const recordingTwo = new Audio.Recording();
      await recordingTwo.prepareToRecordAsync(recordingOptions);
      await recordingTwo.startAsync();
        setRecordingTwo(recordingTwo);
      }
      else if (number == 3){
        console.log("record 3");

      const recordingThree = new Audio.Recording();
      await recordingThree.prepareToRecordAsync(recordingOptions);
      await recordingThree.startAsync();
        setRecordingThree(recordingThree);
      }
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  stopRecording = async(number) => {
    console.log("Stopping recording..");
    // await recording.stopAndUnloadAsync();
    // const uri = recording.getURI();
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
    // setSoundIsPlaying(true);
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
      // this for whatever reason isnt working ?? so uh just setting them back to null 
      // (TODO) actually delete them later on
      // const info = await FileSystem.getInfoAsync(recordingToDelete.getURI());
      // await FileSystem.deleteAsync(info.uri);
      let recordingToDelete;
        if (number == 1){
        setRecordingOneIsPlaying(false);
        setRecordingOne(null);
        setRecordingOneLocation(null);
      }
      else if (number == 2){
        
        setRecordingTwoIsPlaying(false);
        setRecordingTwo(null);
        setRecordingTwoLocation(null);
      }
      else if (number == 3){
        
        setRecordingThreeIsPlaying(false);
        setRecordingThree(null);
        setRecordingThreeLocation(null);
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
      console.log(result.uri);
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

    let axios_files = [];

      const photo_file = {
        image,
        type: "image/jpeg",
        name: "photo",
      };
      
      const recording_one_uri = recordingOne.getURI();
      console.log(`FILE INFO: ${JSON.stringify(recording_one_uri)}`);
      const recording_two_uri = recordingTwo.getURI();
      const recording_three_uri = recordingThree.getURI();

      const recording_one_file = {
        recording_one_uri,
        type: "audio/x-wav",
        name: "recording_1",
      };
      
      // const recording_two_file = {
      //   recording_two_uri,
      //   type: "audio/x-wav",
      //   name: "recording_2",
      // };
      
      // const recording_three_file = {
      //   recording_three_uri,
      //   type: "audio/x-wav",
      //   name: "recording 3",
      // };
      // axios_files.push(photo_file);
      // axios_files.push(recording_one_file);
      // axios_files.push(recording_two_file);
      // axios_files.push(recording_three_file);
      console.log(FP_info)
      formData.append("files", recording_one_file);
      // formData.append("content", FP_info);
      // remember you can't add an object to a form data
      for ( var key in FP_info ) {
    formData.append(key, FP_info[key]);
}
    const response = await axios.post(
      REACT_APP_BACKEND_API + "/db/favouritepersons",
      // body,
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
        <Text style={styles.text}>Take 1 photo from the shoulder up. </Text>
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
        <View>
          <Button
          style={styles.buttonStyling}
          backgroundColor="light grey"
          title="Open Camera"
          textColor="black"
          rippleColor="blue"
          onPress={() => takeImageWithCamera()}
        /> 
        </View>
        <Text style={styles.subtitleText}>Voice Recordings</Text>
        {/* <Text style={styles.text}>Take 3 different voice recordings.</Text>
        <Text style={styles.subHeadingText}>Voice Recording 1: Right now it is 2:40 PM on January 17th 2023.</Text> */}
        <View>
        <View>{! recordingOneLocation && 
              <Button
                title={recordingOne ? 'Stop Recording One' : 'Start Recording One'}
                onPress={recordingOne ? ()=>stopRecording(1) : ()=>startRecording(1)}
              />
              }
            </View>
            {recordingOneLocation && (
        <Button title={recordingOneIsPlaying != false ? "Play Recording One" : "Stop Playing Recording One"} onPress={()=>playRecording(1)}></Button>
      )}
          {recordingOneLocation && (
        <Button title={"Delete Recording One"} onPress={() => deleteConfirmationAlert(1)}></Button>
      )}
      </View>
      <View>
        <View>{! recordingTwoLocation && 
              <Button
                title={recordingTwo ? 'Stop Recording Two' : 'Start Recording Two'}
                onPress={recordingTwo ? ()=>stopRecording(2) : ()=>startRecording(2)}
              />
              }
            </View>
            {recordingTwoLocation && (
        <Button title={recordingTwoIsPlaying != false ? "Play Recording Two" : "Stop Playing Recording Two"} onPress={()=>playRecording(2)}></Button>
      )}
          {recordingTwoLocation && (
        <Button title={"Delete Recording Two"} onPress={() => deleteConfirmationAlert(2)}></Button>
      )}
      </View>
      <View>
        <View>{! recordingThreeLocation && 
              <Button
                title={recordingThree ? 'Stop Recording Three' : 'Start Recording Three'}
                onPress={recordingThree ? ()=>stopRecording(3) : ()=>startRecording(3)}
              />
              }
            </View>
            {recordingThreeLocation && (
        <Button title={recordingThreeIsPlaying != false ? "Play Recording Three" : "Stop Playing Recording Three"} onPress={()=>playRecording(3)}></Button>
      )}
          {recordingThreeLocation && (
        <Button title={"Delete Recording Three"} onPress={() => deleteConfirmationAlert(3)}></Button>
      )}
      </View>
        <GooglePlayButton
          style={styles.buttonStyling}
          backgroundColor="#06038D"
          text="Submit"
          textColor="#fff"
          rippleColor="white"
          onPress={() => onSubmit()}
        />
      </View>
    );
  } else {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.subtitleText}>Form submitted!</Text>
        {/* <TextInput
          style={styles.input}
          onChangeText={setPatient}
          value={patient}
        />
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
        <Text style={styles.subtitleText}>ADD PHOTOS</Text>
        <View style={imageUploaderStyles.container}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <View style={imageUploaderStyles.uploadBtnContainer}>
            <TouchableOpacity
              onPress={addImage}
              style={imageUploaderStyles.uploadBtn}
            >
              <Text style={imageUploaderStyles.uploadImageText}>
                {image ? "Edit" : "Upload"} Image
              </Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <GooglePlayButton
          style={styles.buttonStyling}
          backgroundColor="#06038D"
          text="Submit"
          textColor="#fff"
          rippleColor="white"
          onPress={() => onSubmit()}
        /> */}
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
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: "10%",
  },
  formContainer: {
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
  buttonStyling: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 15,
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
});

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