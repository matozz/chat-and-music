import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import Loading from "../components/Loading";
import AppContext from "../context/AppContext";
import { auth, db, firebase } from "../firebase";
import SocketContext from "../context/SocketContext";
import Color from "../utils/Color";
import { LinearGradient } from "expo-linear-gradient";
import home from "../assets/img/home.jpg";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    user: { user, setUser },
  } = useContext(AppContext);

  const socket = useContext(SocketContext);

  const handleLogin = () => {
    setLoading(true);

    auth
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(async () => {
        const { user } = await auth.signInWithEmailAndPassword(email, password);

        db.collection("users").doc(user.uid).set({
          createTime: firebase.firestore.FieldValue.serverTimestamp(),
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });

        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        socket.emit("go-online", {
          userinfo: {
            name: 123,
            id: 1,
          },
        });
        navigation.popToTop();
      })
      .catch((err) => {
        alert(err.message);
        setLoading(false);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  useEffect(() => {
    Image.resolveAssetSource(home);
  }, []);

  return (
    <View style={styles.container}>
      <Loading show={loading} />
      <Image source={home} style={styles.bg} />
      <LinearGradient
        // Background Linear Gradient
        colors={["transparent", "rgba(28,28,28,1)"]}
        locations={[0, 0.6]}
        style={styles.mask}
      />
      <SafeAreaView style={styles.content}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "flex-end",
              marginBottom: 20,
            }}
          >
            <Text style={styles.title}>开始全新音乐创作旅程</Text>
            <View style={styles.inputBox}>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setEmail(text)}
                  value={email}
                  placeholderTextColor={"#858585"}
                  placeholder="请输入邮箱"
                  keyboardAppearance="dark"
                  keyboardType="email-address"
                  returnKeyType="done"
                />
              </View>
              <View style={styles.inputDivider}></View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setPassword(text)}
                  value={password}
                  placeholderTextColor={"#858585"}
                  placeholder="请输入密码"
                  secureTextEntry
                  keyboardAppearance="dark"
                  returnKeyType="done"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={handleLogin}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonText}>登录</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.outline]}
              onPress={() => navigation.navigate("Register")}
              activeOpacity={0.5}
            >
              <Text style={styles.buttonText}>创建新账号</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
    height: "100%",
  },
  bg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    resizeMode: "cover",
  },
  mask: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    // backgroundColor: "red",
  },
  content: {
    marginHorizontal: 20,
    paddingTop: 30,
    position: "absolute",
    top: 0,
    bottom: 60,
    left: 0,
    right: 0,
  },
  title: {
    fontSize: 36,
    color: "white",
    fontWeight: "500",
    paddingHorizontal: 60,
    textAlign: "center",
    marginBottom: 30,
  },
  inputBox: { backgroundColor: "#303030", borderRadius: 10 },
  inputContainer: {
    flexDirection: "row",
    padding: 14,
    alignItems: "flex-end",
  },
  input: {
    marginLeft: 4,
    fontWeight: "600",
    color: "white",
    fontSize: 17,
    width: 255,
  },
  inputDivider: {
    height: 1,
    width: "95%",
    backgroundColor: "#444444",
    marginLeft: "auto",
  },
  button: {
    marginTop: 20,
    padding: 12,
    borderRadius: 10,
    backgroundColor: Color.SystemBlue,
  },
  outline: {
    backgroundColor: Color.SystemGray4,
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "500",
    textAlign: "center",
  },
});
