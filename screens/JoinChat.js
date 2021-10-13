import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Color from "../utils/Color";

const JoinChat = ({ navigation }) => {
  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    navigation.goBack();
    navigation.navigate("ChatRoom");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Code</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setRoomId(text)}
            value={roomId}
            autoFocus
            placeholderTextColor={"#858585"}
            placeholder="请输入房间号"
            keyboardAppearance="dark"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={joinRoom}>
        <Text style={styles.buttonText}>加入</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JoinChat;

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
    padding: 12,
    alignItems: "flex-end",
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
