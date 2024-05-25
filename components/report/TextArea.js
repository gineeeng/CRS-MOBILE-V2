import { StyleSheet, TextInput, View, Text } from "react-native";
import { Colors } from "../../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";

export default function TextArea({ label, onChangeHanlder }) {
  const { colors } = useContext(ThemeContext);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          { backgroundColor: colors.inputBgColor, color: colors.textColor },
        ]}
        multiline={true}
        onChangeText={(enteredValue) =>
          onChangeHanlder("description", enteredValue)
        }
        placeholder="Description"
        placeholderTextColor={colors.placeholderColor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 18,
    color: "white",
  },
  textInput: {
    color: "white",
    paddingHorizontal: 2,
    backgroundColor: Colors.bgDark,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inputBorderColor,
    alignItems: "flex-start",
    textAlignVertical: "top",
    height: 100,
  },
});
