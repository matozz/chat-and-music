import React, { useState, useEffect } from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import StartMeeting from "../components/StartMeeting";
import { io } from "socket.io-client";
import { Camera } from "expo-camera";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

let socket;
const API_URL = "http://192.168.0.111:3001";

const CreateChat = ({ navigation }) => {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [startCamera, setStartCamera] = useState(false);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const _startCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    if (status === "granted") {
      setStartCamera(true);
    } else {
      Alert.alert("Access denied");
    }
  };

  const joinRoom = () => {
    // _startCamera();
    // socket.emit("join-room", { userName: name, roomId: roomId });
    navigation.goBack();
    navigation.navigate("ChatRoom");
  };

  useEffect(() => {
    socket = io(`${API_URL}`);
    socket.on("connect", () => console.log("connected"));
    socket.on("all-users", (users) => {
      console.log("Active Users", users);
      setActiveUsers(users);
    });

    return () => socket.on("disconnect", () => console.log("disconnected"));
  }, []);

  return (
    <View style={styles.container}>
      {startCamera ? (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.cameraContainer}>
            <Camera
              style={{
                ...styles.camera,
                height: activeUsers.length > 1 ? 480 : "auto",
                flex: activeUsers.length > 1 ? 0 : 1,
              }}
              type={cameraType}
            >
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    setCameraType(
                      cameraType === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back
                    );
                  }}
                >
                  <Ionicons
                    name="ios-camera-reverse-sharp"
                    size={24}
                    color="white"
                  />
                </TouchableOpacity>
              </View>
            </Camera>

            {activeUsers.length > 1 && (
              <ScrollView style={styles.videoContainer} horizontal={true}>
                {activeUsers
                  .filter((user) => user.userName !== name)
                  .map((user) => (
                    <TouchableOpacity style={styles.video} key={user.userName}>
                      <Text style={styles.videoLabel}>{user.userName}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            )}
          </View>

          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ios-mic" size={24} color="white" />
              <Text style={styles.label}>Mute</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ios-videocam" size={24} color="white" />
              <Text style={styles.label}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <MaterialIcons name="airplay" size={22} color="white" />
              <Text style={styles.label}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <MaterialIcons name="group" size={24} color="white" />
              <Text style={styles.label}>Participant</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="ios-chatbubble" size={22} color="white" />
              <Text style={styles.label}>Chat</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : (
        <StartMeeting
          name={name}
          roomId={roomId}
          setName={setName}
          setRoomId={setRoomId}
          joinRoom={joinRoom}
        />
      )}
    </View>
  );
};

export default CreateChat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
    // paddingTop: 10,
    // paddingHorizontal: 12,
  },
  cameraContainer: { flex: 1, backgroundColor: "black" },
  camera: {
    width: "100%",
    // flex: 1,
    // borderRadius: 10,
    overflow: "hidden",
  },
  buttonContainer: {
    padding: 10,
    alignSelf: "flex-end",
  },
  menu: {
    width: "100%",
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  menuButton: {
    alignItems: "center",
    // padding: 3,
    textAlign: "center",
    flex: 1,
    height: 52,
    justifyContent: "space-between",
  },
  label: {
    color: "white",
    marginTop: 4,
    fontWeight: "500",
  },
  videoContainer: {
    width: "100%",
    flex: 1,
  },
  video: {
    flex: 1,
    width: 110,
    backgroundColor: "red",
  },
  videoLabel: {
    color: "white",
    textAlign: "center",
    fontWeight: "500",
    marginTop: "auto",
    paddingBottom: 10,
  },
});
