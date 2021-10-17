import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Color from "../utils/Color";
import { PACKS } from "../utils/MusicPacks";

let allBpm = [];
for (let i = 0; i < 120; i++) {
  allBpm.push(60 + i);
}

const MuiscOption = ({ bpm, setSelectedBpm, packIndex, setPackIndex }) => {
  const [bpm1, setBpm1] = useState(bpm);

  // const PACKS = [
  //   { title: "The ChainSmokers" },
  //   { title: "Jay Chou" },
  //   { title: "Trap" },
  //   { title: "Tropical House" },
  // ];

  return (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          color: "white",
          marginTop: 20,
          fontSize: 17,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        BPM（每分钟节拍数）
      </Text>
      <Picker
        selectedValue={String(bpm1)}
        onValueChange={(itemValue, itemIndex) => {
          setBpm1(itemValue);
          setSelectedBpm(itemValue);
        }}
      >
        {/* <Picker.Item label="1" value="1" color="white" /> */}
        {allBpm.map((value, index) => (
          <Picker.Item
            key={value}
            label={String(value)}
            value={String(value)}
            color="white"
          />
        ))}
      </Picker>
      <Text
        style={{
          color: "white",
          marginTop: 10,
          marginBottom: 16,
          fontSize: 17,
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        素材包
      </Text>
      <View
        style={{
          // width: 370,
          // flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 10,
          // flexWrap: "wrap",
        }}
      >
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
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {value.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MuiscOption;

const styles = StyleSheet.create({
  pack: {
    backgroundColor: "#303030",
    // width: 180,
    flex: 1,
    // marginHorizontal: 16,
    marginBottom: 10,
    padding: 16,
    borderRadius: 10,
    justifyContent: "center",
    // height: 100,
  },
});
