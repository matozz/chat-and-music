import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import AppContext from "./context/AppContext";
import { auth } from "./firebase";
import Navigation from "./Navigation";
import SocketContext, { socket } from "./context/SocketContext";
import Color from "./utils/Color";

export default function App() {
  // const [curUser, setCurUser] = useState(auth.currentUser);
  const [user, setUser] = useState({});
  const [loginState, setLoginState] = useState(null);
  const [socketState, setSocketState] = useState("connecting");
  const [firebaseState, setFirebaseState] = useState("connecting");
  const [connectionId, setConnectionId] = useState("");

  const userInfo = {
    user: user,
    setUser: setUser,
    loginState: loginState,
  };

  const connectionState = {
    socketState: socketState,
    firebaseState: firebaseState,
    connectionId: connectionId,
  };

  useEffect(() => {
    auth.onAuthStateChanged(
      (user) => {
        if (user) {
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
          });
          setFirebaseState("connected");
          setLoginState("LOGIN");
        } else {
          setLoginState("LOGOUT");
          setFirebaseState("failed");
        }
      },
      (e) => console.log(e)
    );
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("[SERVER]: connected");
      showMessage({
        message: "Socket 服务连接成功",
        type: "info",
        icon: "success",
        style: {
          backgroundColor: Color.SystemGreen,
        },
      });
      setSocketState("connected");
      setConnectionId(socket.id);
    });

    socket.once("connect_error", () => {
      showMessage({
        message: "Socket 服务连接失败，请检查网络连接状态",
        type: "info",
        icon: "warning",
        style: {
          backgroundColor: Color.SystemRed,
        },
      });
      setSocketState("failed");
    });

    return () => {
      console.log("[SERVER]: disconnect from server");
      // socket.disconnect();
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        user: userInfo,
        connectionState: connectionState,
      }}
    >
      <SocketContext.Provider value={socket}>
        <Navigation />
        <FlashMessage
          position="bottom"
          titleStyle={{
            fontWeight: "500",
          }}
        />
      </SocketContext.Provider>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({});
