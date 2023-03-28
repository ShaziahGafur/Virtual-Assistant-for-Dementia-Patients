//https://www.waldo.com/blog/add-an-image-picker-react-native-app

import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import { REACT_APP_BACKEND_API } from "@env"
import axios from "axios";
console.log(REACT_APP_BACKEND_API);

export default function CreatePatientProfile() {
  const [patientFirstName, setPatientFirstName] = React.useState(null);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [patientLastName, setPatientLastName] = React.useState(null);
  const [patientHospitalID, setpatientHospitalID] = React.useState(null);
  // const { register, handleSubmit, setValue } = useForm();
  const onSubmit = async () => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      firstName: patientFirstName,
      lastName: patientLastName,
      hospitalID: patientHospitalID,
    };
    const response = await axios.post(
      REACT_APP_BACKEND_API + "/db/patients",
      body,
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
        <Text style={styles.subtitleText}>PATIENT FIRST NAME</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPatientFirstName}
          value={patientFirstName}
        />
        <Text style={styles.subtitleText}>PATIENT LAST NAME</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPatientLastName}
          value={patientLastName}
        />
        <Text style={styles.subtitleText}>PATIENT ID (HOSPITAL USE ONLY)</Text>
        <TextInput
          style={styles.input}
          onChangeText={setpatientHospitalID}
          value={patientHospitalID}
        />
        <Pressable style={styles.button}
        onPress={() => onSubmit()}>
          <Text style={styles.text}>Submit</Text>
        </Pressable>
      </View>
    );
  } else {
    return (
      <View style={styles.formContainer}>
        <Text>
          Patient {patientFirstName} {patientLastName} submitted successfully!
        </Text>
        <Pressable style={styles.button}
        onPress={() => setFormSubmitted(false)}>
          <Text style={styles.text}>Add Another Patient</Text>
        </Pressable>
        <Pressable style={styles.button}
        onPress={() => onSubmit()}>
          <Text style={styles.text}>View Familiar People</Text>
        </Pressable>
      </View>
    );
  }
}

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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width:800,
    margin: 20,
    backgroundColor: '#06038D',
  },
  text: {
    fontSize: 22,
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
});
