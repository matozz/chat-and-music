import React, { useContext, useState } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Keyboard,
  Alert,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import SocketContext from "../context/SocketContext";
import Color from "../utils/Color";

const CreateChat = ({ navigation }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  const joinRoom = () => {
    if (!user) {
      Alert.prompt(
        "Username Required",
        "To start a chat, please enter your username",
        [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Confirm",
            onPress: (text) => {
              setUser(text);
            },
          },
        ],
        "plain-text"
      );
    } else {
      setLoading(true);
      Keyboard.dismiss();
      socket.emit("check-room", roomId, (status) => {
        if (status) {
          handleNavigate();
        } else {
          alert("房间已存在！");
          setLoading(false);
        }
      });
    }
  };

  const handleNavigate = () => {
    const timer = setTimeout(() => {
      navigation.goBack();
      navigation.navigate("ChatRoom", {
        name: name,
        roomId: roomId,
      });
      // setLoading(false);
      clearTimeout(timer);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Loading show={loading} />
      <View style={styles.inputBox}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholderTextColor={"#858585"}
            placeholder="请输入房间名"
            autoFocus
            keyboardAppearance="dark"
          />
        </View>
        <View style={styles.inputDivider}></View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRoomId(text)}
            value={roomId}
            placeholderTextColor={"#858585"}
            placeholder="房间号"
            keyboardAppearance="dark"
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={joinRoom}
        activeOpacity={0.5}
      >
        <Text style={styles.buttonText}>创建</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  inputBox: { backgroundColor: "#303030", borderRadius: 10 },
  inputContainer: {
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  input: {
    marginLeft: 10,
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
  label: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    paddingHorizontal: 6,
    width: 60,
  },
  button: {
    marginVertical: 20,
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
