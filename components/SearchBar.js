import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchBar = () => {
  return (
    <View style={styles.container}>
      <Ionicons name="ios-search" size={20} color="#858585" />
      {/* <Text style={styles.text}>Search</Text> */}
      <TextInput
        style={styles.text}
        // onChangeText={onChangeNumber}
        // value={number}
        placeholderTextColor={"#858585"}
        placeholder="搜索"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    // marginTop: 10,
    backgroundColor: "#303030",
    flexDirection: "row",
    padding: 8,
    alignItems: "flex-end",
    borderRadius: 10,
  },
  text: {
    paddingLeft: 5,
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    width: "auto",
    width: 300,
  },
});
