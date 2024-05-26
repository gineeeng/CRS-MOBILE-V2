import {
  ActivityIndicator,
  Alert,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../constants/Colors";
import { AuthContext } from "../context/authContext";
import SelectDropdown from "react-native-select-dropdown";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import axios from "axios";
import ChangeEmailModal from "../components/settings/ChangeEmailModal";
import { ThemeContext } from "../context/themeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangePasswordModal from "../components/settings/ChangePasswordModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Settings() {
  const { user, logout } = useContext(AuthContext);
  const { colors, swithTheme } = useContext(ThemeContext);

  const [userData, setUserData] = useState(null);
  const [updatedUserData, setUpdatedUserData] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const [showChangeEmailModal, setShowChangeEmailModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  async function getUserInfo() {
    try {
      const theme = await AsyncStorage.getItem("theme");
      setIsEnabled(theme === "dark");

      const data = await fetch(
        `https://${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.uid}`
      );

      const json = await data.json();

      setUpdatedUserData(json);
      setUserData(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserInfo();
  }, []);

  function onUserDataChange(key, subKey, value) {
    if (key === "address")
      return setUpdatedUserData((prev) => ({
        ...prev,
        [key]: { ...prev.address, [subKey]: value },
      }));

    setUpdatedUserData((prev) => ({ ...prev, [key]: value }));
  }

  async function onUpdate() {
    setIsUpdating(true);

    const { name, address, contact_no } = updatedUserData;

    try {
      const { data } = await axios({
        method: "put",
        url: `https://${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.uid}`,
        data: { name, address, contact_no },
        headers: { "Content-Type": "application/json" },
      });

      Alert.alert(
        "Success",
        "You have successfully updated your personal information"
      );
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Something went wrong",
        "Updating personal information failed"
      );
      setUpdatedUserData(userData);
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  }

  const toggleSwitch = () => {
    swithTheme(!isEnabled);
    setIsEnabled((previousState) => !previousState);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.bgPrimary }}>
      <View style={{ flex: 1, padding: 20, backgroundColor: colors.bgPrimary }}>
        {!updatedUserData ? (
          <ActivityIndicator color={colors.textColor} size="large" />
        ) : (
          <View style={{ gap: 18, marginBottom: 72 }}>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 24,
                color: colors.textColor,
              }}
            >
              Personal Information
            </Text>
            <View style={{ alignItems: "flex-end" }}>
              {isEditing ? (
                <View style={{ flexDirection: "row", gap: 16 }}>
                  {isUpdating ? (
                    <ActivityIndicator color={colors.textColor} size="small" />
                  ) : (
                    <>
                      <TouchableOpacity onPress={onUpdate}>
                        <Feather
                          name="check"
                          size={24}
                          color={colors.textColor}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setIsEditing(false);
                          setUpdatedUserData(userData);
                        }}
                      >
                        <Feather name="x" size={24} color={colors.textColor} />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ) : (
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  <Feather name="edit" size={24} color={colors.textColor} />
                </TouchableOpacity>
              )}
            </View>
            <View>
              <Text
                style={[styles.textInputLabel, { color: colors.textColor }]}
              >
                Name:
              </Text>
              <TextInput
                value={updatedUserData.name}
                style={[
                  styles.textInput,
                  isEditing || styles.disabledText,
                  {
                    backgroundColor: colors.inputBgColor,
                    borderColor: colors.inputBorderColor,
                    color: colors.textColor,
                  },
                ]}
                editable={isEditing}
                onChangeText={(value) => onUserDataChange("name", "", value)}
              />
            </View>
            <View>
              <Text
                style={[styles.textInputLabel, { color: colors.textColor }]}
              >
                Phone Number:
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                value={updatedUserData.contact_no}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.inputBgColor,
                    borderColor: colors.inputBorderColor,
                    color: colors.textColor,
                  },
                ]}
                editable={isEditing}
                onChangeText={(value) =>
                  onUserDataChange("contact_no", "", value)
                }
              />
            </View>
            <View>
              <Text
                style={[styles.textInputLabel, { color: colors.textColor }]}
              >
                Address:
              </Text>
              <View
                style={{
                  flexDirection: "column",
                  gap: -20,
                }}
              >
                <TextInput
                  keyboardType="decimal-pad"
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.inputBgColor,
                      borderColor: colors.inputBorderColor,
                      color: colors.textColor,
                    },
                  ]}
                  value={`${updatedUserData.address.houseNumber ?? ""}`}
                  editable={isEditing}
                  onChangeText={(value) =>
                    onUserDataChange("address", "houseNumber", value)
                  }
                  placeholder="House Number"
                />
                <SelectDropdown
                  data={[
                    "akasia",
                    "arellano",
                    "centro",
                    "gibang",
                    "nobley",
                    "patalan",
                    "sitio buquig",
                    "ta ba calero",
                  ]}
                  defaultValue={updatedUserData.address.street}
                  defaultButtonText="Select Street/Sitio"
                  buttonStyle={{
                    backgroundColor: colors.inputBgColor,
                    borderColor: colors.inputBorderColor,
                    borderWidth: 1,
                    borderRadius: 4,
                    height: 34,
                    width: "100%",
                    marginTop: 32,
                  }}
                  buttonTextStyle={{
                    color: colors.textColor,
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                  dropdownStyle={{
                    borderColor: "transparent",
                    borderRadius: 8,
                  }}
                  rowStyle={{ borderColor: "transparent" }}
                  rowTextStyle={{ textTransform: "capitalize" }}
                  selectedRowTextStyle={{
                    backgroundColor: Colors.bgDark,
                    color: "white",
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                  renderDropdownIcon={() => (
                    <AntDesign name="down" size={14} color={colors.textColor} />
                  )}
                  onSelect={(value) =>
                    onUserDataChange("address", "street", value)
                  }
                  disabled={!isEditing}
                />
              </View>
            </View>
          </View>
        )}
        {userData && (
          <View>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 24,
                marginBottom: 24,
                color: colors.textColor,
              }}
            >
              Login Credentials
            </Text>
            <View>
              <Text
                style={[styles.textInputLabel, { color: colors.textColor }]}
              >
                Email:
              </Text>
              <TextInput
                value={user.email}
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.inputBgColor,
                    borderColor: colors.inputBorderColor,
                    color: colors.textColor,
                  },
                ]}
                editable={false}
              />
              <View style={{ gap: 12, marginTop: 12 }}>
                <TouchableOpacity
                  style={[styles.submitBtnContainer]}
                  onPress={() => setShowChangeEmailModal(true)}
                >
                  <Text style={styles.submitBtnText}>Change Email</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.submitBtnContainer]}
                  onPress={() => setShowChangePasswordModal(true)}
                >
                  <Text style={styles.submitBtnText}>Change Password</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 38 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 24,
                  marginBottom: 24,
                  color: colors.textColor,
                }}
              >
                Theme
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  backgroundColor: colors.inputBgColor,
                  borderRadius: 8,
                }}
              >
                <Switch
                  trackColor={{
                    false: "#767577",
                    true: Colors.buttonTextColor,
                  }}
                  thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                  style={{ alignSelf: "flex-start" }}
                />
                <Text style={{ color: colors.textColor }}>
                  {isEnabled ? "Dark Mode" : "Light Mode"}
                </Text>
              </View>
            </View>
            <View
              style={{
                borderWidth: 0.5,
                opacity: 0.5,
                marginTop: 32,
                borderColor: colors.textColor,
              }}
            ></View>
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: "#b23b3b",
                borderRadius: 8,
                paddingVertical: 10,
                paddingHorizontal: 8,
                marginTop: 32,
              }}
              onPress={logout}
            >
              <MaterialCommunityIcons name="logout" size={24} color="white" />
              <Text style={{ color: "white" }}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        <ChangeEmailModal
          show={showChangeEmailModal}
          setShow={setShowChangeEmailModal}
        />
        <ChangePasswordModal
          show={showChangePasswordModal}
          setShow={setShowChangePasswordModal}
        />
      </View>
    </ScrollView>
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
  textInputLabel: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  disabledText: { color: "#d3d3d3" },
  submitBtnContainer: {
    backgroundColor: Colors.buttonBackgroundColor,
    paddingVertical: 8,
    borderRadius: 4,
  },
  submitBtnText: {
    textAlign: "center",
    color: Colors.buttonTextColor,
    fontWeight: "bold",
  },
});
