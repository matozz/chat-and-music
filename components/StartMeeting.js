import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Color from "../utils/Color";

const StartMeeting = ({ name, roomId, setName, setRoomId, joinRoom }) => {
  return (
    <View style={styles.container}>
      <View style={styles.inputBox}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
            value={name}
            placeholderTextColor={"#858585"}
            placeholder="Meeting Name"
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
            placeholder="Room Code"
            keyboardAppearance="dark"
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={joinRoom}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartMeeting;

const styles = StyleSheet.create({
  container: { paddingHorizontal: 12, paddingTop: 10 },
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
    backgroundColor: Color.SystemRed,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
});
