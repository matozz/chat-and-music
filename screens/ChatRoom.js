import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Keyboard,
  Linking,
  View,
  Text,
  // Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  DeviceEventEmitter,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppContext from "../context/AppContext";
import "react-native-get-random-values";
import SocketContext from "../context/SocketContext";
import { Modalize } from "react-native-modalize";
import ChatOption from "../components/ChatOption";
import Loading from "../components/Loading";
import {
  getRoomInfoById,
  updateRoomAuthByUserId,
  updateRoomStatusByRoomId,
} from "../db/room";
import { getEarlyMessagesById, insertMessage } from "../db/messages";
import {
  GiftedChat,
  InputToolbar,
  Send,
} from "@matoz/react-native-gifted-chat";
import AccessoryTag from "../components/AccessoryTag";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";
import Lightbox from "react-native-lightbox";
import Image from "react-native-scalable-image";
import { useFocusEffect } from "@react-navigation/native";

const parsePatterns = (_linkStyle) => {
  return [
    {
      pattern: /# (\w+)/,
      style: { textDecorationLine: "underline", color: "darkorange" },
      onPress: () => Linking.openURL("https://matoz.tech"),
    },
  ];
};

const PUBLIC_MSG = {
  _id: "__PUBLIC__MSG__",
  text: `欢迎进入公共聊天室👏！消息将会对所有用户广播！`,
  createdAt: new Date(),
  system: true,
};

const EARLY_MSG = {
  _id: "__EARLY__MSG__",
  text: `以上是历史消息！`,
  createdAt: new Date(),
  system: true,
};

