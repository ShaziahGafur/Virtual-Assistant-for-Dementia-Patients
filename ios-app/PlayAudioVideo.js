import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio, Video, AVPlaybackStatus } from 'expo-av';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';


export default function PlayAudioVideo() {
  const video = React.useRef(null);
  const [sound, setSound] = React.useState();
  const [status, setStatus] = React.useState({});

  async function playSampleSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./api/tmp/media_from_bucket/audio_clip.mp3')
    );
    setSound(sound);
    shouldPlay="true"
    console.log('Playing Sound');
    await sound.playAsync();
  }
    React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
          shouldPlay="true"
        }
      : undefined;
  }, [sound]);
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={require("./api/tmp/media_from_bucket/video_clip.mp4")}
        resizeMode="contain"
        onPlaybackStatusUpdate={status => setStatus(() => status)}
        onLoad={() => { video.current.playAsync(); playSampleSound()}}
        shouldPlay="True"
      />

    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  video: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10, 
  }
});