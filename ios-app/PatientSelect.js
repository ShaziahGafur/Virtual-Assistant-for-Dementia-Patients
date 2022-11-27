import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { BACKEND_API } from "@env";
import { GooglePlayButton } from "@freakycoder/react-native-button";
import axios from "axios";
import FPSelect from "./FPSelect";

console.log(BACKEND_API);

const fetchData = async () => {
  const header = {
    headers: { "Content-Type": "application/json" },
  };
  const response = await axios.get("http://192.168.1.8:5000" + "/db/patients", {
    headers: header,
    method: "GET",
  });
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
              <GooglePlayButton
                style={styles.buttonStyling}
                backgroundColor="#06038D"
                text={data.FirstName + " " + data.LastName}
                textColor="#fff"
                rippleColor="white"
                onPress={() =>
                  navigation.navigate("FP Select", {
                    patientID: data.PatientID,
                  })
                }
              ></GooglePlayButton>
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
  button: {
    backgroundColor: "#48C9B0",
    paddingVertical: 20,
    width: "90%",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonStyling: {
    marginTop: 20,
    marginBottom: 10,
    borderRadius: 15,
  },
});

export default PatientSelect;
