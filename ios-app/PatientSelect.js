import React, { useState, useEffect } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import { REACT_APP_BACKEND_API } from "@env"
import { GooglePlayButton } from "@freakycoder/react-native-button";
import axios from "axios";
import FPSelect from "./FPSelect";

console.log(REACT_APP_BACKEND_API);

const fetchData = async () => {
  const header = {
    headers: { "Content-Type": "application/json" },
  };
  const response = await axios.get(
    'http://100.67.0.68:5000' + "/db/patients",
    {
      headers: header,
      method: "GET",
    }
  );
  return response.data;
};

const handleClick = (data) => {
  console.log(data);
};

const PatientSelect = ({ navigation }) => {
  const [patients, setPatients] = useState([]);

  getPatients = async () => {
    let data = await fetchData();
    setPatients(data);
  };

  useEffect(() => {
    getPatients();
  }, [patients]);

  return (
    <>
      {patients &&
        patients.map((data, id) => {
          return (
            <View key={id}>
              <Pressable
              style={styles.button}
               onPress={() =>
                navigation.navigate("FP Select", {
                  patientID: data.PatientID,
                })
              }>
                <Text style={styles.text}>{data.FirstName + " " + data.LastName}</Text>
              </Pressable>
            </View>
          );
        })}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: "#fff",
    alignItems: "center",
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

export default PatientSelect;
