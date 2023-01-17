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
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { AntDesign } from "@expo/vector-icons";
import axios from "axios";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import * as ImagePicker from "expo-image-picker";
import { Audio } from 'expo-av';

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

  const [recordingOne, setRecordingOne] = React.useState(null);
  const [recordingTwo, setRecordingTwo] = React.useState(null);
  const [recordingThree, setRecordingThree] = React.useState(null);
  
  const [recordingOneLocation, setRecordingOneLocation] = React.useState(null);
  const [recordingTwoLocation, setRecordingTwoLocation] = React.useState(null);
  const [recordingThreeLocation, setRecordingThreeLocation] = React.useState(null);

    async function startRecording(number) {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      console.log("Starting recording..");
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
      if (number == 1){
        setRecordingOne(recording);
      }
      else if (number == 2){
        setRecordingTwo(recording);
      }
      else if (number == 3){
        setRecordingThree(recording);
      }
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording(number) {
    console.log("Stopping recording..");
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (number == 1){
        setRecordingOneLocation(uri);
      }
      else if (number == 2){
        setRecordingTwoLocation(uri);
      }
      else if (number == 3){
        setRecordingThreeLocation(uri);
      }
    console.log("Recording stopped and stored at", uri);
  }

  async function playRecording(number) {
    console.log("Playing Recording");
    //const uri = recording.getURI();
    let uri; 
    if (number == 1){
        uri = recordingOneLocation;
      }
      else if (number == 2){
        uri = recordingTwoLocation;
      }
      else if (number == 3){
        uri = recordingThreeLocation;
      }
    const { sound } = await Audio.Sound.createAsync({
      uri: uri || URIFROMFileSystem,
    });

    setSound(sound);
    setSoundIsPlaying(true);
    await sound.playAsync();
  }

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
    // const header = {
    //   headers: { "Content-Type": "application/json" },
    // };
    // const body = {
    //   firstName: patientFirstName,
    //   lastName: patientLastName,
    //   hospitalID: patientHospitalID,
    // };
    // const response = await axios.post(
    //   REACT_APP_BACKEND_API + "/db/favouritepersons",
    //   body,
    //   {
    //     headers: header,
    //     method: "POST",
    //   }
    // );
    // const data = response.data;
    // if (data["result"] == "Success") {
    //   console.log("in success!!");
    //   // setFormSubmitted(true);
    // }
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
        {/* <Text style={styles.subtitleText}>Voice Recordings</Text>
        <Text style={styles.text}>Take 3 different voice recordings.</Text>
        <Text style={styles.subHeadingText}>Voice Recording 1: Right now it is 2:40 PM on January 17th 2023.</Text> */}

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
