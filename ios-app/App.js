import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Image } from 'react-native';
import { Button, GooglePlayButton } from "@freakycoder/react-native-button";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateProfile  from './CreateProfile';
import CreateNewPatientProfile  from './CreatePatientProfile';
import SpeechToText from './SpeechToText';
import RecordAudio from './RecordAudio';
import Apis from './Apis';

const Stack = createNativeStackNavigator();


const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Load An Existing Profile" component={LoadExistingProfile} />
        <Stack.Screen name="Create A New Profile" component={CreateNewProfile} />
        <Stack.Screen name="Record Sound" component={RecordAudio} />
        <Stack.Screen name="Create A Patient Profile" component={CreateNewPatientProfile} />
        <Stack.Screen name="Create A Favourite Person Profile" component={CreateProfile} />
      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

function HomeScreen({ navigation }) {
  return (
  <View style={styles.container}>
        <Text style={styles.titleText}>Welcome!</Text>
        <Text style={styles.subtitleText}>HOPE YOU ARE WELL TODAY</Text>
        <Image 
        style={styles.hospitalPng}
        source={require("./assets/hospital.png")}
        ></Image>
        {/* <Apis></Apis> */}
        <GooglePlayButton onPress={() => navigation.navigate('Record Sound')} backgroundColor="#06038D" text="Record Sound" textColor="#fff" rippleColor="white" />   
        <GooglePlayButton onPress={() => navigation.navigate('Load An Existing Profile')} style={styles.buttonStyling} backgroundColor="#06038D" text="Load An Existing Profile" textColor="#fff" rippleColor="white" />   
        <GooglePlayButton onPress={() => navigation.navigate('Create A New Profile')} outline style={styles.buttonStyling} backgroundColor="#06038D" text="Create A New Profile" textColor="#000" rippleColor="blue" />   
        <StatusBar style="auto" />
      </View>
  );
}

function LoadExistingProfile({ navigation }) {
  return (
    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <GooglePlayButton onPress={() => startRecording()} outline style={styles.buttonStyling} backgroundColor="#06038D" text="Start Recording" textColor="#000" rippleColor="blue" />    */}
      {/* <Text>Load Existing Profile</Text> */}
      {/* <SpeechToText></SpeechToText> */}
      {/* <RecordAudio></RecordAudio> */}
        <GooglePlayButton style={styles.buttonStyling2} text="Patient 1"  backgroundColor="#06038D" textColor="#fff" rippleColor="white" />   
        <GooglePlayButton style={styles.buttonStyling2} text="Patient 2"  backgroundColor="#06038D" textColor="#fff" rippleColor="white" />   
    </View>
  );
}

function CreateNewProfile({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {/* <SpeechToText></SpeechToText> */}
      {/* <Text>Create New Profile</Text> */}
      {/* <CreateProfile></CreateProfile> */}
      <GooglePlayButton style={styles.buttonStyling2} onPress={() => navigation.navigate('Create A Favourite Person Profile')} text="Create a Favourite Person Profile"  backgroundColor="#06038D" textColor="#fff" rippleColor="white" />   
      <GooglePlayButton style={styles.buttonStyling2} onPress={() => navigation.navigate('Create A Patient Profile')} text="Create a Patient Profile"  backgroundColor="#06038D" textColor="#fff" rippleColor="white" />   
    

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    margin:10
  },
  buttonStyling2:{
    height: 100,
    margin: 10
  }
});

export default App;
