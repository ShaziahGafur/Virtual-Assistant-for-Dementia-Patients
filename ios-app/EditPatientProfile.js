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
  Alert
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { REACT_APP_BACKEND_API } from "@env"
import axios from "axios";
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

export default function EditPatientProfile({navigation}) {
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [patientFirstName, setPatientFirstName] = React.useState(null);
  const [patientLastName, setPatientLastName] = React.useState(null);
  const [patientHospitalID, setpatientHospitalID] = React.useState(null);
  const [patients, setPatients] = useState([]);
  const [value, setValue] = useState(null);
  const [patientDeleted, setPatientDeleted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const updatePatient = async () => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      patientID:value,
      firstName: patientFirstName,
      lastName: patientLastName,
      hospitalID: patientHospitalID,
    };
    const response = await axios.put(
      REACT_APP_BACKEND_API + "/db/patients",
      body,
      {
        headers: header,
        method: "PUT",
      }
    );
    const data = response.data;
      if (data["result"] == "Success") {
        console.log("Successfully updated patient!");
        setFormSubmitted(true);
      }
    return response.data;
    };
    const deleteAlert = async () => {
      Alert.alert('Delete Confirmation', "Are you sure you want to delete this patient?",[
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deletePatient()},
      ]);
    }
    const deletePatient = async () => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      patientID:value,
    };
    console.log(body);
    // You must pass any body in through the "data" field, not the "body" field for axios.delete
    const response = await axios.delete(
      REACT_APP_BACKEND_API + "/db/patients",
      {
        method: "DELETE",
        data:body
      }
    );
    const data = response.data;
    if (data["result"] == "Success") {
      console.log("Successfully deleted patient!");
      setPatientDeleted(true);
      setFormSubmitted(true);
    }
    return response.data;
    }; 

  const selectedPatient = async(value) => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.get(
      REACT_APP_BACKEND_API + "/db/patients",
      {
        headers: header,
        method: "GET",
        params: { patientID: value },
      }
    );
    console.log(response.data[0]);
    const patient_data = response.data[0];
    setValue(value);
    setPatientFirstName(patient_data["FirstName"]);
    setPatientLastName(patient_data["LastName"]);
    setpatientHospitalID(patient_data["HospitalPatientID"]);
  }
  // const { register, handleSubmit, setValue } = useForm();

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
  }, []);

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
      REACT_APP_BACKEND_API+ "/db/patients",
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
        <Text style={styles.subtitleText}>PATIENT SEARCH</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={value}
          items={patients}
          searchable={true}
          placeholder={"Select a Patient"}
          setOpen={setDropdownOpen}
          setValue={setValue}
          onChangeValue={() => selectedPatient(value)}
          setItems={setPatients}
        />
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
        onPress={() => updatePatient()}>
          <Text style={styles.text}>Update Patient</Text>
        </Pressable>
        <Pressable style={styles.button2}
        onPress={() => deleteAlert()}>
          <Text style={styles.text}>Delete Patient</Text>
        </Pressable>
      </View>
    );
  } else {
    if (patientDeleted == true){
      return (
        <View style={styles.formContainer}>
          <Text>
            Patient {patientFirstName} {patientLastName} deleted successfully!
          </Text>
          <Pressable style={styles.button}
          onPress={() => navigation.navigate("Home")}>
            <Text style={styles.text}>Go home</Text>
          </Pressable>
        </View>
      );
    }
    else{
      return (
        <View style={styles.formContainer}>
          <Text>
            Patient {patientFirstName} {patientLastName} updated successfully!
          </Text>
          <Pressable style={styles.button}
          onPress={() => navigation.navigate("Home")}>
            <Text style={styles.text}>Go home</Text>
          </Pressable>
        </View>
      );
    }
    
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
    paddingHorizontal:"2%"
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
    marginVertical: 20,
    backgroundColor: '#06038D',
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width:800,
    marginVertical: 20,
    backgroundColor: 'darkred',
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
