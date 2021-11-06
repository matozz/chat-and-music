import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import i18n from "i18n-js";

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
        placeholder={i18n.t("home.search")}
        keyboardAppearance="dark"
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
    alignItems: "center",
    borderRadius: 10,
  },
  text: {
    paddingLeft: 5,
    fontWeight: "500",
    color: "white",
    fontSize: 16,
    width: "auto",
    width: 300,
    paddingBottom: 1,
  },
});