const ChatRoom = ({ navigation, route }) => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [musicRoomInfo, setMusicRoomInfo] = useState({});
  const [roomSize, setRoomSize] = useState(0);
  const [roomName, setRoomName] = useState(route?.params?.name ?? null);
  const [isExpand, setIsExpand] = useState(false);

  const modalizeRef = useRef(null);

  const {
    user: { user },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  const { roomId, isNewCreate } = route.params;

  useLayoutEffect(() => {
    const { name, isPublic, memberNum } = musicRoomInfo;
    navigation.setOptions({
      headerTitle: !isConnecting
        ? `${name}${!isPublic ? `(${roomSize}/${memberNum})` : ""} `
        : "Connecting",
      headerBackTitle: "",
      headerRight: () => (
        <TouchableOpacity
          style={{ ...styles.button, paddingLeft: 20 }}
          onPress={handleModalOpen}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#0084ff" />
        </TouchableOpacity>
      ),
    });
  }, [roomSize, isConnecting, roomName, musicRoomInfo]);

  useEffect(() => {
    (async () => {
      const result = await getRoomInfoById({ roomId });
      setIsConnecting(false);
      setMusicRoomInfo(result.data);

      const isPublic = result.data.isPublic;
      const msg = await getEarlyMessagesById({ roomId });
      setMessages([...(isPublic ? [PUBLIC_MSG] : []), EARLY_MSG, ...msg.data]);
    })();

    socket.emit(
      "join-room",
      { roomId, isNewCreate },
      user,
      async (roomSize) => {
        setRoomSize(roomSize);
      }
    );
  }, []);

  useFocusEffect(
    useCallback(() => {
      socket.on("receive-message", (msg) => {
        handleNewMessage(msg);
      });

      socket.on("room-size", (size) => {
        setRoomSize(size);
      });

      socket.on("receive-typing", (status) => {
        setTyping(status);
      });

      socket.on("receive-music-room", ({ musicMode, musicInfo }) => {
        setMusicRoomInfo((musicRoomInfo) => ({
          ...musicRoomInfo,
          musicMode,
          musicInfo,
        }));
      });

      socket.on("force-room-size", (size) => {
        setMusicRoomInfo((musicRoomInfo) => ({
          ...musicRoomInfo,
          memberNum: size,
        }));
      });

      socket.on("force-room-close", () => {
        Alert.alert("警告", "该房间已被管理员关闭！", [
          { text: "确定", onPress: () => navigation.goBack() },
        ]);
      });

      DeviceEventEmitter.addListener(
        "event.directUpdate",
        (musicMode, musicInfo) =>
          setMusicRoomInfo((musicRoomInfo) => ({
            ...musicRoomInfo,
            musicMode,
            musicInfo,
          }))
      );

      return () => {
        socket.off("receive-message");
        socket.off("room-size");
        socket.off("receive-typing");
        socket.off("receive-music-room");
        socket.off("force-room-size");
      };
    }, [])
  );

  const onSend = useCallback((messages = []) => {
    socket.emit("send-message", messages, roomId);
    handleNewMessage(messages);
    insertMessage({ roomId, user, messages });
  }, []);

  const onTyping = useCallback((msg) => {
    if (!msg) return;
    socket.emit("send-typing", roomId);
  }, []);

  const onMusicInviteSend = () => {
    const messages = [
      {
        _id: uuidv4(),
        createdAt: new Date(),
        user: {
          _id: user.uid,
          name: user.displayName,
        },
        content: {
          pack: "Jay Chou",
        },
        video: "-",
      },
    ];
    socket.emit("send-message", messages, roomId);
    handleNewMessage(messages);
    insertMessage({ roomId, user, messages });
  };

  const onImageSend = (base64) => {
    const messages = [
      {
        _id: uuidv4(),
        createdAt: new Date(),
        user: {
          _id: user.uid,
          name: user.displayName,
        },
        image: base64,
      },
    ];
    socket.emit("send-message", messages, roomId);
    handleNewMessage(messages);
    insertMessage({ roomId, user, messages });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });

    if (!result.cancelled) {
      onImageSend(result.base64);
    }
  };

  const handleNewMessage = useCallback((messages) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  });

  const handleModalOpen = () => {
    Keyboard.dismiss();
    modalizeRef.current?.open();
  };

  const handleModalClose = () => {
    Keyboard.dismiss();
    modalizeRef.current?.close();
  };

  const handleClosedChange = async (v) => {
    console.log(v);
    setLoading(true);
    const { code, message } = await updateRoomStatusByRoomId({
      roomId,
      isClosed: v,
    });
    if (code === 200) {
      setMusicRoomInfo({ ...musicRoomInfo, isClosed: v });
      setLoading(false);
      alert(message);
    } else {
      setLoading(false);
      alert(message);
    }
  };

  const handleHostChange = async () => {
    Alert.prompt(
      "转移聊天室权限",
      "请输入转移用户UID，用户需在聊天室中！",
      [
        {
          text: "取消",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "转移",
          style: "destructive",
          onPress: async (uid) => {
            setLoading(true);
            const { code: _code, message: _message } =
              await updateRoomAuthByUserId({
                roomId,
                userId: uid,
                isHost: true,
              });
            if (_code === 404) {
              alert(_message);
              setLoading(false);
              return;
            }
            const { code, message } = await updateRoomAuthByUserId({
              roomId,
              userId: user.uid,
              isHost: false,
            });
            if (code === 404) {
              alert(message);
              setLoading(false);
              return;
            }
            await updateRoomStatusByRoomId({ roomId, creator: uid });
            setMusicRoomInfo({ ...musicRoomInfo, creator: uid });
            setLoading(false);
          },
        },
      ],
      "plain-text"
    );
  };

  const renderCustomMessage = (msg) => {
    const curMsg = msg.currentMessage;
    return (
      <View style={{ padding: 10, width: 265 }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            marginBottom: 10,
            width: 230,
          }}
        >
          <Ionicons name="ios-musical-note" size={22} color="#fff" />
          <Text
            style={{
              color: "white",
              paddingLeft: 8,
              paddingRight: 8,
              fontSize: 15,
              fontWeight: "500",
            }}
          >
            {curMsg.user.name}邀请你加入音乐创作模式
          </Text>
        </View>
        <View
          style={{
            width: 230,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              width: 245,
              height: 160,
              borderRadius: 8,
              overflow: "hidden",
            }}
            onPress={() => {
              navigation.navigate("Music", {
                type: "record",
                packIndex: 0,
                entry: "实时创作",
                roomId: roomId,
                host: curMsg.user.uid,
              });
            }}
          >
            <Image source={require("../assets/img/Cover3.jpg")} width={245} />
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
              }}
            >
              <Ionicons name="ios-play-circle" size={50} color="#ececec" />
            </View>
          </TouchableOpacity>
          <Text
            style={{
              color: "white",
              fontSize: 15,
              fontWeight: "500",
              marginTop: 10,
            }}
          >
            当前素材包: {curMsg.content.pack}
          </Text>
        </View>
      </View>
    );
  };

  const renderImageMessage = (msg) => {
    const curMsg = msg.currentMessage;
    return (
      <View style={{ overflow: "hidden", padding: 6 }}>
        {/* <Lightbox
          activeProps={{
            flex: 1,
            resizeMode: "contain",
            width: "100%",
          }}
          // backgroundColor="transparent"
          underlayColor="transparent"
          renderHeader={(close) => (
            <TouchableOpacity
              style={{
                padding: 6,
                marginTop: 46,
                paddingHorizontal: 12,
              }}
              onPress={close}
            >
              <Ionicons name="ios-close" size={30} color="#fff" />
            </TouchableOpacity>
          )}
        > */}
        <Image
          source={{ uri: "data:image/jpeg;base64," + curMsg.image }}
          width={200}
          style={{ borderRadius: 10 }}
        />
        {/* </Lightbox> */}
      </View>
    );
  };

  const renderAccessory = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          paddingHorizontal: 10,
        }}
      >
        <AccessoryTag
          icon="ios-play-circle"
          label="发送音乐邀请"
          onPress={onMusicInviteSend}
        />
        <AccessoryTag icon="ios-image" label="发送图片" onPress={pickImage} />
      </View>
    );
  };

  return (
    <>
      <Modalize
        ref={modalizeRef}
        modalHeight={600}
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
            roomSize,
          }}
          musicRoomInfo={musicRoomInfo}
          handleModalClose={handleModalClose}
          handleClosedChange={handleClosedChange}
          handleHostChange={handleHostChange}
        />
      </Modalize>
      <Loading show={loading} />
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
        bottomOffset={24}
        textInputProps={{
          autoCapitalize: "none",
          keyboardAppearance: "dark",
          autoCorrect: false,
        }}
        textInputStyle={styles.textInputStyle}
        placeholder="输入消息"
        isTyping={typing}
        // loadEarlier
        renderActions={() => (
          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              paddingBottom: 8,
              paddingLeft: 10,
            }}
            onPress={() => setIsExpand(!isExpand)}
          >
            <Ionicons
              name={`ios-${isExpand ? "remove" : "add"}-circle`}
              size={24}
              color="#0084ff"
            />
          </TouchableOpacity>
        )}
        renderSend={(props) => (
          <Send {...props}>
            <View
              style={{
                padding: 8,
                paddingHorizontal: 12,
              }}
            >
              <Ionicons name="ios-send" size={24} color="#0084ff" />
            </View>
          </Send>
        )}
        renderInputToolbar={(props) => (
          <InputToolbar {...props} key={isExpand} />
        )}
        renderMessageVideo={(props) => renderCustomMessage(props)}
        renderMessageImage={(props) => renderImageMessage(props)}
        renderAccessory={isExpand ? renderAccessory : null}
        multiline={false}
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

const styles = StyleSheet.create({
  inputToolbar: {
    // minHeight: 50,
  },
  textInputStyle: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 10,
    color: "white",
    borderColor: "#555",
  },
});
