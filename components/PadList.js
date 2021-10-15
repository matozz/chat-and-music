import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import PadItem from "./PadItem";

const PAD_COLOR = {
  Drum: "#71CE73",
  HiHat: "orange",
  Bass: "#5786CB",
  Chord: "#C151A2",
  Melody: "pink",
  Synth: "pink",
  Guitar: "#6E49C9",
  Strings: "#71CEC3",
  Piano: "indianred",
  Vocal: "purple",
  FX: "brown",
};

const PadList = ({ type, bpm, status, padItems, row }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        borderWidth: 1,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: "#262929",
        marginVertical: 4,
        overflow: "hidden",
      }}
    >
      {padItems.map((value, index) => (
        <PadItem
          key={index}
          row={row}
          col={index + 1}
          type={type}
          color={PAD_COLOR[value.instrument]}
          displayName={value.displayName}
          // instrument={value.instrument}
          bpm={bpm}
          status={status}
          sampleName={value.sampleName}
          steps={value.steps}
        />
      ))}
    </View>
  );
};

export default PadList;

const styles = StyleSheet.create({});
