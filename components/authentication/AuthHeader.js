import { StyleSheet, Text, View, Image } from "react-native";
import React, { useContext } from "react";
import { Colors } from "../../constants/Colors";
import { ThemeContext } from "../../context/themeContext";

export default function AuthHeader({ text }) {
  const { colors } = useContext(ThemeContext);
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Image
          style={[styles.logo, { alignSelf: "center" }]}
          source={require("../../assets/pantal.jpg")}
        />
        <Image
          style={[styles.logo, { width: 95, height: 95 }]}
          source={require("../../assets/crs-logo.png")}
        />
      </View>
      <View style={styles.container}>
        <Text style={[styles.systemName, { color: colors.textColor }]}>
          Crime Reporting System
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 29,
  },
  systemName: {
    // color: Colors.textColor,
    color: "black",
    fontSize: 24,
    textAlign: "center",
    flex: 1,
  },
  logo: {
    width: 65,
    height: 65,
    borderWidth: 1,
    marginVertical: 21,
    borderRadius: 32.5,
  },
  title: {
    color: Colors.textColor,
    fontSize: 24,
    marginBottom: 25,
  },
});
