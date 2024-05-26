import { StyleSheet, Text, View, TextInput } from "react-native";
import { Colors } from "../../constants/Colors";
import { useContext } from "react";
import { ThemeContext } from "../../context/themeContext";

export default function InputField({
  label,
  type,
  onChangeHandler,
  keyName,
  subKey = "",
  placeholder = "",
  defaultVal = "",
  value,
}) {
  const { colors } = useContext(ThemeContext);
  return (
    <View>
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
      <TextInput
        value={value}
        keyboardType={type}
        onChangeText={(value) => onChangeHandler(keyName, value, subKey)}
        style={[
          styles.input,
          { backgroundColor: colors.inputBgColor, color: colors.textColor },
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholderColor}
        defaultValue={defaultVal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: "white",
  },
  input: {
    color: "white",
    paddingHorizontal: 2,
    paddingVertical: 6,
    fontSize: 16,
    backgroundColor: Colors.bgDark,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.inputBorderColor,
  },
});
