import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Alert, Image, Pressable } from "react-native";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import { NavigationContainer, TabActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import CreateProfile from "./CreateProfile";
import CreateNewPatientProfile from "./CreatePatientProfile";
import SpeechToText from "./SpeechToText";
import RecordAudio from "./RecordAudio";
import PatientSelect from "./PatientSelect";
import VideoCall from "./VideoCall";
import FPSelect from "./FPSelect";
import Dialogue from "./Dialogue";
import Apis from "./Apis";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Load An Existing Profile"
          component={LoadExistingProfile}
        />
        <Stack.Screen
          name="Create A New Profile"
          component={CreateNewProfile}
        />
        <Stack.Screen name="Record Sound" component={RecordAudio} />
        <Stack.Screen
          name="Create A Patient Profile"
          component={CreateNewPatientProfile}
        />
        <Stack.Screen
          name="Create A Familiar Person Profile"
          component={CreateProfile}
        />
        <Stack.Screen name="Dialogue" component={Dialogue} options={{title: "Video Call"}} />
        <Stack.Screen name="Video Call" component={VideoCall} options={{title: "Video Call"}} />
        <Stack.Screen name="FP Select" component={FPSelect} />
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
      {/* <GooglePlayButton
        onPress={() => navigation.navigate("Record Sound")}
        backgroundColor="#06038D"
        text="Record Sound"
        textColor="#fff"
        rippleColor="white"
      /> */}
      {/* <GooglePlayButton
        onPress={() => navigation.navigate("Video Call")}
        backgroundColor="#06038D"
        style={styles.buttonStyling}
        text="Start Video Call"
        textColor="#fff"
        rippleColor="white"
      /> */}
      {/* <GooglePlayButton
      onPress={() => navigation.navigate("Dialogue")}
      backgroundColor="#06038D"
      style={styles.buttonStyling}

      text="Dialogue"
      textColor="#fff"
      rippleColor="white"
    /> */}
      <Pressable style={styles.button}
        onPress={() => navigation.navigate("Load An Existing Profile")}>
          <Text style={styles.text}>Load An Existing Profile</Text>
        </Pressable>
      <Pressable style={styles.button2}
        onPress={() => navigation.navigate("Create A New Profile")}>
          <Text style={styles.text}>Create A New Profile</Text>
        </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

function LoadExistingProfile({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <PatientSelect navigation={navigation}></PatientSelect>
    </View>
  );
}

function CreateNewProfile({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {/* <SpeechToText></SpeechToText> */}
      {/* <Text>Create New Profile</Text> */}
      {/* <CreateProfile></CreateProfile> */}
      <GooglePlayButton
        style={styles.buttonStyling2}
        onPress={() => navigation.navigate("Create A Familiar Person Profile")}
        text="Create a Familiar Person Profile"
        backgroundColor="#06038D"
        textColor="#fff"
        rippleColor="white"
      />
      <GooglePlayButton
        style={styles.buttonStyling2}
        onPress={() => navigation.navigate("Create A Patient Profile")}
        text="Create a Patient Profile"
        backgroundColor="#06038D"
        textColor="#fff"
        rippleColor="white"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: "10%",
  },
  titleText: {
    fontSize: 60,
  },
  subtitleText: {
    fontSize: 25,
    color: "#AAAAAA",
    fontStyle: "italic",
  },
  hospitalPng: {
    height: 650,
    width: 600,
    resizeMode: "contain",
  },
  buttonStyling: {
    margin: 10,
  },
  buttonStyling2: {
    height: 100,
    margin: 10,
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width:800,
    backgroundColor: 'black',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width:800,
    margin: 20,
    backgroundColor: '#06038D',
  },
  text: {
    fontSize: 22,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
});

export default App;
