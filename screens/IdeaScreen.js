import React, { useLayoutEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContactsList from "../components/ContactsList";

const IdeaScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "我的灵感",
      headerBackTitle: "",
      headerRight: () => (
        <TouchableOpacity
          style={{ ...styles.button, paddingLeft: 20 }}
          onPress={() => navigation.navigate("Upload")}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ height: "100%" }}>
        <ContactsList />
      </SafeAreaView>
    </View>
  );
};

export default IdeaScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    padding: 15,
    paddingTop: 0,
  },
});
