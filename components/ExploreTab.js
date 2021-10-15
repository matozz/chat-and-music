import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import AppContext from "../context/AppContext";
import { socket } from "../sockets";
import Color from "../utils/Color";

const ExploreTab = () => {
  const [connection, setConnection] = useState(false);
  const [usersNum, setUsersNum] = useState(0);

  const {
    user: { user },
  } = useContext(AppContext);

  useEffect(() => {
    if (user.uid !== null || undefined) {
      console.log(user);
      socket.emit("go-online", {
        userinfo: user,
      });

      socket.on("online-user", (users) => {
        setConnection(true);
        // console.log("Active Users", users);
        setUsersNum(users);
      });
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.online}>
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
      </View>
    </View>
  );
};

export default ExploreTab;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    paddingLeft: 15,
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
});
