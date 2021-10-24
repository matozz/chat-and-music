import { signOut } from "@firebase/auth";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import { auth, db } from "../firebase";
import SocketContext from "../context/SocketContext";
import Color from "../utils/Color";

const Setting = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  const valueRef = useRef();

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{ paddingLeft: 20 }}
          onPress={() => navigation.goBack()}
          activeOpacity={0.5}
        >
          <Text style={styles.navButton}>Done</Text>
        </TouchableOpacity>
      ),
    });
  });

  useEffect(() => {
    valueRef.current = username;
  }, [username]);

  useEffect(() => {
    setUsername(user?.displayName);
    return () => {
      let username = valueRef.current;
      if (auth.currentUser?.uid && auth.currentUser.displayName !== username) {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({ displayName: username })
          .then(() => {
            auth.currentUser
              .updateProfile({
                displayName: username,
              })
              .then((res) => {
                setUser({
                  ...user,
                  displayName: username,
                });
              });
          });
      }
    };
  }, []);

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
            navigation.replace("Login");
          });
        },
        style: "destructive",
      },
    ]);
  };

  const handleLogin = () => {
    setLoading(true);
    const timer = setTimeout(() => {
      navigation.replace("Login");
      clearTimeout(timer);
    }, 300);
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "ios" && <Loading show={loading} />}
      {user.uid ? (
        <>
          <View style={styles.inputBox}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setUsername(text)}
                value={username}
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
        </>
      ) : (
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: Color.SystemBlue }}
          activeOpacity={0.5}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      )}
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
    alignItems: "center",
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
