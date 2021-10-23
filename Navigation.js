import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Home from "./screens/Home";
import CreateChat from "./screens/CreateChat";
import ChatRoom from "./screens/ChatRoom";
import JoinChat from "./screens/JoinChat";
import Setting from "./screens/Setting";
import Login from "./screens/Login";
import Register from "./screens/Register";
import MusicScreen from "./screens/MusicScreen";
import IdeaScreen from "./screens/IdeaScreen";
import UploadIdea from "./screens/UploadIdea";
import Notification from "./screens/Notification";

const Navigation = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={"Home"}
        screenOptions={{
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "#1c1c1c",
            shadowColor: "transparent",
          },
        }}
      >
        <Stack.Group screenOptions={{ headerBackVisible: false }}>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ gestureEnabled: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ presentation: "modal" }}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
          <Stack.Screen name="Idea" component={IdeaScreen} />
          <Stack.Screen name="Music" component={MusicScreen} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: "modal" }}>
          <Stack.Screen
            name="CreateChat"
            component={CreateChat}
            options={{
              headerTitle: "创建音乐房间",
            }}
          />
          <Stack.Screen
            name="JoinChat"
            component={JoinChat}
            options={{
              headerTitle: "加入音乐房间",
            }}
          />
          <Stack.Screen
            name="Upload"
            component={UploadIdea}
            options={{
              headerTitle: "已上传",
            }}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{
              headerTitle: "通知",
            }}
          />
          <Stack.Screen
            name="Setting"
            component={Setting}
            options={{
              headerTitle: "",
            }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

const styles = StyleSheet.create({});
