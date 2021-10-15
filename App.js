import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppContext from "./context/AppContext";
import { auth } from "./firebase";
import Navigation from "./Navigation";
import { socket } from "./sockets";

export default function App() {
  const [user, setUser] = useState({});
  const [restartSocket, setRestartSocket] = useState(false);

  const userInfo = {
    user: user,
    setUser: setUser,
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      });
    }
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
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({});
