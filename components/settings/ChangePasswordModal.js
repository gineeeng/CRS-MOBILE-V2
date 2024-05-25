import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { AntDesign, Entypo } from "@expo/vector-icons";
import {
  getAuth,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { ThemeContext } from "../../context/themeContext";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ChangePasswordModal({ show, setShow }) {
  const { colors } = useContext(ThemeContext);

  const inputStyle = {
    backgroundColor: colors.inputBgColor,
    color: colors.textColor,
  };

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isValidInput, setIsValidInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (password && newPassword && confirmPassword) {
      setIsValidInput(true);
      return;
    }
    setIsValidInput(false);
  }, [password, newPassword, confirmPassword]);

  async function onSubmit() {
    setIsSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (confirmPassword !== newPassword) {
      setIsSubmitting(false);
      return alert("Password does not match");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await updatePassword(user, newPassword);

      Alert.alert("Success", "You have succesfully changed your password");
      setShow(false);
    } catch (error) {
      console.log(error);
      if (error.code === "auth/network-request-failed") {
        Alert.alert(
          "Something Went Wrong",
          "Network request failed. Please check your internet connection."
        );
      } else {
        Alert.alert("Something Went Wrong", error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal visible={show} animationType="slide">
      <View style={{ backgroundColor: colors.bgPrimary, flex: 1 }}>
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginVertical: 12, marginRight: 18 }}
          onPress={() => setShow(false)}
        >
          <AntDesign name="down" size={24} color={colors.textColor} />
        </TouchableOpacity>

        <View style={{ padding: 18, gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              secureTextEntry={!showPassword}
              style={[styles.textInput, inputStyle, { flex: 1 }]}
              placeholder="Enter your current password"
              placeholderTextColor="grey"
              onChangeText={setPassword}
              editable={!isSubmitting}
            />
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
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              secureTextEntry={!showNewPassword}
              style={[styles.textInput, inputStyle, { flex: 1 }]}
              placeholder="Enter your new password"
              placeholderTextColor="grey"
              onChangeText={setNewPassword}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: 10,
              }}
              onPress={() => setShowNewPassword((prev) => !prev)}
            >
              <Entypo
                name={showNewPassword ? "eye-with-line" : "eye"}
                size={24}
                color="white"
                onPress={() => setShowNewPassword((prev) => !prev)}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TextInput
              secureTextEntry={!showConfirmPassword}
              style={[styles.textInput, inputStyle, { flex: 1 }]}
              placeholder="Confirm password"
              placeholderTextColor="grey"
              onChangeText={setConfirmPassword}
              editable={!isSubmitting}
            />
            <TouchableOpacity
              style={{
                alignItems: "center",
                justifyContent: "center",
                position: "absolute",
                right: 10,
              }}
              onPress={() => setShowConfirmPassword((prev) => !prev)}
            >
              <Entypo
                name={showConfirmPassword ? "eye-with-line" : "eye"}
                size={24}
                color="white"
                onPress={() => setShowConfirmPassword((prev) => !prev)}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[
              styles.submitBtnContainer,
              { opacity: isValidInput ? 1 : 0.4 },
            ]}
            onPress={onSubmit}
            disabled={!isValidInput}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.textColor} size="small" />
            ) : (
              <Text style={styles.submitBtnText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  textInput: {
    fontSize: 15,
    color: "white",
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    paddingRight: 35, // Adjust padding to make space for the icon
  },
  submitBtnContainer: {
    backgroundColor: Colors.buttonBackgroundColor,
    paddingVertical: 8,
    borderRadius: 4,
  },
  submitBtnText: {
    textAlign: "center",
    color: "white",
  },
});
