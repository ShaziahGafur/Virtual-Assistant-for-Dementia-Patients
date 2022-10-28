// import React, { useState, useEffect } from 'react';
// import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import Constants from "expo-constants";
const { manifest } = Constants;

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';


function Api() {
  
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
? manifest.debuggerHost.split(`:`).shift().concat(`:5000`)
: `api.example.com`;
// console.log(api);
// console.log('http://'+api+'/time');

const NGROK_API = 'https://52c1-138-51-83-38.ngrok.io';

  const [currentTime, setCurrentTime] = useState(0);

 useEffect(() => {
  fetch(NGROK_API+'/time').then(res => res.json()).then(data => {
    setCurrentTime(data.time);
  });
}, []);

  return (
        <Text>The current time is {currentTime}.</Text>
    //     <View style={{ flex: 1, padding: 24 }}>
    //   {isLoading ? <ActivityIndicator/> : (
    //     <FlatList
    //       data={data}
    //       keyExtractor={({ id }, index) => id}
    //       renderItem={({ item }) => (
    //         <Text>{item.title}, {item.releaseYear}</Text>
    //       )}
    //     />
    //   )}
    // </View>
  );
}

export default Api;