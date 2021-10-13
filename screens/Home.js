import { StatusBar } from "expo-status-bar";
import React, { useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ContactsList from "../components/ContactsList";
// import Header from "../components/Header";
import MenuButtons from "../components/MenuButtons";
import SearchBar from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";

const Home = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          style={{ ...styles.button, paddingRight: 20 }}
          onPress={() => navigation.navigate("Notification")}
        >
          <Ionicons
            name="ios-notifications-outline"
            size={24}
            color="#efefef"
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ ...styles.button, paddingLeft: 20 }}
          onPress={() => navigation.navigate("Setting")}
        >
          <Ionicons name="ios-person-outline" size={24} color="#efefef" />
        </TouchableOpacity>
      ),
      headerTitle: "Music & Chat",
    });
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />
      <SafeAreaView style={{ height: "100%" }}>
        {/* Header */}
        {/* <Header /> */}

        {/* SearchBar */}
        <SearchBar />

        {/* Menu Buttons*/}
        <MenuButtons navigation={navigation} />

        {/* Contacts List*/}
        <ContactsList />
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    padding: 15,
  },
});
