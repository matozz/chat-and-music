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
import ContactsList from "../components/ContactsList";
// import Header from "../components/Header";
import MenuButtons from "../components/MenuButtons";
import SearchBar from "../components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { socket } from "../sockets";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import ExploreTab from "../components/ExploreTab";
import AppContext from "../context/AppContext";
import Color from "../utils/Color";
import { showMessage } from "react-native-flash-message";

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
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [socketState, setSocketState] = useState("connecting");
  const [databaseState, setDatabaseState] = useState("connecting");
  const scrollRef = useRef();

  const {
    user: { loginState, user },
  } = useContext(AppContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <>
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
          <TouchableOpacity
            style={{ ...styles.button, paddingRight: 20 }}
            onPress={connectSocket}
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
        >
          <Ionicons name="ios-person-outline" size={24} color="#efefef" />
        </TouchableOpacity>
      ),
      headerTitle: "Music & Chat",
    });
  });

  useEffect(() => {
    connectSocket();
  }, [user.uid]);

  const connectSocket = () => {
    console.log(user);
    if (Object.keys(user).length > 0) {
      // console.log(user);
      socket.emit("go-online", {
        userinfo: user,
      });
      socket.on("online-user", (users) => {
        setSocketState("connected");
        // setUsersNum(users);
        showMessage({
          message: "Socket 服务连接成功",
          type: "info",
          icon: "success",
          style: {
            backgroundColor: Color.SystemGreen,
          },
        });
      });
    } else {
      setSocketState("connecting");
      // showMessage({
      //   message: "Socket 服务连接失败，请检查是否登录",
      //   type: "info",
      //   icon: "warning",
      //   style: {
      //     backgroundColor: Color.SystemRed,
      //   },
      // });
      showMessage({
        message: "Socket 服务连接中...",
        type: "info",
        icon: "info",
        style: {
          backgroundColor: Color.SystemOrange,
        },
      });
    }
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

  // const handleControlChange = (e) => {
  //   let index = e.nativeEvent.selectedSegmentIndex;
  //   setSelectedIndex(index);
  //   if (index === 0) {
  //     scrollRef.current.scrollTo({ x: 0, y: 0 });
  //   } else {
  //     scrollRef.current.scrollToEnd();
  //   }
  // };

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />

      {/* <SafeAreaView style={{ height: "100%" }}> */}
      <ScrollView>
        <View style={styles.tools}>
          <SearchBar />

          <MenuButtons navigation={navigation} />

          {/* <View style={styles.controlbar}>
            <SegmentedControl
              values={["探索", "聊天室"]}
              selectedIndex={selectedIndex}
              appearance={"dark"}
              onChange={handleControlChange}
            />
          </View> */}
        </View>
        <View style={{ ...styles.contentbox }}>
          <ExploreTab />
          {/* <ScrollView
            horizontal
            decelerationRate={0}
            snapToInterval={375} //your element width
            snapToAlignment={"center"}
            // onScroll={handleModeScroll}
            scrollEnabled={false}
            scrollEventThrottle={200}
            ref={scrollRef}
          >
            <ExploreTab />
            <ContactsList data={{}} type={"myChat"} />
          </ScrollView> */}
        </View>
      </ScrollView>
      {/* </SafeAreaView> */}
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
