//https://www.waldo.com/blog/add-an-image-picker-react-native-app

import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert
} from "react-native";
import DropDownPicker from 'react-native-dropdown-picker';
import { REACT_APP_BACKEND_API } from "@env"
import axios from "axios";
console.log(REACT_APP_BACKEND_API);

const fetchData = async () => {
  const header = {
    headers: { "Content-Type": "application/json" },
  };
  const response = await axios.get(
    REACT_APP_BACKEND_API + "/db/favouritepersons",
    {
      headers: header,
      method: "GET",
    }
  );
  return response.data;
};

export default function EditFPProfile({navigation}) {
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [FPFirstName, setFPFirstName] = React.useState(null);
  const [FPLastName, setFPLastName] = React.useState(null);
  const [FPs, setFPs] = useState([]);
  const [value, setValue] = useState(null);
  const [FPDeleted, setFPDeleted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const updateFP = async () => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      favouritePersonsID:value,
      firstName: FPFirstName,
      lastName: FPLastName,
    };
    const response = await axios.put(
      REACT_APP_BACKEND_API + "/db/favouritepersons",
      body,
      {
        headers: header,
        method: "PUT",
      }
    );
    const data = response.data;
      if (data["result"] == "Success") {
        console.log("Successfully updated FP!");
        setFormSubmitted(true);
      }
    return response.data;
    };
    
    const deleteAlert = async () => {
      Alert.alert('Delete Confirmation', "Are you sure you want to delete this familiar person?",[
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => deleteFP()},
      ]);
    }

    const deleteFP = async () => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      favouritePersonsID:value,
    };
    console.log(body);
    // You must pass any body in through the "data" field, not the "body" field for axios.delete
    const response = await axios.delete(
      REACT_APP_BACKEND_API + "/db/favouritepersons",
      {
        method: "DELETE",
        data:body
      }
    );
    const data = response.data;
    if (data["result"] == "Success") {
      console.log("Successfully deleted FP!");
      setFPDeleted(true);
      setFormSubmitted(true);
    }
    return response.data;
    }; 

  const selectedFP = async(value) => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const response = await axios.get(
      REACT_APP_BACKEND_API + "/db/favouritepersons",
      {
        headers: header,
        method: "GET",
        params: { favouritePersonsID: value },
      }
    );
    console.log(response.data[0]);
    const FP_data = response.data[0];
    setValue(value);
    setFPFirstName(FP_data["FirstName"]);
    setFPLastName(FP_data["LastName"]);
  }
  // const { register, handleSubmit, setValue } = useForm();

  getFPs = async () => {
    let data = await fetchData();
    // console.log(data);
    let new_data = [];
    for (let i = 0; i <data.length; i++){
      new_data.push({label: data[i]["FirstName"] +" "+ data[i]["LastName"] + " (ID: " + data[i]["FavouritePersonsID"] + ")", value: data[i]["FavouritePersonsID"]});
    }
    setFPs(new_data);
  };

  useEffect(() => {
    getFPs();
  }, []);

  const onSubmit = async () => {
    const header = {
      headers: { "Content-Type": "application/json" },
    };
    const body = {
      firstName: FPFirstName,
      lastName: FPLastName,
    };
    const response = await axios.post(
      REACT_APP_BACKEND_API + "/db/favouritepersons",
      body,
      {
        headers: header,
        method: "POST",
      }
    );
    const data = response.data;
    if (data["result"] == "Success") {
      console.log("in success!!");
      setFormSubmitted(true);
    }
  };


  if (formSubmitted == false) {
    return (
      
      <View style={styles.formContainer}>
        <Text style={styles.subtitleText}>FAMILIAR PERSON SEARCH</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={value}
          items={FPs}
          searchable={true}
          placeholder={"Select an FP"}
          setOpen={setDropdownOpen}
          setValue={setValue}
          onChangeValue={() => selectedFP(value)}
          setItems={setFPs}
        />
        <Text style={styles.subtitleText}>FAMILIAR PERSON FIRST NAME</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFPFirstName}
          value={FPFirstName}
        />
        <Text style={styles.subtitleText}>FAMILIAR PERSON LAST NAME</Text>
        <TextInput
          style={styles.input}
          onChangeText={setFPLastName}
          value={FPLastName}
        />
        <Pressable style={styles.button}
        onPress={() => updateFP()}>
          <Text style={styles.text}>Update Familiar Person</Text>
        </Pressable>
        <Pressable style={styles.button2}
        onPress={() => deleteAlert()}>
          <Text style={styles.text}>Delete Familiar Person</Text>
        </Pressable>
      </View>
    );
  } else {
    if (setFPDeleted == true){
      return (
        <View style={styles.formContainer}>
          <Text>
            Familiar Person {FPFirstName} {FPLastName} deleted successfully!
          </Text>
          <Pressable style={styles.button}
          onPress={() => navigation.navigate("Home")}>
            <Text style={styles.text}>Go home</Text>
          </Pressable>
        </View>
      );
    }
    else{
      return (
        <View style={styles.formContainer}>
          <Text>
            Familiar Person {FPFirstName} {FPLastName} updated successfully!
          </Text>
          <Pressable style={styles.button}
          onPress={() => navigation.navigate("Home")}>
            <Text style={styles.text}>Go home</Text>
          </Pressable>
        </View>
      );
    }
    
  }
}

const styles = StyleSheet.create({
  container: {
    //   flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: "10%",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal:"2%"
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
    height: 750,
    width: 600,
    resizeMode: "contain",
  },
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
    marginVertical: 20,
    backgroundColor: '#06038D',
  },
  button2: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    elevation: 3,
    width:800,
    marginVertical: 20,
    backgroundColor: 'darkred',
  },
  text: {
    fontSize: 22,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  input: {
    height: 50,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    backgroundColor: "white",
  },
});
