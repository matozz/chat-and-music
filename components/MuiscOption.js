import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Color from "../utils/Color";
import { PACKS } from "../utils/MusicPacks";
import i18n from "../i18n";

let allBpm = [];
for (let i = 0; i < 120; i++) {
  allBpm.push(60 + i);
}

const MuiscOption = ({
  bpm,
  setBpm,
  setSelectedBpm,
  packIndex,
  setPackIndex,
}) => {
  const [bpm1, setBpm1] = useState(bpm);

  useEffect(() => setBpm1(bpm), [bpm]);

  return (
    <View style={{ marginVertical: 20 }}>
      <Text style={styles.title}>{i18n.t("music.options.bpm")}</Text>
      <Picker
        selectedValue={String(bpm1)}
        onValueChange={(itemValue, itemIndex) => {
          setBpm1(itemValue);
          setSelectedBpm(itemValue);
        }}
        // mode="dropdown"
      >
        {allBpm.map((value, index) => (
          <Picker.Item
            key={value}
            label={String(value)}
            value={String(value)}
            color="white"
          />
        ))}
      </Picker>
      <Text style={styles.title}>{i18n.t("music.options.pack")}</Text>
      <View style={styles.packBox}>
        {PACKS.map((value, index) => (
          <TouchableOpacity
            style={{
              ...styles.pack,
              backgroundColor:
                packIndex === index ? Color.SystemBlue : "#303030",
            }}
            key={index}
            activeOpacity={0.5}
            onPress={() => setPackIndex(index)}
          >
            <Text style={styles.packTitle}>{value.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MuiscOption;

const styles = StyleSheet.create({
  title: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  packBox: {
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 16,
  },
  pack: {
    backgroundColor: "#303030",
    flex: 1,
    marginBottom: 10,
    padding: 16,
    borderRadius: 10,
    justifyContent: "center",
  },
  packTitle: { color: "white", fontWeight: "bold" },
});
