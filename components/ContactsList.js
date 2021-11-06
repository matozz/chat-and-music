import React, { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActionSheetIOS,
  Alert,
} from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import Color from "../utils/Color";
import { formatDate, formatDuration } from "../utils/Translator";
import { PACKS } from "../utils/MusicPacks";
import i18n from "../i18n";

const ContactsList = ({
  data,
  type,
  delRecording,
  uploadRecording,
  handleNavigate,
}) => {
  const [refreshing, setRefreshing] = useState(false);

  const handleRecordingOptions = ({ name, id, index }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: [
          i18n.t("ideas.actions.cancel"),
          i18n.t("ideas.actions.send"),
          i18n.t("ideas.actions.del"),
        ],
        title: name,
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          uploadRecording(data[index].data);
        } else if (buttonIndex === 2) {
          delRecording(id);
        }
      }
    );
  };

  const handlePressRecord = (index, pack) => {
    let packIndex = PACKS.findIndex((item) => item.name === pack);
    if (packIndex !== -1) {
      handleNavigate(
        "record",
        `${i18n.t("ideas.idea.title")} #${index + 1}`,
        packIndex
      );
    } else {
      alert("操作失败，素材包不存在！");
    }
  };

  const renderIdeaRow = ({
    item: {
      id,
      data: { createTime, duration, pack },
      userData,
    },
    index,
  }) => (
    <TouchableOpacity
      style={styles.row}
      onLongPress={() =>
        type === "myIdea" &&
        handleRecordingOptions({
          name: `${i18n.t("ideas.idea.title")} #${index + 1}`,
          id,
          index,
        })
      }
      onPress={() => handlePressRecord(index, pack)}
    >
      <View style={styles.starredIcon}>
        <Ionicons name="ios-musical-notes" size={24} color="#efefef" />
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {type === "myIdea" ? (
            <Text style={styles.title}>
              {i18n.t("ideas.idea.title")} #{index + 1}
            </Text>
          ) : (
            <Text style={styles.title}>
              {i18n.t("ideas.idea.title")} #{index + 1} - {userData.displayName}
            </Text>
          )}
        </View>
        <View style={styles.footer}>
          <Text style={styles.date}>
            {formatDate(createTime.toDate(), "MM-dd")}{" "}
            {i18n.t("ideas.idea.from")} {pack}
          </Text>
          <Text style={styles.desc}>{formatDuration(duration)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderChatRow = () => {};

  const renderRow = {
    myIdea: renderIdeaRow,
    publicIdea: renderIdeaRow,
    myChat: renderChatRow,
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderRow[type]}
        keyExtractor={(item) => item.id}
        style={{ height: "100%" }}
        refreshing={refreshing}
        onRefresh={() => {
          setRefreshing(true);
          setTimeout(() => {
            setRefreshing(false);
          }, 2000);
        }}
      />
    </View>
  );
};

export default ContactsList;

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get("window").width,
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "row",
    marginTop: 16,
    alignItems: "center",
  },
  starredIcon: {
    backgroundColor: "#333333",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    overflow: "hidden",
  },
  content: {
    paddingLeft: 15,
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    color: "white",
    fontSize: 17,
    paddingBottom: 6,
    fontWeight: "500",
  },
  date: {
    fontSize: 13,
    color: Color.SystemGray1,
    fontWeight: "500",
  },
  desc: {
    fontSize: 13,
    color: Color.SystemGray1,
    fontWeight: "500",
  },
  avatarIcon: {
    width: 50,
    height: 50,
  },
});
