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

const MusicScreen = ({ navigation, route }) => {
  const [time, setTime] = useState(1);
  const [bpm, setBpm] = useState(105);
  const [selectedBpm, setSelectedBpm] = useState(105);
  const [packIndex, setPackIndex] = useState(route.params.packIndex || 0);
  const [start, setStart] = useState(false);
  const [mode, setMode] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [effects, setEffects] = useState({});
  const [recordTimeline, setRecordTimeline] = useState(null);
  const [recording, setRecording] = useState({
    pack: null,
    bpm: null,
    notes: [],
  });
  const [loading, setLoading] = useState(false);
  const modalizeRef = useRef(null);

  const { entry, type, roomId } = route.params;

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
          {type === "live" && (
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                emitLiveEvent(false);
                navigation.goBack();
              }}
              style={{ ...styles.button, paddingLeft: 20 }}
            >
              <Ionicons name="exit-outline" size={24} color="white" />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={handleModal}
            style={{ ...styles.button, paddingLeft: 20 }}
          >
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
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

  // handle live mode socket
  useEffect(() => {
    emitLiveEvent(true);
  }, [packIndex, start, mode, bpm]);

  const emitLiveEvent = (status) => {
    if (type === "live") {
      socket.emit(
        "send-music-room",
        {
          pack: PACKS[packIndex].name,
          bpm: bpm,
          isPlaying: start,
          mode: mode,
          isOpen: status,
        },
        roomId
      );
    }
  };

  const handleModal = () => {
    modalizeRef.current?.open();
  };

  const handleModalClose = () => {
    setBpm(selectedBpm);
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

  return (
    <MusicContext.Provider
      value={{
        handleRecord: handleRecord,
        isRecording: isRecording,
        time: time,
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
          setSelectedBpm={setSelectedBpm}
          packIndex={packIndex}
          setPackIndex={setPackIndex}
        />
      </Modalize>

      <View style={{ backgroundColor: "#111111" }}>
        {Platform.OS === "ios" && <Loading show={loading} />}
        <View style={styles.container}>
          <View style={styles.infobox}>
            <Text style={styles.info}>当前素材包: {PACKS[packIndex].name}</Text>
            <Text style={styles.info}>速度: {bpm}</Text>
            <Text style={styles.info}>节拍: {((time - 1) % 4) + 1}</Text>
          </View>
          {typeof PACKS[packIndex].padLists != "undefined" &&
            PACKS[packIndex]?.padLists.map((value, index) => (
              <PadList
                key={index}
                row={index + 1}
                type={value.type}
                padItems={value.padItems}
                status={start ? "play" : "stop"}
                bpm={bpm}
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
