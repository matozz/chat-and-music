import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import { auth, db, firebase } from "../firebase";
import SocketContext from "../context/SocketContext";
import Color from "../utils/Color";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  const handleLogin = () => {
    setLoading(true);

    auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        const { user } = await auth.signInWithEmailAndPassword(email, password);

        db.collection("users").doc(user.uid).set({
          createTime: firebase.firestore.FieldValue.serverTimestamp(),
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        socket.emit("go-online", {
          userinfo: {
            name: 123,
            id: 1,
          },
        });
        navigation.popToTop();
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <Loading show={loading} />}
      <Image source={require("../assets/img/home.jpg")} style={styles.bg} />
      <SafeAreaView style={styles.content}>
        <Text style={styles.title}>Enjoy and share the music with us!</Text>
        <View style={styles.inputBox}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setEmail(text)}
              value={email}
              placeholderTextColor={"#858585"}
              placeholder="Email"
              keyboardAppearance="dark"
              keyboardType="email-address"
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
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
  },
  bg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: "cover",
  },
  content: {
    marginHorizontal: 20,
    paddingTop: 30,
    position: "absolute",
    bottom: 80,
  },
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "500",
    paddingHorizontal: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  inputBox: { backgroundColor: "#30303060", borderRadius: 10 },
  inputContainer: {
    flexDirection: "row",
    padding: 14,
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
    padding: 12,
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
