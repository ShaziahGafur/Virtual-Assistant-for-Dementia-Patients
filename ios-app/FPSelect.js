import React, { useState, useEffect } from "react";
import { REACT_APP_BACKEND_API } from "@env"
import { GooglePlayButton } from "@freakycoder/react-native-button";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { View, Text, StyleSheet, Pressable } from "react-native";
console.log(REACT_APP_BACKEND_API);

const fetchData = async (associatedPatientID) => {
  // console.log(associatedPatientID);
  const header = {
    headers: { "Content-Type": "application/json" },
  };
  const response = await axios.get(
    REACT_APP_BACKEND_API + "/db/favouritepersons",
    {
      headers: header,
      method: "GET",
      params: { patientID: associatedPatientID },
    }
  );
  // console.log(response.data);
  return response.data;
};

const handleClick = (data) => {
  console.log(data);
};

function FPSelect({ route, navigation }) {
  const { patientID, patientFirstName } = route.params;
  // console.log(patientID, patientFirstName);

  const [FPs, setFPs] = useState([]);
  const [associatedPatientID, setAssociatedPatientID] = useState([]);

  getFPsByPatient = async (associatedPatientID) => {
    let data = await fetchData(associatedPatientID);
    setFPs(data);
  };

  useEffect(() => {
    if (route.params?.patientID) {
      setAssociatedPatientID(route.params?.patientID);
      getFPsByPatient(associatedPatientID);
    }
  }, [FPs, route.params?.patientID]);

  return (
    <>
      <View style={styles.container}>
        {FPs &&
          FPs.length != 0 &&
          FPs.map((data, id) => {
            return (
              <View style={styles.container} key={id}>
                <Pressable style={styles.button}
                onPress={() => navigation.navigate("Video Call", {
                  patient_ID: associatedPatientID,
                  FP_ID: data.FavouritePersonsID
                })}>
                <Text style={styles.text}
                >{data.FirstName + " " + data.LastName}</Text>
                </Pressable>
                {/* <GooglePlayButton
                  style={styles.buttonStyling}
                  backgroundColor="#06038D"
                  text={data.FirstName + " " + data.LastName}
                  textColor="#fff"
                  rippleColor="white"
                  onPress={() => navigation.navigate("Video Call", {
                    patient_ID: associatedPatientID,
                    FP_ID: data.FavouritePersonsID
                  })}
                ></GooglePlayButton> */}
              </View>
            );
          })}
        {FPs && FPs.length == 0 && <Text>No Familiar People found!</Text>}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  // button: {
  //   backgroundColor: "#48C9B0",
  //   paddingVertical: 20,
  //   width: "90%",
  //   alignItems: "center",
  //   borderRadius: 5,
  //   marginTop: 20,
  // },
  buttonStyling: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 15,
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

export default FPSelect;
