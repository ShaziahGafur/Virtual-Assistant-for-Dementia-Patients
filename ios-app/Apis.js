import Constants from "expo-constants";
const { manifest } = Constants;

import React, { useEffect, useState } from 'react';
import { Text } from 'react-native';
import {BACKEND_API} from '@env'

function Api() {
  const [currentTime, setCurrentTime] = useState(0);

 useEffect(() => {
  fetch(BACKEND_API+'/time').then(res => res.json()).then(data => {
    setCurrentTime(data.time);
  });
}, []);

  return (
        <Text>The current time is {currentTime}.</Text>
  );
}

export default Api;