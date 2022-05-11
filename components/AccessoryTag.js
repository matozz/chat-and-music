import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const AccessoryTag = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "#555",
        marginRight: 10,
      }}
      onPress={onPress}
      activeOpacity={0.5}
    >
      <Ionicons name={icon} size={24} color="#ececec" />
      <Text style={{ color: "white", paddingLeft: 6 }}>{label}</Text>
    </TouchableOpacity>
  );
};

export default AccessoryTag;
