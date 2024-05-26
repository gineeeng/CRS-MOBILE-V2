import { useContext, useState, useEffect } from "react";
import { Alert, ScrollView, StyleSheet, View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { AuthContext } from "../context/authContext";

import { authFields } from "../util/authFieldProps";
import { fromatInputDate } from "../util/dateFormatter";

import { Colors } from "../constants/Colors";
import { statusBarHeight } from "../constants/DeviceSizes";

import AuthField from "../components/authentication/AuthField";
import AuthButton from "../components/authentication/AuthButton";
import AuthNavigator from "../components/authentication/AuthNavigator";
import AuthHeader from "../components/authentication/AuthHeader";
import {
  authError,
  validateSignupCredentials,
} from "../util/validateCredentials";
import SelectDropdown from "react-native-select-dropdown";
import { locationOptions } from "../util/reportData";
import { AntDesign } from "@expo/vector-icons";
import ValidationMessage from "../components/authentication/ValidationMessage";
import { ThemeContext } from "../context/themeContext";

export default function Register({ navigation }) {
  const authCtx = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState(null);
  const [birthdate, setBrithDate] = useState("");
  const [address, setAddress] = useState({
    houseNumber: "",
    street: "",
    barangay: "",
    municipality: "Dagupan",
    country: "Philippines",
    province: "Pangasinan",
  });
  const [userInput, setUserInput] = useState({
    firstName: "",
    lastName: "",
    profilePic: "",
    email: "",
    birthday: "",
    sex: "",
    contact_no: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeUserInputHandler = (key, enteredValue) => {
    setUserInput((prev) => ({ ...prev, [key]: enteredValue }));
  };

  const onChangeAddress = (key, enteredValue) => {
    setAddress((prev) => ({ ...prev, [key]: enteredValue }));
  };

  const onChangeDateHandler = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set") {
      setBrithDate(fromatInputDate(selectedDate));
      setUserInput((prev) => ({
        ...prev,
        ["birthday"]: selectedDate,
      }));
    }
  };

  const registerHandler = async () => {
    setErrors(null);
    userInput.address = address;
    const { valid } = validateSignupCredentials(userInput, setErrors);
    if (valid) {
      try {
        const userDetail = JSON.parse(JSON.stringify(userInput));
        userDetail.name = `${userInput.firstName} ${userInput.lastName}`;
        delete userDetail.firstName;
        delete userDetail.lastName;
        delete userDetail.confirmPassword;
        authCtx.setAuthenticating(true);

        const { uid } = await authCtx.signUp(
          userDetail.email,
          userDetail.password
        );

        userDetail.id = uid;

        const data = await axios({
          method: "post",
          url: `https://${process.env.EXPO_PUBLIC_API_URL}/api/users`,
          data: userDetail,
          headers: { "Content-Type": "application/json" },
        });

        navigation.replace("Verification");
      } catch (error) {
        console.log(error);
        authCtx.logout();
        Alert.alert("Can't Sign you in", authError(error.code));
        authCtx.setAuthenticating(false);
      }
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.bgPrimary }]}>
      <ScrollView style={{ marginBottom: 16 }}>
        <View style={styles.container}>
          <AuthHeader text="Registration" />
          <View style={styles.controlls}>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <AuthField
                inputKey="firstName"
                label="First Name"
                setValue={onChangeUserInputHandler}
              />
              <AuthField
                inputKey="lastName"
                label="Last Name"
                setValue={onChangeUserInputHandler}
              />
            </View>
            <AuthField
              inputKey="email"
              label={"Email"}
              setValue={onChangeUserInputHandler}
            />
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <AuthField
                inputKey="birthday"
                label="Birthdate"
                setValue={onChangeDateHandler}
                isEditable={false}
                pressHanlder={() => setShowDatePicker(true)}
                value={birthdate}
                placeholder={"dd/mm/yyyy"}
              />
              <View>
                <Text
                  style={{
                    fontSize: 18,
                    color: "grey",
                    marginBottom: 8,
                  }}
                >
                  Sex
                </Text>
                <SelectDropdown
                  data={["Male", "Female"]}
                  buttonStyle={{
                    backgroundColor: colors.inputBgColor,
                    borderColor: colors.inputBorderColor,
                    borderWidth: 1,
                    borderRadius: 4,
                    height: 34,
                    width: 170,
                  }}
                  buttonTextStyle={{
                    color: colors.textColor,
                    fontSize: 14,
                  }}
                  dropdownStyle={{
                    borderColor: "transparent",
                    borderRadius: 8,
                  }}
                  rowStyle={{ borderColor: "transparent" }}
                  selectedRowTextStyle={{
                    backgroundColor: Colors.bgDark,
                    color: "white",
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                  defaultButtonText="Select Identity"
                  renderDropdownIcon={() => (
                    <AntDesign name="down" size={14} color={colors.textColor} />
                  )}
                  onSelect={(value) => onChangeUserInputHandler("sex", value)}
                />
              </View>
            </View>
            <View>
              <View
                style={{
                  flexDirection: "column",
                  gap: -20,
                }}
              >
                <AuthField
                  inputKey="houseNumber"
                  label="Address"
                  placeholder="House No. (optional)"
                  setValue={onChangeAddress}
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
                  onSelect={(value) => onChangeAddress("street", value)}
                />
                <SelectDropdown
                  data={locationOptions}
                  defaultButtonText="Select Barangay"
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
                  }}
                  dropdownStyle={{
                    borderColor: "transparent",
                    borderRadius: 8,
                  }}
                  rowStyle={{ borderColor: "transparent" }}
                  selectedRowTextStyle={{
                    backgroundColor: Colors.bgDark,
                    color: "white",
                    paddingVertical: 4,
                    borderRadius: 8,
                  }}
                  renderDropdownIcon={() => (
                    <AntDesign name="down" size={14} color={colors.textColor} />
                  )}
                  onSelect={(value) => onChangeAddress("barangay", value)}
                />
              </View>
            </View>
            {authFields.map((obj) => (
              <AuthField
                key={obj.key}
                inputKey={obj.key}
                value={userInput[obj.key]}
                setValue={onChangeUserInputHandler}
                pressHanlder={
                  obj.key === "birthday"
                    ? () => {
                        setShowDatePicker(true);
                      }
                    : () => {}
                }
                error={errors}
                {...obj.props}
              />
            ))}

            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onChangeDateHandler}
              />
            )}
            <AuthField
              inputKey="password"
              label="Password"
              isPasswordField={true}
              setValue={onChangeUserInputHandler}
            />
            <AuthField
              inputKey="confirmPassword"
              label="Confirm Password"
              isPasswordField={true}
              setValue={onChangeUserInputHandler}
            />
            {errors && <ValidationMessage errors={errors} />}
            <AuthButton title="Register" pressHandler={registerHandler} />
            <AuthNavigator
              name="Login"
              text="Already have an account?"
              pressHandler={() => navigation.replace("Login")}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: statusBarHeight + 10,
    flex: 1,
    backgroundColor: Colors.primary400,
  },
  container: {
    paddingHorizontal: 20,
  },
  controlls: {
    gap: 10,
  },
});
