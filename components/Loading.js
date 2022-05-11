import React from "react";
import { StyleSheet, View, ActivityIndicator, Platform } from "react-native";
import Color from "../utils/Color";

const Loading = ({ show, block }) => {
  if (!show) return null;
  if (block) {
    return (
      <View style={{ display: show ? "flex" : "none" }}>
        <ActivityIndicator
          color="#fff"
          size={Platform.OS === "android" ? "large" : "small"}
        />
      </View>
    );
  }
  return (
    <View style={{ ...styles.wrapper, display: show ? "flex" : "none" }}>
      <View style={styles.container}>
        <ActivityIndicator
          color="#fff"
          size={Platform.OS === "android" ? "large" : "small"}
        />
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    width: 80,
    height: 80,
    backgroundColor: Color.SystemGray4Alpha,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
});
