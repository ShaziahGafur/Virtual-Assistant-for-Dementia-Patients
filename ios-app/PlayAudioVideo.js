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
  const bg_video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  // workaround for video not playing occasionally using loadAsync
  // https://github.com/expo/expo/issues/17400 and https://github.com/expo/expo/issues/17395
  useEffect(() => {
    if (!videoFinished && video.current) {
      // if (bg_video.current) {
      //   bg_video.current.setIsMutedAsync(true);
      // }
      // console.log("in prompt video useEffect")
      video.current.loadAsync(require("./api/tmp/media_from_bucket/new_video_clip.mp4"));
      video.current.setPositionAsync(0);
      video.current.playAsync();
    }
    else if (videoFinished && bg_video.current) {
      // console.log("in bg_video useEffect")
      bg_video.current.loadAsync(require("./assets/bg_video.mp4"));
      bg_video.current.setIsMutedAsync(true); // should change to false later
      bg_video.current.setIsLoopingAsync(true);
      bg_video.current.setPositionAsync(0);
      bg_video.current.playAsync();
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
      <Video
        ref={bg_video}
        style={[styles.video, videoFinished ? styles.notHidden : styles.hidden]}
        source={require("./assets/bg_video.mp4")}
        resizeMode="contain"
        onLoad={() => {bg_video.current.setPositionAsync(0); bg_video.current.setIsMutedAsync(true); bg_video.current.setIsLoopingAsync(true); bg_video.current.playAsync()}}
        // set isMuted onLoad otherwise it randomly unmutes
        isLooping="True"
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
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
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
  },
  hidden: {
    display: "none",
  },
  notHidden: {
    zIndex: 2,
    display: "initial",
  }
});