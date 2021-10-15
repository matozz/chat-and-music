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
import { auth, db, firebase } from "../firebase";
import { socket } from "../sockets";
import Color from "../utils/Color";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

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
    <SafeAreaView style={styles.container}>
      <Loading show={loading} />
      <View style={{ paddingHorizontal: 16, paddingTop: 30 }}>
        <Text style={styles.title}>Log in with your email</Text>
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
