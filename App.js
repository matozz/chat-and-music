import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppContext from "./context/AppContext";
import Navigation from "./Navigation";
import * as ScreenOrientation from "expo-screen-orientation";

export default function App() {
  const [user, setUser] = useState("");

  const userInfo = {
    user: user,
    setUser: setUser,
  };

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
