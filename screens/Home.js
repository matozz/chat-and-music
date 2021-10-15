import { StatusBar } from "expo-status-bar";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
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
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import ExploreTab from "../components/ExploreTab";
import AppContext from "../context/AppContext";

const Home = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef();

  const {
    user: { user, setUser },
  } = useContext(AppContext);

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

  // useEffect(() => {
  //   if (user) {
  //     navigation.replace("Login");
  //   }
  // }, [user]);

  // const handleModeScroll = (e) => {
  //   let posX = e.nativeEvent.contentOffset.x;
  //   console.log(posX);
  //   if (posX > 300) {
  //     setSelectedIndex(1);
  //   } else if (posX < 75) {
  //     setSelectedIndex(0);
  //   }
  // };

  const handleControlChange = (e) => {
    let index = e.nativeEvent.selectedSegmentIndex;
    setSelectedIndex(index);
    if (index === 0) {
      scrollRef.current.scrollTo({ x: 0, y: 0 });
    } else {
      scrollRef.current.scrollToEnd();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" animated />

      <SafeAreaView style={{ height: "100%" }}>
        <View style={styles.tools}>
          {/* Header */}
          {/* <Header /> */}

          {/* SearchBar */}
          <SearchBar />

          {/* Menu Buttons*/}
          <MenuButtons navigation={navigation} />

          <View style={styles.controlbar}>
            <SegmentedControl
              values={["探索", "聊天室"]}
              selectedIndex={selectedIndex}
              appearance={"dark"}
              onChange={handleControlChange}
            />
          </View>
        </View>
        {/* Contacts List*/}
        <View style={{ ...styles.contentbox }}>
          <ScrollView
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
          </ScrollView>
        </View>
      </SafeAreaView>
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
