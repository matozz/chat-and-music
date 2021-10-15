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
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PadList from "../components/PadList";
import { Modalize } from "react-native-modalize";
// import { Portal } from "react-native-portalize";
import MuiscOption from "../components/MuiscOption";
import MusicActionBar from "../components/MusicActionBar";
import MusicContext from "../context/MusicContext";
import { PACKS } from "../utils/MusicPacks";
import Loading from "../components/Loading";
import { db, firebase } from "../firebase";
import AppContext from "../context/AppContext";

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    let id = setInterval(() => {
      savedCallback.current();
    }, delay - 9);
    return () => clearInterval(id);
  }, [delay]);
}

const MusicScreen = ({ navigation, route }) => {
  const [time, setTime] = useState(1);
  const [bpm, setBpm] = useState(105);
  const [selectedBpm, setSelectedBpm] = useState(105);
  const [packIndex, setPackIndex] = useState(0);
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

  const { entry } = route.params;

  const {
    user: { user },
  } = useContext(AppContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: entry,
      headerBackTitle: "",
      // headerLeft: () => (
      //   <View
      //     style={{
      //       flexDirection: "row",
      //       justifyContent: "space-between",
      //       width: 70,
      //       marginLeft: 20,
      //     }}
      //   >
      //     <TouchableOpacity activeOpacity={0.5}>
      //       <Ionicons name="radio-button-on" size={24} color="white" />
      //     </TouchableOpacity>
      //     <TouchableOpacity
      //       activeOpacity={0.5}
      //       onPress={() => setStart(!start)}
      //     >
      //       {start ? (
      //         <Ionicons name="stop" size={24} color="white" />
      //       ) : (
      //         <Ionicons name="play" size={24} color="white" />
      //       )}
      //     </TouchableOpacity>
      //   </View>
      // ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity activeOpacity={0.5} onPress={handleModal}>
            <Ionicons name="ellipsis-horizontal" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, start]);

  useInterval(() => {
    if (start) {
      if (time == 16) {
        setTime(1);
        return;
      }

      setTime(time + 1);
    }
  }, (60 / bpm) * 1000);

  const handleModal = () => {
    modalizeRef.current?.open();
  };

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
          Alert.alert(
            "Save Recording?",
            `Record time: ${Math.floor(
              recording.notes.slice(-1)[0].timestamp / 1000
            )}s`,
            [
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
                    .collection("messages")
                    .add({
                      ...recording,
                      createTime:
                        firebase.firestore.FieldValue.serverTimestamp(),
                    })
                    .then((res) => alert("Save Success!"));
                },
              },
            ]
          );
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
        <Loading show={loading} />
        <View
          style={{
            height: "100%",
            backgroundColor: "#202020",
            paddingTop: 20,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "white",
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {`当前素材包: ${PACKS[packIndex].name}        速度: ${bpm}`}
          </Text>
          {typeof PACKS[packIndex].padLists != "undefined" &&
            PACKS[packIndex]?.padLists.map((value, index) => (
              <PadList
                key={index}
                row={index + 1}
                type={value.type}
                padItems={value.padItems}
                // time={time}
                status={start ? "play" : "stop"}
                bpm={bpm}
              />
            ))}
          <MusicActionBar
            setStart={setStart}
            start={start}
            setMode={setMode}
            mode={mode}
            setIsRecording={setIsRecording}
            isRecording={isRecording}
            setEffects={setEffects}
            effects={effects}
          />
        </View>
      </View>
    </MusicContext.Provider>
  );
};

export default MusicScreen;

const styles = StyleSheet.create({});
