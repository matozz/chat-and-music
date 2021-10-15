import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AppState, Linking, StyleSheet, TouchableOpacity } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import { Ionicons } from "@expo/vector-icons";
import AppContext from "../context/AppContext";
import "react-native-get-random-values";
import { socket } from "../sockets";

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
  const [users, setUsers] = useState([]);
  const [roomName, setRoomName] = useState(route?.params?.name ?? null);

  const {
    user: { user },
  } = useContext(AppContext);

  const { roomId } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: !isConnecting
        ? `${roomName ? roomName : "Room"} (${users.length})`
        : "Connecting",
      headerBackTitle: "",
      headerRight: () => (
        <TouchableOpacity style={{ ...styles.button, paddingLeft: 20 }}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#efefef" />
        </TouchableOpacity>
      ),
    });
  }, [users, isConnecting, roomName]);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (
  //       appState.current.match(/inactive|background/) &&
  //       nextAppState === "active"
  //     ) {
  //       // console.log("App has come to the foreground!");
  //     }

  //     appState.current = nextAppState;
  //     setAppStateVisible(appState.current);
  //     // console.log("AppState", appState.current);
  //   });

  //   return () => {
  //     subscription && subscription.remove();
  //   };
  // }, []);

  useEffect(() => {
    // if (appStateVisible !== "active") return;
    setIsConnecting(true);

    socket.emit("join-room", {
      roomName: roomName,
      user: user,
      roomId: roomId,
    });

    socket.on("all-users", (users) => {
      setUsers(users);
      setIsConnecting(false);
    });

    socket.on("all-msg", (msg) => {
      handleNewMessage(msg);
      console.log("update");
    });

    socket.on("room-name", (name) => {
      setRoomName(name);
      console.log(name);
    });

    socket.on("room-typing", (status) => {
      setTyping(status);
    });

    return () => {
      console.log(11111111);
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
    socket.emit("send-msg", { roomId: roomId, msg: messages });
    // setMessages((previousMessages) =>
    //   GiftedChat.append(previousMessages, messages)
    // );
  }, []);

  const onTyping = useCallback((msg) => {
    if (!msg) return;
    socket.emit("typing-msg", { roomId: roomId });
  }, []);

  const onQuickReply = (msg) => {
    console.log(msg);
  };

  const handleNewMessage = useCallback((messages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  });

  return (
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
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
