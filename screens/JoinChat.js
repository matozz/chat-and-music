import React, { useContext, useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
  ScrollView,
  Platform,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import Color from "../utils/Color";
import { AntDesign } from "@expo/vector-icons";
import SocketContext from "../context/SocketContext";
import { db } from "../firebase";
import { getRoomList, joinRoomById } from "../db/room";

const PUBLIC_ROOM = {
  name: "公共房间",
  roomId: "__PUBLIC",
  isPublic: true,
};

const JoinChat = ({ navigation }) => {
  const [roomId, setRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [loadRoom, setLoadRoom] = useState(true);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  useEffect(() => {
    // socket.emit("user-active-room", (rooms) => {
    //   // console.log(rooms);
    //   setRooms(rooms);
    // });

    (async () => {
      setLoadRoom(true);
      const result = await getRoomList({ user });
      setRooms([PUBLIC_ROOM, ...result.data]);
      setLoadRoom(false);
    })();
  }, []);

  const joinRoom = async ({ roomId, isByRoomId }) => {
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
      if (isByRoomId) {
        const result = await joinRoomById({ roomId, user });
        if (result.code === 200) {
          handleNavigate(roomId, true);
        } else {
          alert(result.message);
          setLoading(false);
        }
      } else {
        handleNavigate(roomId);
      }
    }
  };

  const renderPresetRow = ({ roomId, name, memberNum, isPublic }, index) => (
    <TouchableOpacity
      key={roomId}
      style={styles.chat}
      activeOpacity={0.5}
      onPress={() => {
        joinRoom({ roomId });
      }}
    >
      <View style={styles.chatInfo}>
        {isPublic ? (
          <Text style={styles.chatName}>公共房间</Text>
        ) : (
          <Text style={styles.chatName}>{name}</Text>
        )}
        {!isPublic && <Text style={styles.chatUser}> ({memberNum})</Text>}
      </View>
      <View style={styles.joinIcon}>
        <AntDesign name="arrowright" size={24} color={Color.SystemWhite2} />
      </View>
    </TouchableOpacity>
  );

  const handleNavigate = (roomId, isNewCreate) => {
    const timer = setTimeout(() => {
      navigation.goBack();
      navigation.navigate("ChatRoom", {
        roomId,
        isNewCreate,
      });
      clearTimeout(timer);
    }, 500);
  };

  return (
    <View style={styles.container}>
      <Loading show={loading} />
      <ScrollView>
        <View style={styles.inputBox}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Code</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setRoomId(text)}
              value={roomId}
              // autoFocus
              placeholderTextColor={"#858585"}
              placeholder="请输入房间号"
              keyboardAppearance="dark"
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => joinRoom({ roomId, isByRoomId: true })}
          activeOpacity={0.5}
        >
          <Text style={styles.buttonText}>加入</Text>
        </TouchableOpacity>

        <View style={{ ...styles.section, marginTop: 0 }}>
          <Text style={styles.title}>我的房间</Text>
          <View style={styles.chatList}>
            <Loading show={loadRoom} block />
            {rooms.map(renderPresetRow)}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default JoinChat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
    paddingTop: 10,
    paddingHorizontal: 15,
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
  section: {
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 17,
    // marginLeft: 15,
    color: Color.SystemWhite2,
    fontWeight: "bold",
  },
  chatList: {
    paddingVertical: 20,
  },
  chat: {
    height: 70,
    width: "100%",
    backgroundColor: Color.SystemGray5,
    marginBottom: 10,
    borderRadius: 12,
    padding: 16,
    // paddingRight: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  chatInfo: {
    flexDirection: "row",
  },
  chatName: {
    color: Color.SystemWhite2,
    fontWeight: "700",
    fontSize: 15,
  },
  chatUser: {
    color: Color.SystemWhite2,
    fontWeight: "500",
  },
  joinIcon: {
    height: 38,
    width: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: Color.SystemGray4,
  },
});
