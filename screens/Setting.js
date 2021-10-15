import { signOut } from "@firebase/auth";
import React, { useContext, useLayoutEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import { auth } from "../firebase";
import { socket } from "../sockets";

const Setting = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.navButton}>Done</Text>
        </TouchableOpacity>
      ),
    });
  });

  const handleLogout = () => {
    Alert.alert("Log Out", "You will no longer to recive the chat messages", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Comfirm",
        onPress: () => {
          setLoading(true);
          auth.signOut().then(() => {
            socket.emit("go-offline", {
              userinfo: {
                name: 123,
                id: 1,
              },
            });
            navigation.replace("Login");
          });
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Loading show={loading} />
      <View style={styles.inputBox}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            // onChangeText={(text) => setUser(text)}
            value={user?.displayName}
            autoFocus
            placeholderTextColor={"#858585"}
            placeholder="Enter username"
            keyboardAppearance="dark"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  navButton: {
    color: "white",
    fontWeight: "600",
    fontSize: 17,
  },
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  inputBox: { backgroundColor: "#303030", borderRadius: 10 },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    alignItems: "flex-end",
  },
  input: {
    marginLeft: 0,
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    width: 220,
  },
  inputDivider: {
    height: 1,
    width: "95%",
    backgroundColor: "#444444",
    marginLeft: "auto",
  },
  label: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 6,
    width: 100,
  },
  button: {
    marginVertical: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
});
