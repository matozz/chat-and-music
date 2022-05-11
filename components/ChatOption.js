import SegmentedControl from "@react-native-segmented-control/segmented-control";
import React, { useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  View,
  Switch,
} from "react-native";
import AppContext from "../context/AppContext";
import { deleteRoomByRoomId, leaveRoomByUserId } from "../db/room";
import Color from "../utils/Color";

const MsgMap = {
  host: {
    title: "关闭聊天室",
    content: "聊天室数据将会被清空",
  },
  normal: {
    title: "退出聊天室",
    content: "聊天室将不会出现在你的聊天列表中",
  },
};

const ChatOption = ({
  user,
  socket,
  roomId,
  navigation,
  roomInfo,
  musicRoomInfo,
  handleModalClose,
  handleClosedChange,
  handleHostChange,
}) => {
  const isHost = musicRoomInfo.creator === user.uid;

  const isOpen = Boolean(musicRoomInfo?.musicMode);
  const isPublic = roomInfo.roomId === "__PUBLIC";

  const { isClosed } = musicRoomInfo;

  const handleSendMusic = () => {
    navigation.navigate("Music", {
      type: "record",
      packIndex: 0,
      entry: "编辑乐段",
    });
    handleModalClose();
  };

  const handleLiveMusic = () => {
    if (!isOpen && !isHost) {
      alert("创作功能暂未开放，请通知创建者开启");
      return;
    }
    navigation.navigate("Music", {
      type: "live",
      initConfig: { ...musicRoomInfo?.musicInfo },
      entry: "实时创作",
      roomId: roomId,
      isHost,
      isNewCreate: !musicRoomInfo?.musicMode,
    });
    handleModalClose();
  };

  const handleLeaveChat = () => {
    Alert.alert(
      MsgMap[isHost ? "host" : "normal"].title,
      MsgMap[isHost ? "host" : "normal"].content,
      [
        {
          text: "取消",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "确定",
          onPress: async () => {
            if (isHost) {
              const { code, message } = await deleteRoomByRoomId({ roomId });

              if (code === 200) {
                socket.emit("close-room", roomId);
                navigation.navigate("Home");
              } else {
                console.log(message);
                alert(message);
              }
            } else {
              const { code, message } = await leaveRoomByUserId({
                roomId,
                user,
              });

              if (code === 200) {
                socket.emit("leave-room", roomId, user);
                navigation.navigate("Home");
              } else {
                console.log(message);
                alert(message);
              }
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ marginVertical: 6, marginHorizontal: 12 }}>
      <TouchableOpacity style={styles.mode} onPress={handleSendMusic}>
        <Text style={styles.buttonText}>发送乐段</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.mode} onPress={handleLiveMusic}>
        <Text style={styles.buttonText}>实时创作</Text>
      </TouchableOpacity>
      {isHost && (
        <TouchableOpacity
          style={{ ...styles.button, backgroundColor: Color.SystemGray4 }}
          onPress={handleHostChange}
        >
          <Text style={styles.buttonText}>转移聊天室权限</Text>
        </TouchableOpacity>
      )}
      {!roomInfo.roomType && !isPublic && (
        <TouchableOpacity style={styles.button} onPress={handleLeaveChat}>
          <Text style={styles.buttonText}>
            {isHost ? "关闭聊天室" : "退出聊天室"}
          </Text>
        </TouchableOpacity>
      )}

      {!isPublic && isHost && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 8,
          }}
        >
          <Text
            style={{ color: Color.SystemWhite, fontSize: 16, paddingRight: 8 }}
          >
            允许新成员加入
          </Text>
          <Switch
            trackColor={{ false: Color.SystemRed, true: Color.SystemGreen }}
            ios_backgroundColor={Color.SystemRed}
            onValueChange={() => handleClosedChange(!isClosed)}
            value={!isClosed}
          />
        </View>
      )}

      <View style={{ paddingTop: 8 }}>
        <Text style={styles.info}>聊天室ID: {roomInfo.roomId}</Text>
        <Text style={styles.info}>管理员ID: {musicRoomInfo.creator}</Text>
        <Text style={styles.info}>聊天室名称: {musicRoomInfo.name}</Text>
        <Text style={styles.info}>当前人数: {roomInfo.roomSize}</Text>
        <Text style={styles.info}>
          聊天室成员人数: {musicRoomInfo.memberNum}
        </Text>
        <Text style={styles.info}>
          用户权限: {isHost ? "创建者" : "普通成员"}
        </Text>
        <Text style={styles.info}>创作模式: {isOpen ? "开启" : "关闭"}</Text>
        {isOpen && (
          <Text style={styles.info}>
            创作模式: {JSON.stringify(musicRoomInfo?.musicInfo)}
          </Text>
        )}
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
