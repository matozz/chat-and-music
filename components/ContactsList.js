import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

const contactMenuButtons = [
  {
    id: "0",
    type: "starred",
    name: "Starred",
  },
  {
    id: "1",
    type: "contact",
    name: "Jessy The",
    avatar:
      "https://i0.hdslb.com/bfs/face/d3b2fdf24068c992e28e04f7262ecfa6f6a3cc03.jpg@160w_160h_1c_1s.jpg",
  },
  {
    id: "2",
    type: "contact",
    name: "Jessy The",
    avatar:
      "https://i0.hdslb.com/bfs/face/d3b2fdf24068c992e28e04f7262ecfa6f6a3cc03.jpg@160w_160h_1c_1s.jpg",
  },
];

const ContactsList = () => {
  const [refreshing, setRefreshing] = useState(false);

  const renderRow = ({ item }) => (
    <TouchableOpacity style={styles.row}>
      {item.type === "starred" ? (
        <View style={styles.starredIcon}>
          <AntDesign name="star" size={22} color="#efefef" />
        </View>
      ) : (
        <View style={styles.starredIcon}>
          <Image source={{ uri: item.avatar }} style={styles.avatarIcon} />
        </View>
      )}

      <Text style={styles.text}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contactMenuButtons}
        renderItem={renderRow}
        keyExtractor={(item) => item.id}
        style={{ height: "100%" }}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => {
            setRefreshing(false);
          }, 2000);
        }}
      />
    </View>
  );
};

export default ContactsList;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    paddingLeft: 15,
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  starredIcon: {
    backgroundColor: "#333333",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  text: {
    color: "white",
    paddingLeft: 15,
    fontSize: 17,
  },
  avatarIcon: {
    width: 50,
    height: 50,
  },
});
