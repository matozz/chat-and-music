import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  AppState,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import AppContext from "../context/AppContext";
import "react-native-get-random-values";
import SocketContext from "../context/SocketContext";
import { Modalize } from "react-native-modalize";
import ChatOption from "../components/ChatOption";
import Loading from "../components/Loading";

const parsePatterns = (_linkStyle) => {
  return [
    {
      pattern: /#(\w+)/,
      style: { textDecorationLine: "underline", color: "darkorange" },
      onPress: () => Linking.openURL("https://matoz.live"),
    },
  ];
};

const ChatRoom = ({ navigation, route }) => {
  // const appState = useRef(AppState.currentState);
  // const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [isConnecting, setIsConnecting] = useState(false);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [musicRoomInfo, setMusicRoomInfo] = useState({ info: {}, host: "" });
  const [roomSize, setRoomSize] = useState(0);
  const [roomName, setRoomName] = useState(route?.params?.name ?? null);

  const modalizeRef = useRef(null);

  const {
    user: { user },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  const { roomId, _roomType } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: !isConnecting
        ? `${roomName ? roomName : "Room"} (${roomSize})`
        : "Connecting",
      headerBackTitle: "",
      headerRight: () => (
        <TouchableOpacity
          style={{ ...styles.button, paddingLeft: 20 }}
          onPress={handleModalOpen}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#efefef" />
        </TouchableOpacity>
      ),
    });
  }, [roomSize, isConnecting, roomName]);

  useEffect(() => {
    // if (appStateVisible !== "active") return;
    // setIsConnecting(true);
    if (roomId) {
      socket.emit(
        "join-room",
        { roomId, roomName },
        user,
        (message, roomName, roomSize) => {
          handleNewMessage(message);
          setRoomName(roomName);
          setRoomSize(roomSize);
        }
      );
    } else {
      socket.emit("join-public-room", (message, roomName, roomSize) => {
        handleNewMessage(message);
        setRoomName(roomName);
        setRoomSize(roomSize);
      });
    }

    socket.on("receive-message", (msg) => {
      handleNewMessage(msg);
    });

    socket.on("room-size", (size) => {
      setRoomSize(size);
    });

    socket.on("receive-typing", (status) => {
      setTyping(status);
    });

    socket.on("music-room-info", (room) => {
      // if (room) {
      setMusicRoomInfo(room);
      // }
    });

    return () => {
      socket.off("receive-message");
      socket.off("room-size");
      socket.off("receive-typing");
      socket.off("music-room-info");
    };
  }, []);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: "How did you know this app?",
        createdAt: new Date(),
        quickReplies: {
          type: "checkbox", // or 'radio',
          values: [
            {
              title: "Friend",
              value: "friend",
            },
            {
              title: "By Accident",
              value: "accident",
            },
            {
              title: "Yes. What?",
              value: "yes",
            },
            {
              title: "APP Store",
              value: "store",
            },
          ],
        },
        user: {
          _id: 1,
          name: "A D",
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    socket.emit("send-message", messages, roomId);
    handleNewMessage(messages);
  }, []);

  const onTyping = useCallback((msg) => {
    if (!msg) return;
    socket.emit("send-typing", roomId);
  }, []);

  const onQuickReply = (msg) => {
    console.log(msg);
  };

  const handleNewMessage = useCallback((messages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  });

  const handleModalOpen = () => {
    socket.emit("get-music-room", roomId, (room) => {
      // if (room) {
      setMusicRoomInfo(room);
      // }
    });
    Keyboard.dismiss();
    modalizeRef.current?.open();
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    modalizeRef.current?.close();
  };

  return (
    <>
      <Modalize
        ref={modalizeRef}
        modalHeight={400}
        modalStyle={{ backgroundColor: "#202020" }}
        handleStyle={{ backgroundColor: "#888888" }}
      >
        <ChatOption
          user={user}
          socket={socket}
          roomId={roomId}
          navigation={navigation}
          roomInfo={{
            roomId,
            roomName,
            roomType: _roomType,
          }}
          musicRoomInfo={musicRoomInfo}
          handleModalClose={handleModalClose}
        />
      </Modalize>
      {Platform.OS === "ios" && <Loading show={loading} />}
      <GiftedChat
        messages={messages}
        messagesContainerStyle={{
          backgroundColor: "#1c1c1c",
        }}
        parsePatterns={parsePatterns}
        showUserAvatar={true}
        alwaysShowSend={true}
        // loadEarlier={true}
        // isLoadingEarlier={true}
        bottomOffset={34}
        textInputProps={{
          autoCapitalize: "none",
          keyboardAppearance: "dark",
          autoCorrect: false,
        }}
        textInputStyle={{
          color: "white",
          fontWeight: "500",
        }}
        isTyping={typing}
        onQuickReply={(message) => onQuickReply(message)}
        onInputTextChanged={(msg) => onTyping(msg)}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
          name: user.displayName,
        }}
      />
    </>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
