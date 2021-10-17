import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AppContext from "./context/AppContext";
import { auth } from "./firebase";
import Navigation from "./Navigation";
import { socket } from "./sockets";
import Color from "./utils/Color";

export default function App() {
  const [curUser, setCurUser] = useState(auth.currentUser);
  const [user, setUser] = useState({});
  const [loginState, setLoginState] = useState(null);
  const [socketState, setSocketState] = useState("connecting");
  const [restartSocket, setRestartSocket] = useState(false);
  const connectionRef = useRef();

  const userInfo = {
    user: user,
    setUser: setUser,
    loginState: loginState,
  };

  const connectionState = {
    socketState: socketState,
    setSocketState: setSocketState,
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
      // setSocketState("connected");
    });

    return () => {
      console.log("[STATUS]: disconnect from server");
      socket.disconnect();
    };
  }, [restartSocket]);

  useEffect(() => {
    connectionRef.current = socketState;
  }, [socketState]);

  useEffect(() => {
    if (socketState === "connecting") {
      const timer = setTimeout(() => {
        if (connectionRef.current === "connecting") {
          console.log(connectionRef.current);
          setSocketState("failed");
          showMessage({
            message: "Socket 服务连接失败，请检查网络和登录状态",
            type: "info",
            icon: "warning",
            style: {
              backgroundColor: Color.SystemRed,
            },
          });
        }
        clearTimeout(timer);
      }, 3000);
    }
  }, [socketState]);

  return (
    <AppContext.Provider
      value={{ user: userInfo, connectionState: connectionState }}
    >
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
