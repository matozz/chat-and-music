import React, { useContext, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AppContext from "../context/AppContext";
import { socket } from "../sockets";
import Color from "../utils/Color";

const data = [
  {
    id: "0",
    title: "Horizons",
    genre: "Electronica",
    source: require("../assets/img/TCS.jpg"),
  },
  {
    id: "1",
    title: "Jay Chou",
    genre: "Pop",
    source: require("../assets/img/TCS.jpg"),
  },
  {
    id: "2",
    title: "Neo Soul",
    genre: "Trap",
    source: require("../assets/img/TCS.jpg"),
  },
];

const data1 = [
  {
    id: "0",
    title: "The ChainSmokers",
    source: require("../assets/img/TCS.jpg"),
    color: "#6d1ca6",
  },
  {
    id: "1",
    title: "The ChainSmokers",
    source: require("../assets/img/TCS.jpg"),
    color: "#9b2542",
  },
  {
    id: "2",
    title: "The ChainSmokers",
    source: require("../assets/img/TCS.jpg"),
    color: "#aa7e14",
  },
  {
    id: "3",
    title: "The ChainSmokers",
    source: require("../assets/img/TCS.jpg"),
    color: "#102ba7",
  },
];

const ExploreTab = () => {
  const [connection, setConnection] = useState(false);
  const [usersNum, setUsersNum] = useState(0);

  // const {
  //   user: { user },
  // } = useContext(AppContext);

  // useEffect(() => {
  //   if (Object.keys(user).length > 0) {
  //     console.log(user);
  //     socket.emit("go-online", {
  //       userinfo: user,
  //     });

  //     socket.on("online-user", (users) => {
  //       setConnection(true);
  //       setUsersNum(users);
  //     });
  //   }
  // }, [user]);

  const renderPackItem = ({ item: { source, title, genre }, index }) => (
    <TouchableOpacity
      style={{ ...styles.pack, marginLeft: index === 0 ? 10 : 0 }}
      activeOpacity={0.5}
    >
      <Image source={source} style={styles.cover} />
      <Text style={styles.packTitle}>{title}</Text>
      <Text style={styles.packGenre}>{genre}</Text>
    </TouchableOpacity>
  );

  const renderPresetRow = ({ id, source, color }) => (
    <TouchableOpacity
      key={id}
      style={{ ...styles.preset, backgroundColor: color }}
      activeOpacity={0.5}
    >
      {/* <Image source={source} style={styles.cover} /> */}
      <View>
        <Text style={styles.presetTitle}>Alternative</Text>
        <Text style={styles.presetPack}>- The ChainSmokers</Text>
      </View>
      {/* <View style={styles.presetCover}> */}
      <View
        style={[
          {
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.4,
            shadowRadius: 2,
            elevation: 10,
          },
        ]}
      >
        <Image source={source} style={styles.presetCover} />
      </View>
      {/* </View> */}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* <View style={styles.online}>
        <View
          style={{
            ...styles.dot,
            backgroundColor: connection
              ? Color.SystemGreen
              : Color.SystemOrange,
          }}
        ></View>
        <Text style={styles.label}>
          {connection ? `当前在线人数: ${usersNum}` : "Socket 服务连接中..."}
        </Text>
      </View> */}
      <View style={styles.section}>
        <Text style={styles.title}>最新素材包</Text>
        <FlatList
          data={data}
          horizontal
          renderItem={renderPackItem}
          keyExtractor={(item) => item.id}
          style={styles.packList}
        />
      </View>
      <View style={{ ...styles.section, marginTop: 0 }}>
        <Text style={styles.title}>热门预制</Text>
        <View style={styles.presetList}>{data1.map(renderPresetRow)}</View>
      </View>
    </View>
  );
};

export default ExploreTab;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    // paddingLeft: 15,
  },
  online: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
    marginHorizontal: 8,
  },
  label: {
    color: "white",
    fontWeight: "500",
  },
  section: {
    marginTop: 15,
    marginHorizontal: 4,
  },
  packList: {
    paddingVertical: 20,
  },
  packTitle: {
    color: Color.SystemWhite,
    width: 120,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 8,
  },
  packGenre: {
    color: Color.SystemGray1,
    width: 120,
    textAlign: "center",
    fontSize: 13,
    marginTop: 2,
  },
  pack: {
    marginRight: 15,
    paddingLeft: 5,
  },
  title: {
    fontSize: 15,
    marginLeft: 15,
    color: Color.SystemWhite,
    fontWeight: "bold",
  },
  cover: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  presetList: {
    marginHorizontal: 15,
    paddingVertical: 20,
  },
  preset: {
    height: 75,
    width: "100%",
    backgroundColor: Color.SystemWhite,
    marginBottom: 15,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  presetTitle: {
    color: Color.SystemWhite,
    fontWeight: "700",
  },
  presetPack: {
    color: Color.SystemWhite,
    paddingTop: 2,
  },
  presetCover: {
    width: 45,
    height: 45,
  },
});
