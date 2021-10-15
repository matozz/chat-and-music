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
import { Ionicons } from "@expo/vector-icons";
import ContactsList from "../components/ContactsList";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { db } from "../firebase";
import AppContext from "../context/AppContext";
import Loading from "../components/Loading";

const IdeaScreen = ({ navigation }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [myIdeas, setMyIdeas] = useState([]);
  const [pulbicIdeas, setPublicIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef();

  const {
    user: { user },
  } = useContext(AppContext);

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

  useEffect(() => {
    const unsubscribe = db
      .collection("users")
      .doc(user.uid)
      .collection("recordings")
      .orderBy("createTime", "asc")
      .onSnapshot((snapshot) => {
        setMyIdeas(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });

    return unsubscribe;
  }, [user.uid]);

  const handleControlChange = (e) => {
    let index = e.nativeEvent.selectedSegmentIndex;
    setSelectedIndex(index);
    if (index === 0) {
      scrollRef.current.scrollTo({ x: 0, y: 0 });
    } else {
      scrollRef.current.scrollToEnd();
    }
  };

  const delRecording = (docId) => {
    setLoading(true);
    db.collection("users")
      .doc(user.uid)
      .collection("recordings")
      .doc(docId)
      .delete()
      .then(() => {
        setLoading(false);
        alert("删除成功");
      })
      .catch((err) => {
        console.log(err);
        setLoading(true);
      });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ height: "100%" }}>
        <Loading show={loading} />
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
          <ContactsList data={{}} type={"publicIdea"} />
          <ContactsList
            data={myIdeas}
            type={"myIdea"}
            delRecording={delRecording}
          />
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
