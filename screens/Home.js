import { StatusBar } from "expo-status-bar";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import i18n from "i18n-js";
// import ContactsList from "../components/ContactsList";
// import Header from "../components/Header";
import MenuButtons from "../components/MenuButtons";
import SearchBar from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import SocketContext from "../context/SocketContext";
// import SegmentedControl from "@react-native-segmented-control/segmented-control";
import ExploreTab from "../components/ExploreTab";
import AppContext from "../context/AppContext";
import Color from "../utils/Color";
// import { showMessage } from "react-native-flash-message";

const CONNECTION_STATE = (handler) => ({
  connecting: {
    msg: `${handler} 服务连接中...`,
    icon: "cloud-outline",
    color: Color.SystemOrange,
  },
  connected: {
    msg: `${handler} 服务连接成功`,
    icon: "cloud-done-outline",
    color: Color.SystemGreen,
  },
  failed: {
    msg: `${handler} 服务连接失败`,
    icon: "cloud-offline-outline",
    color: Color.SystemRed,
  },
});

const Home = ({ navigation }) => {
  const {
    user: { loginState, user },
    connectionState: { socketState, firebaseState, connectionId },
  } = useContext(AppContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <>
          <TouchableOpacity
            style={{ ...styles.button, paddingRight: 20 }}
            onPress={() => navigation.navigate("Notification")}
            activeOpacity={0.5}
          >
            <Ionicons
              name="ios-notifications-outline"
              size={24}
              color="#efefef"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ ...styles.button, paddingRight: 20 }}
            onPress={connectSocket}
            activeOpacity={0.5}
          >
            <Ionicons
              name={CONNECTION_STATE("socket")[socketState].icon}
              size={24}
              color={CONNECTION_STATE("socket")[socketState].color}
            />
          </TouchableOpacity>
        </>
      ),
      headerRight: () => (
        <TouchableOpacity
          style={{ ...styles.button, paddingLeft: 20 }}
          onPress={() => navigation.navigate("Setting")}
          activeOpacity={0.5}
        >
          <Ionicons name="ios-person-outline" size={24} color="#efefef" />
        </TouchableOpacity>
      ),
      headerTitle: i18n.t("home.title"),
      headerTitleAlign: "center",
    });
  });

  const connectSocket = () => {
    let connection = {
      socketState,
      connectionId,
      firebaseState,
    };

    alert(JSON.stringify(connection));
  };

  useEffect(() => {
    if (loginState !== null && loginState === "LOGOUT") {
      const timer = setTimeout(() => {
        Alert.alert("Please Login", "login to access all the services", [
          {
            text: "Cancel",
            onPress: () => {},
            style: "cancel",
          },
          {
            text: "Login",
            onPress: async () => {
              navigation.navigate("Login");
            },
          },
        ]);
        clearTimeout(timer);
      }, 1000);
    }
  }, [loginState]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />
      <ScrollView>
        <View style={styles.tools}>
          <SearchBar />
          <MenuButtons navigation={navigation} />
        </View>
        <View style={{ ...styles.contentbox }}>
          <ExploreTab navigation={navigation} />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
  },
  tools: {
    padding: 15,
    paddingBottom: 0,
  },
  controlbar: {
    marginVertical: 10,
  },
  contentbox: {
    flexDirection: "column",
  },
});
