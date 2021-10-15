import { createUserWithEmailAndPassword, updateProfile } from "@firebase/auth";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import { auth } from "../firebase";
import Color from "../utils/Color";

const Register = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Create New Account",
    });
  }, []);

  const handleRegister = () => {
    setLoading(true);

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user
          .updateProfile({
            displayName: userName,
          })
          .then(() => {
            setUser({
              uid: authUser.user.uid,
              email: authUser.user.email,
              displayName: authUser.user.displayName,
            });
          });
        navigation.popToTop();
      })
      .catch((err) => alert(err.message), setLoading(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loading show={loading} />
      <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
        {/* <Text style={styles.title}>Log in with your phone number</Text> */}
        <View style={styles.inputBox}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholderTextColor={"#858585"}
              placeholder="Email"
              autoFocus
              keyboardAppearance="dark"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputDivider}></View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setUserName(text)}
              value={userName}
              placeholderTextColor={"#858585"}
              placeholder="Username"
              keyboardAppearance="dark"
            />
          </View>
          <View style={styles.inputDivider}></View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholderTextColor={"#858585"}
              placeholder="Password"
              secureTextEntry
              keyboardAppearance="dark"
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
  },
  title: {
    fontSize: 25,
    color: "white",
    fontWeight: "bold",
    paddingHorizontal: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  inputBox: { backgroundColor: "#303030", borderRadius: 10 },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-end",
  },
  input: {
    marginLeft: 4,
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    width: 255,
  },
  inputDivider: {
    height: 1,
    width: "95%",
    backgroundColor: "#444444",
    marginLeft: "auto",
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Color.SystemBlue,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
});
