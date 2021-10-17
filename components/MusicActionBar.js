import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Color from "../utils/Color";

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
}) => {
  const handleModeChange = (v) => {
    if (!mode || mode !== v) {
      setMode(v);
    } else {
      setMode("");
    }
  };

  const handleStartStop = () => {
    if (start) {
      setStart(false);
      setTime(1);
    } else {
      setStart(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="barcode-outline" size={26} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => setIsRecording(!isRecording)}
      >
        <Ionicons
          name="radio-button-on"
          size={26}
          color={isRecording ? Color.SystemRed : "white"}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={handleStartStop}>
        {start ? (
          <Ionicons name="stop" size={26} color={Color.SystemRed} />
        ) : (
          <Ionicons name="play" size={26} color="white" />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.icon}
        onPress={() => handleModeChange("bed")}
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
    paddingTop: 20,
    paddingBottom: 6,
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
