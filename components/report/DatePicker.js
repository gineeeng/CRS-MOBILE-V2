import { StyleSheet, Text, Pressable, View } from "react-native";
import { Colors } from "../../constants/Colors";
import { Entypo } from "@expo/vector-icons";
import { fromatInputDate } from "../../util/dateFormatter";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useContext, useState } from "react";
import { format, parseISO } from "date-fns";
import { ThemeContext } from "../../context/themeContext";

export default function DatePicker({ keyName, setUserInput }) {
  const { colors } = useContext(ThemeContext);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [dateValue, setDateValue] = useState(new Date());

  const [dateTime, setDateTime] = useState("");

  const onChangeDateHandler = (event, selectedDate) => {
    setShowDatePicker(false);
    console.log(selectedDate);
    if (event.type === "set") {
      setDateValue(selectedDate);
      setShowTimePicker(true);
    }
  };

  const onChangeTimeHanlder = (event, selectedTime) => {
    setShowTimePicker(false);

    if (event.type === "set") {
      const datePart = dateValue.toISOString().split("T")[0];
      const timePart = selectedTime.toISOString().split("T")[1];

      const finalDate = parseISO(`${datePart}T${timePart}`);
      setDateTime(format(finalDate, "MMMM dd, yyyy, hh:mm a"));
      console.log(finalDate);

      setUserInput((prev) => ({
        ...prev,
        [keyName]: finalDate,
      }));
    }
  };

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={styles.label}>When did the incident occur?</Text>
      <View style={styles.container}>
        <Pressable
          style={[styles.dateInput, { backgroundColor: colors.inputBgColor }]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={[
              styles.dateValue,
              { opacity: dateTime ? 1 : 0.5, color: colors.textColor },
            ]}
          >
            {dateTime ? dateTime : "Tap to select date"}
          </Text>
          <Entypo name="calendar" size={24} color={colors.textColor} />
        </Pressable>
        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={onChangeDateHandler}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={onChangeTimeHanlder}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  label: {
    fontSize: 18,
    color: "white",
  },
  dateInput: {
    backgroundColor: Colors.bgDark,
    borderRadius: 6,
    alignSelf: "center",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: "#757575",
  },
  dateValue: {
    color: "white",
    fontSize: 16,
  },
});
