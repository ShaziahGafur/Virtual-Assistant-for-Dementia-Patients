// import * as React from 'react';
// import { Text, View, StyleSheet, Button } from 'react-native';
// import { Audio, Video, AVPlaybackStatus } from 'expo-av';
// import { setStatusBarBackgroundColor } from 'expo-status-bar';
// import * as FileSystem from 'expo-file-system';
// import axios from 'axios';


// export default function PlayAudioVideo({refresh}) {
//   // const {refresh} = props;
//   console.log("refresh", refresh);
//   const video = React.useRef(null);
//   const [sound, setSound] = React.useState();
//   const [status, setStatus] = React.useState({});

//   async function playSampleSound() {
//     console.log('Loading Sound');
//     const { sound } = await Audio.Sound.createAsync( require('./api/tmp/media_from_bucket/audio_clip.mp3')
//     );
//     setSound(sound);
//     shouldPlay="true"
//     console.log('Playing Sound');
//     await sound.playAsync();
//   }
//     React.useEffect(() => {
//     return sound
//       ? () => {
//         if (refresh == false){
//           console.log('in useeffect refresh should be false',refresh);
//           console.log('Unloading Sound');
//           sound.unloadAsync();
//           shouldPlay="true"
//         }
//         else{
//           console.log('in useeffect refresh should be true',refresh);

//           playSampleSound();
//           // video.current.playAsync();
//         }
//       }
//       : undefined;
//   }, [sound, refresh]);
//   return (
//     <View style={styles.container}>
//       <Video
//         ref={video}
//         style={styles.video}
//         source={require("./api/tmp/media_from_bucket/video_clip.mp4")}
//         resizeMode="contain"
//         onPlaybackStatusUpdate={status => setStatus(() => status)}
//         onLoad={() => { video.current.playAsync(); playSampleSound()}}
//         shouldPlay="True"
//       />

//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 10,
//   },
//   video: {
//     flex: 1,
//     justifyContent: 'center',
//     backgroundColor: '#ecf0f1',
//     padding: 10, 
//   }
// });

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, ImageBackground, Image } from 'react-native';
import { Audio, Video, AVPlaybackStatus } from 'expo-av';
import { setStatusBarBackgroundColor, setStatusAsync } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';
import loading from './assets/loading.gif';


export default function PlayAudioVideo({loadingScreen, videoFinished, setVideoFinished}) {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  // workaround for video not playing occasionally using loadAsync
  // https://github.com/expo/expo/issues/17400 and https://github.com/expo/expo/issues/17395
  useEffect(() => {
    if (video.current) {
      video.current.loadAsync(require("./api/tmp/media_from_bucket/new_video_clip.mp4"));
      video.current.setPositionAsync(0);
      video.current.playAsync();
    }
  }, []);

  _onPlaybackStatusUpdate = (playbackStatus) => {
    // The player has just finished playing and will stop.
    if (playbackStatus.didJustFinish){
      console.log("video finished! ");
      setVideoFinished(true);
      console.log("set video finished");
    }
  };

  if (loadingScreen == true){
    return (
      <View style={styles.loadingContainer}>
        <Image source={loading} style={styles.loadingGif} alt="loading..." />
      </View>
    );
  }
  else{
  return (
    <View style={styles.container}>
      <ImageBackground source={require("./api/tmp/media_from_bucket/fpphoto.jpg")} resizeMode="contain"  style={styles.backgroundPhoto}>
      <Video
        ref={video}
        style={styles.video}
        source={require("./api/tmp/media_from_bucket/new_video_clip.mp4")}
        resizeMode="contain"
        onPlaybackStatusUpdate={status => {setStatus(() => status); this._onPlaybackStatusUpdate(status)}}
        onLoad={() => {video.current.setPositionAsync(0); video.current.playAsync(); setVideoFinished(false); console.log(videoFinished)}}
        shouldPlay="True"
      />
      </ImageBackground>
    </View>
  );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // backgroundColor: '#ecf0f1',
    // padding: 10,
  },
  video: {
    flex: 1,
    // position:"absolute",
    justifyContent: 'center',
    // backgroundColor: '#ecf0f1',
    padding: 10, 
  },
  backgroundPhoto: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  loadingGif: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: 'contain' 
  }
});