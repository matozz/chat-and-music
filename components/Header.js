import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Header = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={{ ...styles.button, paddingRight: 20 }}>
        <Ionicons name="ios-notifications-outline" size={24} color="#efefef" />
      </TouchableOpacity>

      <Text style={styles.heading}>Meet & Chat</Text>
      <TouchableOpacity style={{ ...styles.button, paddingLeft: 20 }}>
        <Ionicons name="ios-create-outline" size={24} color="#efefef" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heading: {
    color: "#efefef",
    fontSize: 17,
    fontWeight: "800",
  },
  button: {
    paddingVertical: 10,
  },
});
