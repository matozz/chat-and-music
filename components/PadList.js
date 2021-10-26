import React from "react";
import { StyleSheet, View } from "react-native";
import { PAD_COLOR } from "../utils/SampleData";
import PadItem from "./PadItem";

const PadList = ({ type, padItems, row }) => {
  return (
    <View style={styles.list}>
      {padItems.map((value, index) => (
        <PadItem
          key={index}
          row={row}
          col={index + 1}
          type={type}
          color={PAD_COLOR[value.instrument]}
          displayName={value.displayName}
          sampleName={value.sampleName}
          steps={value.steps}
        />
      ))}
    </View>
  );
};

export default PadList;

const styles = StyleSheet.create({
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#262929",
    marginVertical: 4,
    overflow: "hidden",
  },
});
