import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import FlashMessage from "react-native-flash-message";
import AppContext from "./context/AppContext";
import { auth } from "./firebase";
import Navigation from "./Navigation";
import { socket } from "./sockets";

export default function App() {
  const [curUser, setCurUser] = useState(auth.currentUser);
  const [user, setUser] = useState({});
  const [loginState, setLoginState] = useState(null);
  const [restartSocket, setRestartSocket] = useState(false);

  const userInfo = {
    user: user,
    setUser: setUser,
    loginState: loginState,
  };

  // setInterval(() => {
  //   console.log(auth.currentUser);
  // }, 1000);

  useEffect(() => {
    // console.log(curUser);
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        setLoginState("LOGIN");
      } else {
        setLoginState("LOGOUT");
      }
    });
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("[STATUS]: connected");
    });

    return () => {
      console.log("[STATUS]: disconnect from server");
      socket.disconnect();
    };
  }, [restartSocket]);

  // useEffect(() => {
  //   async function changeScreenOrientation() {
  //     await ScreenOrientation.lockAsync(
  //       ScreenOrientation.OrientationLock.PORTRAIT
  //     );
  //   }
  //   changeScreenOrientation();
  // }, []);

  return (
    <AppContext.Provider value={{ user: userInfo }}>
      <Navigation />
      <FlashMessage
        position="bottom"
        titleStyle={{
          fontWeight: "500",
        }}
      />
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({});
