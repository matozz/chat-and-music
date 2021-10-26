import React, { useContext } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Color from "../utils/Color";
import MusicContext from "../context/MusicContext";

const MusicActionBar = ({
  start,
  setStart,
  mode,
  setMode,
  isRecording,
  setIsRecording,
  effect,
  setEffects,
  setTime,
  emitLiveEvent,
}) => {
  const { packIndex, bpm } = useContext(MusicContext);

  const handleModeChange = (v) => {
    if (!mode || mode !== v) {
      setMode(v);
      emitLiveEvent({ packIndex, bpm, start, mode: v, live: true });
    } else {
      setMode("");
      emitLiveEvent({ packIndex, bpm, start, mode: "", live: true });
    }
  };

  const handleStartStop = () => {
    setStart(!start);
    emitLiveEvent({ packIndex, bpm, start: !start, mode, live: true });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.icon} activeOpacity={0.4}>
        <Ionicons name="barcode-outline" size={26} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => setIsRecording(!isRecording)}
        activeOpacity={0.4}
      >
        <Ionicons
          name="radio-button-on"
          size={26}
          color={isRecording ? Color.SystemRed : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon}
        onPress={handleStartStop}
        activeOpacity={0.4}
      >
        {start ? (
          <Ionicons name="stop" size={26} color={Color.SystemRed} />
        ) : (
          <Ionicons name="play" size={26} color="white" />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => handleModeChange("bed")}
        activeOpacity={0.4}
      >
        <Ionicons
          name="bed"
          size={26}
          color={mode === "bed" ? Color.SystemOrange : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => handleModeChange("beer")}
        activeOpacity={0.4}
      >
        <Ionicons
          name="beer"
          size={26}
          color={mode === "beer" ? Color.SystemIndigo : "white"}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MusicActionBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    bottom: 0,
    left: 0,
    right: 0,
  },
  icon: {
    paddingTop: 15,
    paddingBottom: Platform.OS === "ios" ? 6 : 15,
    flex: 1,
    alignItems: "center",
  },
  label: {
    color: "white",
    marginTop: 4,
    fontWeight: "500",
    fontSize: 13,
  },
});
