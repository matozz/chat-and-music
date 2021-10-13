import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MusicActionBar = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="barcode-outline" size={26} color="white" />
        {/* <Text style={styles.label}>播放</Text> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="radio-button-on" size={26} color="white" />
        {/* <Text style={styles.label}>录制</Text> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="play" size={26} color="white" />
        {/* <Text style={styles.label}>播放</Text> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="bed" size={26} color="white" />
        {/* <Text style={styles.label}>播放</Text> */}
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Ionicons name="beer" size={26} color="white" />
        {/* <Text style={styles.label}>播放</Text> */}
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
    // justifyContent: "space-between",
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
