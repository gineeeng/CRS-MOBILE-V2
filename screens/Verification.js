import { Button, StyleSheet, Text, View } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import AuthHeader from "../components/authentication/AuthHeader";
import { Colors } from "../constants/Colors";
import { getAuth, reload, sendEmailVerification } from "firebase/auth";
import { AuthContext } from "../context/authContext";

export default function Verification() {
  const { setUser } = useContext(AuthContext);

  const [message, setMessage] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60); // Initial timer set to 60 seconds

  useEffect(() => {
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled]);

  const checkEmailVerificationStatus = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      await reload(user);
      if (user.emailVerified) {
        setUser(user);
        console.log("Email is verified");
      } else {
        setMessage("Email is not verified yet");
      }
    }
  };

  const resendVerificationEmail = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await sendEmailVerification(user);
        setMessage("Verification email resent. Please check your email.");
        setIsResendDisabled(true);
      } catch (error) {
        console.error("Error resending verification email:", error);
        setMessage("Failed to resend verification email. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader />
      <View
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 14,
          gap: 18,
        }}
      >
        <Text style={{ fontSize: 18 }}>
          We've sent you an email to verify your email address. Please check
          your email.
        </Text>
        {message && <Text style={{ color: "red" }}>{message}</Text>}
        <Button title="Confirm" onPress={checkEmailVerificationStatus} />
        <Button
          title={`Resend Verification Email (${timer}s)`}
          onPress={resendVerificationEmail}
          disabled={isResendDisabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary400,
    flex: 1,
    padding: 18,
  },
});
