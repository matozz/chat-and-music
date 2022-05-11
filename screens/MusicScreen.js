import React, {
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
  useContext,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Platform,
  DeviceEventEmitter,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PadList from "../components/PadList";
import { Modalize } from "react-native-modalize";
import MuiscOption from "../components/MuiscOption";
import MusicActionBar from "../components/MusicActionBar";
import MusicContext from "../context/MusicContext";
import { PACKS } from "../utils/MusicPacks";
import Loading from "../components/Loading";
import { db, firebase } from "../firebase";
import AppContext from "../context/AppContext";
import { useInterval } from "../hooks/useInterval";
import SocketContext from "../context/SocketContext";
import i18n from "../i18n";
import {
  closeMusicRoomById,
  openMusicRoomById,
  updateMusicRoomById,
} from "../db/music";

const MusicScreen = ({ navigation, route }) => {
  const {
    bpm: _bpm,
    mode: _mode,
    packIndex: _packIndex,
    start: _start,
  } = route?.params?.initConfig ?? {};

  const [time, setTime] = useState(1);
  const [bpm, setBpm] = useState(_bpm ?? 105);
  const [selectedBpm, setSelectedBpm] = useState(_bpm ?? 105);
  const [packIndex, setPackIndex] = useState(_packIndex || 0);
  const [start, setStart] = useState(_start ?? false);
  const [mode, setMode] = useState(_mode ?? "");
  const [isRecording, setIsRecording] = useState(false);
  const [effects, setEffects] = useState({});
  const [recordTimeline, setRecordTimeline] = useState(null);
  const [recording, setRecording] = useState({
    pack: null,
    bpm: null,
    notes: [],
  });
  const [triggerNote, setTriggerNote] = useState({});
  const [loading, setLoading] = useState(false);
  const modalizeRef = useRef(null);

  const { entry, type, roomId, isHost, isNewCreate } = route.params;

  const {
    user: { user },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: entry,
      headerBackTitle: "",
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          {type === "live" && isHost && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleLeaveLive}
              style={{ ...styles.button, paddingLeft: 20 }}
            >
              <Ionicons name="exit-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
          {(type !== "live" || isHost) && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={handleModal}
              style={{ ...styles.button, paddingLeft: 20 }}
            >
              <Ionicons name="ellipsis-horizontal" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
      ),
    });
  }, [navigation, packIndex]);

  useInterval(() => {
    if (start) {
      if (time == 16) {
        setTime(1);
        return;
      }
      setTime(time + 1);
    }
  }, (60 / bpm) * 1000);

  useEffect(() => {
    modalizeRef.current?.close();
  }, [packIndex]);

  useEffect(() => {
    if (isRecording) {
      setStart(true);
      setRecording({ ...recording, bpm: bpm, pack: PACKS[packIndex].name });
      setRecordTimeline(+new Date());
    } else {
      // -> save recording
      if (recording.notes.length > 0) {
        setLoading(true);
        const timer = setTimeout(() => {
          setLoading(false);
          console.log(recording);
          console.log(recording.notes.slice(-1));
          let duration = Math.ceil(
            recording.notes.slice(-1)[0].timestamp / 1000
          );
          Alert.alert("Save Recording?", `Record time: ${duration}s`, [
            {
              text: "Discard",
              onPress: () => {},
              style: "destructive",
            },
            {
              text: "Save",
              onPress: async () => {
                db.collection("users")
                  .doc(user.uid)
                  .collection("recordings")
                  .add({
                    ...recording,
                    createTime: firebase.firestore.FieldValue.serverTimestamp(),
                    duration: recording.notes.slice(-1)[0].timestamp,
                  })
                  .then((res) => alert("Save Success!"));
              },
            },
          ]);
          clearTimeout(timer);
        }, 1000);
      }

      setRecording({
        pack: null,
        bpm: null,
        notes: [],
      });
    }
  }, [isRecording]);

  useEffect(() => {
    setTime(1);
  }, [start]);

  const emitLiveEvent = async ({ packIndex, bpm, start, mode, live }) => {
    if (type === "live") {
      const musicInfo = {
        packIndex,
        bpm,
        start,
        mode,
      };
      DeviceEventEmitter.emit("event.directUpdate", true, musicInfo);
      socket.emit("update-music-room", roomId, true, musicInfo);
      await updateMusicRoomById({
        roomId,
        musicInfo,
      });
    }
  };

  // handle live mode socket
  useEffect(() => {
    (async () => {
      const musicInfo = {
        packIndex,
        bpm,
        start,
        mode,
      };

      if (type === "live" && isNewCreate) {
        socket.emit("update-music-room", roomId, true, musicInfo);
        await openMusicRoomById({ roomId });
        emitLiveEvent(musicInfo);
      }
    })();
  }, [type]);

  useEffect(() => {
    setTimeout(() => {
      socket.on("receive-music-room", ({ musicMode, musicInfo }) => {
        console.log(456);
        if (!musicMode) {
          Alert.alert(
            "创作模式已关闭",
            "请等待聊天室管理员开启",
            [
              {
                text: "返回",
                onPress: async () => {
                  setLoading(true);
                  let timer = setTimeout(() => {
                    setLoading(false);
                    navigation.goBack();
                    clearTimeout(timer);
                  }, 500);
                },
              },
            ],
            { cancelable: false }
          );
        }
        if (musicMode && musicInfo) {
          setStart(musicInfo?.start);
          setMode(musicInfo?.mode);
          setPackIndex(musicInfo?.packIndex);
          setBpm(musicInfo?.bpm);
        }
      });
    });

    // socket.on("receive-music-note", ({ row, col, active }) => {
    //   console.log({
    //     row,
    //     col,
    //     active,
    //   });
    //   // setTriggerNote({
    //   //   row,
    //   //   col,
    //   //   active,
    //   // });
    // });

    return () => {
      DeviceEventEmitter.removeAllListeners("event.directUpdate");
      socket.off("receive-music-room");
      socket.off("receive-music-note");
    };
  }, [type]);

  const handleModal = () => {
    modalizeRef.current?.open();
  };

  const handleModalClose = async () => {
    setBpm(selectedBpm);

    const musicInfo = {
      packIndex,
      bpm: selectedBpm,
      start,
      mode,
    };
    DeviceEventEmitter.emit("event.directUpdate", true, musicInfo);
    socket.emit("update-music-room", roomId, true, musicInfo);
    await updateMusicRoomById({
      roomId,
      musicInfo,
    });
    // if (isHost === user.uid) {
    //   emitLiveEvent({
    //     packIndex,
    //     bpm: selectedBpm,
    //     start,
    //     mode: mode,
    //     live: true,
    //   });
    // }
  };

  const handleRecord = ({ row, col, active }) => {
    // took timeline & location -> push to the recording.notes
    // console.log(row, col, active);
    setRecording({
      ...recording,
      notes: [
        ...recording.notes,
        {
          row,
          col,
          timestamp: +new Date() - recordTimeline,
          active,
        },
      ],
    });
  };

  const handleLeaveLive = () => {
    Alert.alert("关闭实时创作模式", "聊天室成员将无法使用创作模式", [
      {
        text: "取消",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "关闭",
        onPress: async () => {
          setLoading(true);
          await closeMusicRoomById({ roomId });
          DeviceEventEmitter.emit("event.directUpdate", false, {});
          socket.emit("update-music-room", roomId, false);
          let timer = setTimeout(() => {
            setLoading(false);
            navigation.goBack();
            clearTimeout(timer);
          }, 500);
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <MusicContext.Provider
      value={{
        handleRecord,
        isRecording,
        time,
        roomId,
        bpm,
        packIndex,
        status: start ? "play" : "stop",
        playType: type,
        // triggerNote,
      }}
    >
      <Modalize
        ref={modalizeRef}
        modalHeight={580}
        modalStyle={{ backgroundColor: "#202020" }}
        handleStyle={{ backgroundColor: "#888888" }}
        onClose={handleModalClose}
      >
        <MuiscOption
          bpm={bpm}
          // setBpm={setBpm}
          setSelectedBpm={setSelectedBpm}
          packIndex={packIndex}
          setPackIndex={setPackIndex}
        />
      </Modalize>

      <View style={{ backgroundColor: "#111111" }}>
        <Loading show={loading} />
        <View style={styles.container}>
          <View style={styles.infobox}>
            <Text style={styles.info}>
              {i18n.t("music.info.pack")}: {PACKS[packIndex].name}
            </Text>
            <Text style={styles.info}>
              {i18n.t("music.info.speed")}: {bpm}
            </Text>
            <Text style={styles.info}>
              {i18n.t("music.info.beats")}: {((time - 1) % 4) + 1}
            </Text>
          </View>
          {typeof PACKS[packIndex].padLists != "undefined" &&
            PACKS[packIndex]?.padLists.map((value, index) => (
              <PadList
                key={index}
                row={index + 1}
                type={value.type}
                padItems={value.padItems}
                // status={start ? "play" : "stop"}
                // bpm={bpm}
              />
            ))}
          {type !== ("preset" || "record") && (
            <MusicActionBar
              setStart={setStart}
              start={start}
              setMode={setMode}
              mode={mode}
              setIsRecording={setIsRecording}
              isRecording={isRecording}
              setEffects={setEffects}
              effects={effects}
              setTime={setTime}
              emitLiveEvent={emitLiveEvent}
            />
          )}
        </View>
      </View>
    </MusicContext.Provider>
  );
};

export default MusicScreen;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#202020",
    paddingTop: 15,
  },
  infobox: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  info: { fontSize: 15, fontWeight: "500", color: "white", minWidth: 50 },
});
