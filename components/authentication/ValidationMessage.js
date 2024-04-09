import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";

export default function ValidationMessage({ errors }) {
  return (
    Object.keys(errors).length !== 0 && (
      <View style={styles.errorsContainer}>
        {Object.values(errors).map((error, index) => (
          <View key={index} style={styles.error}>
            <AntDesign name="exclamationcircleo" size={16} color="#ab2037" />
            <Text style={{ color: "black" }}>{error}</Text>
          </View>
        ))}
      </View>
    )
  );
}

const styles = StyleSheet.create({
  errorsContainer: {
    width: "100%",
    backgroundColor: Colors.bgError,
    gap: 8,
    padding: 12,
    borderRadius: 6,
    marginTop: 12,
  },
  error: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
