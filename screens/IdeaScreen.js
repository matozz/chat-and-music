import React, { useLayoutEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ContactsList from "../components/ContactsList";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

const IdeaScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const scrollRef = useRef();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "灵感",
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
      <SafeAreaView style={{ height: "100%" }}>
        <View style={styles.controlbar}>
          <SegmentedControl
            values={["热门", "我的灵感"]}
            selectedIndex={selectedIndex}
            appearance={"dark"}
            onChange={handleControlChange}
          />
        </View>
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
          <ContactsList />
          <ContactsList />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default IdeaScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    paddingTop: 0,
  },
  controlbar: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
});
