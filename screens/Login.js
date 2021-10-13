import React, { useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import Color from "../utils/Color";

const Login = ({ navigation }) => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      navigation.popToTop();
      // setLoading(false);
      clearTimeout(timer);
    }, 1000);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Loading show={loading} />
      <View style={{ paddingHorizontal: 16, paddingTop: 30 }}>
        <Text style={styles.title}>Log in with your phone number</Text>
        <View style={styles.inputBox}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPhone(text)}
              value={phone}
              placeholderTextColor={"#858585"}
              placeholder="Phone number"
              keyboardAppearance="dark"
              keyboardType="number-pad"
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Register")}
        >
          <Text style={styles.buttonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;

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
