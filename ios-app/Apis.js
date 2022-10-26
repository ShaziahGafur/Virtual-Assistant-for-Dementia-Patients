import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';


function Api() {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  return (
        <Text>The current time is {currentTime}.</Text>
  );
}

export default Api;