import {
  StyleSheet,
  Text,
  View,
  Modal,
  Button,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useState } from "react";
import { Colors } from "../../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import {
  getAuth,
  verifyBeforeUpdateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { AuthContext } from "../../context/authContext";
import { ThemeContext } from "../../context/themeContext";

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default function ChangeEmailModal({ show, setShow }) {
  const { logout } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const inputStyle = {
    backgroundColor: colors.inputBgColor,
    color: colors.textColor,
  };

  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit() {
    setIsSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!validateEmail(newEmail)) {
      setIsSubmitting(false);
      return alert("Invalid email");
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await verifyBeforeUpdateEmail(user, newEmail);
      await logout();

      Alert.alert("Success", "We've sent an email to your new email address.");
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
          <Text style={{ color: colors.textColor }}>
            You are about to change your email address. To ensure the security
            of your account, you will be logged out immediately after the
            change.
          </Text>
          <Text style={{ color: colors.textColor }}>
            To continue using your account, please log in with your new email
            address. If your new email address is not verified yet, a
            verification email will be sent to it upon login. Please follow the
            instructions in the email to verify your new address.
          </Text>
          <TextInput
            style={[
              styles.textInput,
              inputStyle,
              {
                backgroundColor: colors.inputBgColor,
                borderColor: colors.inputBorderColor,
                color: colors.textColor,
              },
            ]}
            placeholder="Enter your new email"
            placeholderTextColor="grey"
            onChangeText={setNewEmail}
            editable={!isSubmitting}
          />
          <TextInput
            secureTextEntry
            style={[
              styles.textInput,
              inputStyle,
              {
                backgroundColor: colors.inputBgColor,
                borderColor: colors.inputBorderColor,
                color: colors.textColor,
              },
            ]}
            placeholder="Enter current password"
            placeholderTextColor="grey"
            onChangeText={setPassword}
            editable={!isSubmitting}
          />
          <TouchableOpacity
            style={[
              styles.submitBtnContainer,
              {
                opacity: !validateEmail(newEmail) || password === "" ? 0.4 : 1,
              },
            ]}
            onPress={onSubmit}
            disabled={
              isSubmitting || !validateEmail(newEmail) || password === ""
            }
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
