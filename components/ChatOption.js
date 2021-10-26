import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  View,
} from "react-native";
import AppContext from "../context/AppContext";
import Color from "../utils/Color";

const ChatOption = ({
  user,
  socket,
  roomId,
  navigation,
  roomInfo,
  musicRoomInfo: { info, host },
  handleModalClose,
}) => {
  const handleSendMusic = () => {
    navigation.navigate("Music", {
      type: "record",
      packIndex: 0,
      entry: "编辑乐段",
    });
    handleModalClose();
  };

  const handleLiveMusic = () => {
    navigation.navigate("Music", {
      type: "live",
      packIndex: 0,
      entry: "实时创作",
      roomId: roomId,
      host: host || user.uid,
    });
    handleModalClose();
  };

  const handleLeaveChat = () => {
    Alert.alert(
      "Leave the chat",
      "The chat will no not show up in your chat list",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Comfirm",
          onPress: () => {
            socket.emit("leave-room", roomId, user, () => navigation.goBack());
          },
          style: "destructive",
        },
      ]
    );
  };
  return (
    <SafeAreaView style={{ marginVertical: 10, marginHorizontal: 10 }}>
      <TouchableOpacity style={styles.mode} onPress={handleSendMusic}>
        <Text style={styles.buttonText}>发送乐段</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mode} onPress={handleLiveMusic}>
        <Text style={styles.buttonText}>实时创作</Text>
      </TouchableOpacity>
      {!roomInfo.roomType && (
        <TouchableOpacity style={styles.button} onPress={handleLeaveChat}>
          <Text style={styles.buttonText}>Leave Chat</Text>
        </TouchableOpacity>
      )}
      <View>
        <Text style={styles.info}>RoomID: {roomInfo.roomId}</Text>
        <Text style={styles.info}>RoomName: {roomInfo.roomName}</Text>
        <Text style={styles.info}>
          RoomType: {roomInfo.roomType || "group"}
        </Text>
        <Text style={styles.info}>isOpen: {String(info?.isOpen)}</Text>
        <Text style={styles.info}>isPlaying: {String(info?.isPlaying)}</Text>
        <Text style={styles.info}>nowPlaying: {info?.pack}</Text>
        <Text style={styles.info}>bpm: {info?.bpm}</Text>
        <Text style={styles.info}>host: {host}</Text>
      </View>
    </SafeAreaView>
  );
};

export default ChatOption;

const styles = StyleSheet.create({
  mode: {
    backgroundColor: Color.SystemGray4,
    padding: 10,
    paddingVertical: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  button: {
    marginVertical: 10,
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
  info: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
});
