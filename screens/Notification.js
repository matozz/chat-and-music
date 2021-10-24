import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Notification = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.lable}>Notifications</Text>
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
    paddingTop: 10,
    paddingHorizontal: 12,
  },
  lable: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
  },
});
