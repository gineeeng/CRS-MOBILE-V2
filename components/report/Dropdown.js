import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../../constants/Colors";
import SelectDropdown from "react-native-select-dropdown";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../../context/themeContext";

export default function Dropdown({
  label,
  options,
  onChangeHandler,
  keyName,
  subKey = "",
  dropdownRef,
}) {
  const { colors } = useContext(ThemeContext);

  useEffect(() => {
    onChangeHandler(keyName, options[0], subKey);
  }, []);
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textColor }]}>{label}</Text>
      <SelectDropdown
        ref={dropdownRef}
        defaultValue={options[0]}
        data={options}
        onSelect={(selectedItem, index) => {
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
        buttonTextStyle={{
          color: colors.textColor,
          textTransform: "capitalize",
        }}
        dropdownStyle={{ borderRadius: 8 }}
        rowStyle={{ borderWidth: 3, borderColor: "white" }}
        rowTextStyle={{ textTransform: "capitalize" }}
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
