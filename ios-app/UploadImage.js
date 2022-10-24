//https://www.waldo.com/blog/add-an-image-picker-react-native-app

import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet, TextInput  } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { GooglePlayButton } from "@freakycoder/react-native-button";
import * as ImagePicker from 'expo-image-picker';

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
      });
      console.log(JSON.stringify(_image));
  if (!_image.cancelled) {
    setImage(_image.uri);
  }
  };
  const [text, onChangeText] = React.useState(null);
  const [text_ID, onChangeText_ID] = React.useState(null);
  const [FP_name, onChangeFP_name] = React.useState(null);

  return (
  <View >
    {/* <Text>Create A New Profile</Text> */}
    <Text style={styles.subtitleText}>PATIENT NAME</Text>
    <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
      />
    <Text style={styles.subtitleText}>PATIENT ID</Text>
    <TextInput
        style={styles.input}
        onChangeText={onChangeText_ID}
        value={text_ID}
      />
    <Text style={styles.subtitleText}>FAMILIAR PERSON'S NAME</Text>
    <TextInput
        style={styles.input}
        onChangeText={onChangeFP_name}
        value={FP_name}
      />
    <Text style={styles.subtitleText}>ADD PHOTOS</Text>
          <View style={imageUploaderStyles.container}>
              {
                  image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
              }
                  <View style={imageUploaderStyles.uploadBtnContainer}>
                      <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                          <Text style={imageUploaderStyles.uploadImageText} >{image ? 'Edit' : 'Upload'} Image</Text>
                          <AntDesign name="camera" size={20} color="black" />
                      </TouchableOpacity>
                  </View>
          </View>
        <GooglePlayButton style={styles.buttonStyling} backgroundColor="#06038D" text="Submit" textColor="#fff" rippleColor="white" />   
  </View>

  );
}
const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:200,
        width:200,
        backgroundColor:'#fff',
        position:'relative',
        borderRadius:20,
        overflow:'hidden',
        marginTop:10,
        borderColor:'black',
        borderWidth:1
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'25%',
    },
    uploadImageText:{
        marginTop:5
    },
    uploadBtn:{
        borderTopWidth:1,
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    },
})

const styles = StyleSheet.create({
    container: {
    //   flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      paddingTop:'10%',
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