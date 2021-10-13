import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Color from "../utils/Color";

const Loading = ({ show }) => {
  return (
    <View style={{ ...styles.wrapper, display: show ? "flex" : "none" }}>
      <View style={styles.container}>
        <ActivityIndicator hidesWhenStopped animating={show} />
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
