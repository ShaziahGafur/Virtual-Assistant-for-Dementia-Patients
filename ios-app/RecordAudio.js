import * as React from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';
import { setStatusBarBackgroundColor } from 'expo-status-bar';

export default function RecordAudio() {
  const [recording, setRecording] = React.useState();
  const [sound, setSound] = React.useState();
  const [isFetching, setIsFetching] = React.useState(false);

  async function startRecording() {
    try {
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      console.log('Starting recording..');
      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync(); 
      setRecording(recording);
      console.log('Recording started');
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    // setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
  }

  async function playRecording() {
    console.log('Playing Recording');
    const uri = recording.getURI(); 
    const { sound } = await Audio.Sound.createAsync({uri: recording. getURI() || URIFROMFileSystem});
    
    setSound(sound);
    await sound.playAsync();
  }

  async function playSampleSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./assets/sounds/example.mp3')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  const getTranscription = async () => {
    setIsFetching(true);
    try {
        // const info = await Audio.Sound.getInfoAsync(recording.getURI());
        // console.log(`FILE INFO: ${JSON.stringify(info)}`);
        const uri = recording.getURI();
        const formData = new FormData();
        formData.append('file', {
            uri,
            type: 'audio/x-wav',
            name: 'speech2text'
        });
        console.log(formData);
        const response = await fetch(config.CLOUD_FUNCTION_URL, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        console.log(data);
    } catch(error) {
        console.log('There was an error reading file', error);
        // stopRecording();
        // resetRecording();
    }
    setIsFetching(false);
}


  async function stopPlayingRecording() {
    console.log("stop playing sound")
    sound.unloadAsync();
  }

  React.useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
        <Button title={"Play Sample Sound"}
      onPress={playSampleSound
    }></Button>
      <Button
        title={recording ? 'Stop Recording' : 'Start Recording'}
        onPress={recording ? stopRecording : startRecording}
      />
      {recording && <Button
      title={"Play Recording"}
      onPress={playRecording
    }
    ></Button>
        }
        {
           <Button
            title={"Stop Playing"}
            onPress={stopPlayingRecording}>
        
            </Button>
        }
        <Button title={"Get Transcription"} onPress={getTranscription}></Button>
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
});

const recordingOptions = {
    // android not currently in use, but parameters are required
    android: {
        extension: '.m4a',
        outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
        audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
        sampleRate: 44100,
        numberOfChannels: 2,
        bitRate: 128000,
    },
    ios: {
        extension: '.wav',
        audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
        sampleRate: 44100,
        numberOfChannels: 1,
        bitRate: 128000,
        linearPCMBitDepth: 16,
        linearPCMIsBigEndian: false,
        linearPCMIsFloat: false,
    },
};