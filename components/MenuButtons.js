import React, { useContext } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import Color from "../utils/Color";
import AppContext from "../context/AppContext";

const BUTTONS = [
  {
    icon: (
      <MaterialCommunityIcons name="account-music" size={28} color="white" />
    ),
    color: Color.SystemOrange,
    label: "创建房间",
    nav: "CreateChat",
  },
  {
    icon: <MaterialIcons name="add-box" size={28} color="white" />,
    color: Color.SystemBlue,
    label: "加入房间",
    nav: "JoinChat",
  },
  {
    icon: (
      <MaterialCommunityIcons name="folder-music" size={28} color="white" />
    ),
    color: Color.SystemBlue,
    label: "灵感",
    nav: "Idea",
  },
  {
    icon: <MaterialCommunityIcons name="music-box" size={28} color="white" />,
    color: Color.SystemBlue,
    label: "自由创作",
    nav: "Music",
  },
];

const MenuButtons = ({ navigation }) => {
  const {
    connectionState: { socketState, firebaseState },
  } = useContext(AppContext);

  const handleNavigation = (name) => {
    if (name === "Music") {
      navigation.navigate(name, {
        entry: "自由创作",
      });
    } else if (name === "Idea") {
      navigation.navigate(name);
    } else {
      if (socketState != "connected") {
        Alert.alert("操作失败", "请检查 Socket 连接状态");
      } else if (firebaseState != "connected") {
        Alert.alert("操作失败", "请检查登录状态");
      } else {
        navigation.navigate(name);
      }
    }
  };

  return (
    <View style={styles.container}>
      {BUTTONS.map((button) => (
        <TouchableOpacity
          activeOpacity={0.5}
          style={styles.buttonContainer}
          key={button.label}
          onPress={() => handleNavigation(button.nav)}
        >
          <View style={{ ...styles.icon, backgroundColor: button.color }}>
            {button.icon}
          </View>
          <Text style={styles.label}>{button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default MenuButtons;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingBottom: 10,
    borderBottomColor: "#1f1f1f",
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    backgroundColor: "red",
    borderRadius: 16,
  },
  label: {
    color: "#858585",
    fontSize: 12,
    paddingTop: 10,
    fontWeight: "500",
  },
});
