//https://www.waldo.com/blog/add-an-image-picker-react-native-app

import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet, TextInput  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { GooglePlayButton } from "@freakycoder/react-native-button";


export default function CreatePatientProfile() {

  const [patientFirstName, setPatientFirstName] = React.useState(null);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [patientLastName, setPatientLastName] = React.useState(null);
  const [patientHospialID, setpatientHospialID] = React.useState(null);
  // const { register, handleSubmit, setValue } = useForm();
  const onSubmit = () => {
    
    setFormSubmitted(true);
  }
  if (formSubmitted == false){
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
          onChangeText={setpatientHospialID}
          value={patientHospialID}
        />
        <GooglePlayButton style={styles.buttonStyling} backgroundColor="#06038D" text="Submit" onPress={ () => onSubmit()} textColor="#fff" rippleColor="white" />   
    </View>
    );
  }
  else{
    return(
      <View style={styles.formContainer}>
        <Text>Patient {patientFirstName} {patientLastName} submitted successfully!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
    //   flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingTop:'10%',
    },
    formContainer:{
      flex: 1, 
      justifyContent: 'center',
      paddingLeft: '2%',
      paddingRight: '2%'
    },
    titleText:{
      fontSize:60,
    },
    subtitleText:{
      fontSize:25,
      color:'#AAAAAA',
      fontStyle:'italic'
    },
    hospitalPng: {
      height:750,
      width:600,
      resizeMode:'contain'
    },
    buttonStyling: {
      marginTop: 20,
      marginBottom: 10,
      borderRadius:15
    },
    input: {
        height: 50,
        marginTop: 12,
        marginBottom: 12,
        borderWidth: 1,
        padding: 10,
        borderRadius:15,
        backgroundColor:'white'
      },
  });