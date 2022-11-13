//https://www.waldo.com/blog/add-an-image-picker-react-native-app

import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import * as ImagePicker from "expo-image-picker";

export default function CreateProfile() {
  const [image, setImage] = useState(null);

  const [patient, setPatient] = React.useState(null);
  const [firstNameFP, setFirstNameFP] = React.useState(null);
  const [lastNameFP, setLastNameFP] = React.useState(null);

  const [formSubmitted, setFormSubmitted] = React.useState(false);

  const addImage = async () => {
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
    //   BACKEND_API + "/db/favouritepersons",
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
        <TextInput
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
        />
      </View>
    );
  } else {
    return (
      <View style={styles.formContainer}>
        <Text style={styles.subtitleText}>PATIENT SEARCH</Text>
        <TextInput
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
        />
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
