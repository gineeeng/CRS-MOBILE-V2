import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Colors } from "../constants/Colors";
import { Octicons } from "@expo/vector-icons";
import {
  barangayHotlines,
  emergencyHotlineNumbers,
  majorHotlines,
} from "../util/hotlinesData";
import { ThemeContext } from "../context/themeContext";

export default function Hotline() {
  const { colors } = useContext(ThemeContext);

  const handleDialPress = (phoneNumber) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <ScrollView
      style={[styles.rootContainer, { backgroundColor: colors.bgPrimary }]}
    >
      <View style={styles.hotlineNumberWrapper}>
        <View style={styles.emergencyHotline}>
          <Text style={[styles.title, { color: colors.textColor }]}>
            DAGUPAN EMERGENCY HOTLINE NUMBERS:
          </Text>
          {emergencyHotlineNumbers.map((data, index) => (
            <View key={index} style={styles.hotlineContainer}>
              <Text style={{ color: "#e1ad01" }}>{data.label}:</Text>
              {data.contactNo.map((contactNo, index) => (
                <View key={index} style={styles.hotlineNumber}>
                  <Octicons
                    name="dot-fill"
                    size={10}
                    color={colors.textColor}
                  />
                  <Text
                    style={[styles.hotline, { color: colors.textColor }]}
                    onPress={() => handleDialPress(contactNo)}
                  >
                    {contactNo}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.emergencyHotline}>
          <Text style={[styles.title, { color: colors.textColor }]}>
            BARANGAY PANTAL HOTLINE NUMBERS:
          </Text>
          {barangayHotlines.map((data, index) => (
            <View key={index} style={styles.hotlineContainer}>
              <Text style={{ color: "#e1ad01" }}>{data.label}:</Text>
              {data.contactNo.map((contactNo, index) => (
                <View key={index} style={styles.hotlineNumber}>
                  <Octicons name="dot-fill" size={10} color="white" />
                  <Text
                    style={[styles.hotline, { color: colors.textColor }]}
                    onPress={() => handleDialPress(contactNo)}
                  >
                    {contactNo}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        <View style={styles.emergencyHotline}>
          <Text style={[styles.title, { color: colors.textColor }]}>
            MAJOR HOTLINE NUMBERS:
          </Text>
          {majorHotlines.map((data, index) => (
            <View key={index} style={styles.hotlineContainer}>
              <Text style={{ color: "#e1ad01" }}>{data.label}:</Text>
              {data.contactNo.map((contactNo, index) => (
                <View key={index} style={styles.hotlineNumber}>
                  <Octicons name="dot-fill" size={10} color="white" />
                  <Text
                    style={[styles.hotline, { color: colors.textColor }]}
                    onPress={() => handleDialPress(contactNo)}
                  >
                    {contactNo}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    backgroundColor: Colors.bgDark,
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  hotlineNumberWrapper: { gap: 25, paddingBottom: 50 },
  title: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  emergencyHotline: {
    gap: 6,
  },
  hotline: {
    color: "white",
    textDecorationLine: "underline",
  },
  hotlineNumber: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginLeft: 12,
  },
  hotlineContainer: {
    gap: 8,
  },
});
