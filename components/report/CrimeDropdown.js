import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import SelectDropdown from "react-native-select-dropdown";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/themeContext";

export default function CrimeDropdown({
  label,
  options,
  onChangeHandler,
  keyName,
  subKey = "",
  listen,
}) {
  const { colors } = useContext(ThemeContext);
  useEffect(() => {
    onChangeHandler(keyName, options[0], subKey);
  }, [listen]);
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
      <SelectDropdown
        defaultValue={options[0]}
        data={options}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem);
          onChangeHandler(keyName, selectedItem, subKey);
        }}
        renderDropdownIcon={() => (
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colors.textColor}
          />
        )}
        buttonStyle={[
          styles.dropdown,
          { backgroundColor: colors.inputBgColor },
        ]}
        buttonTextStyle={{ color: colors.textColor }}
        dropdownStyle={{ borderRadius: 8 }}
        rowStyle={{ borderWidth: 3, borderColor: "white" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
  },
  label: {
    fontSize: 18,
    color: "white",
  },
  dropdown: {
    backgroundColor: Colors.bgDark,
    borderRadius: 6,
    alignSelf: "center",
    width: "100%",
    borderColor: Colors.inputBorderColor,
    borderWidth: 1,
  },
});
