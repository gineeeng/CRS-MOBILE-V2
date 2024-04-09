import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";

export default function AuthField({
  label,
  setValue,
  value,
  pressHanlder = () => {},
  inputKey,
  isPasswordField = false,
  isEditable = true,
  mode = "text",
  placeholder = "",
  addressFormat = "",
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <Pressable style={styles.container} onPress={pressHanlder}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>
          {label}{" "}
          {addressFormat && (
            <Text style={styles.addressFormat}>{addressFormat}</Text>
          )}
        </Text>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          style={[styles.textInput]}
          value={value}
          autoCapitalize="none"
          secureTextEntry={isPasswordField && !showPassword}
          onChangeText={setValue.bind(this, inputKey)}
          editable={isEditable}
          inputMode={mode}
          placeholder={placeholder}
          placeholderTextColor={"grey"}
        />
        {isPasswordField && (
          <TouchableOpacity
            style={{
              alignItems: "center",
              justifyContent: "center",
              position: "absolute",
              right: 10,
            }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={24}
              color="white"
              onPress={() => setShowPassword((prev) => !prev)}
            />
          </TouchableOpacity>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    flex: 1,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  label: {
    fontSize: 18,
    color: "#99adba",
  },
  addressFormat: {
    fontSize: 12,
    color: "grey",
    alignSelf: "center",
  },
  errorText: {
    color: Colors.error400,
    marginVertical: -5,
  },
  textInput: {
    backgroundColor: Colors.inputBgColor,
    fontSize: 15,
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    flex: 1,
  },
  inputErrorStyle: {
    borderColor: Colors.error400,
  },
});
