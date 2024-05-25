import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { formatDateReport } from "../util/dateFormatter";
import { socket } from "../socket";
import { ThemeContext } from "../context/themeContext";

function ReportCard({ reportType, type, actionStatus, date, reportedDate }) {
  const incidentDate = formatDateReport(date).split(",");
  const dateReported = formatDateReport(reportedDate).split(",");
  const { colors } = useContext(ThemeContext);

  return (
    <>
      <View style={{ marginVertical: 8 }}>
        <Text style={{ color: colors.textColor }}>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Report Type:</Text>{" "}
            {reportType}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Type:</Text> {type}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Status:</Text>{" "}
            <Text
              style={{
                color:
                  actionStatus === "Pending"
                    ? "orange"
                    : actionStatus === "Solved"
                    ? "green"
                    : "red",
              }}
            >
              {actionStatus}
            </Text>
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Date of Incident: </Text>{" "}
            {incidentDate[0]}, {incidentDate[1]} at {incidentDate[2]}
          </Text>
          <Text>
            <Text style={{ fontWeight: "bold" }}>Date Reported: </Text>{" "}
            {dateReported[0]}, {dateReported[1]} at {dateReported[2]}
          </Text>
        </Text>
      </View>
      <View
        style={{ borderWidth: 0.5, flex: 1, opacity: 0.2, marginVertical: 8 }}
      ></View>
    </>
  );
}

export default function Record() {
  const { user } = useContext(AuthContext);
  const { colors } = useContext(ThemeContext);

  const [history, setHistory] = useState([]);

  async function getReportsHistory() {
    try {
      const data = await fetch(
        `https://${process.env.EXPO_PUBLIC_API_URL}/api/users/${user.uid}/reports`
      );

      const json = await data.json();

      setHistory(json);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getReportsHistory();

    setInterval(() => {
      console.log("refetch");
      getReportsHistory();
    }, 2000);

    // console.log(user.uid);
    // console.log("Connecting to WebSocket...");

    // socket.on("connect", () => {
    //   console.log("Connected to WebSocket server");
    //   console.log(user.uid);
    // });

    // socket.on(user.uid, (data) => {
    //   console.log(data);
    //   getReportsHistory();
    // });

    // socket.on("connect_error", (error) => {
    //   console.log("Connection error:", error.message);
    // });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from WebSocket server");
    // });

    // return () => {
    //   socket.off("connect");
    //   socket.off("connect_error");
    //   socket.off("disconnect");
    // };
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 18,
        backgroundColor: colors.bgPrimary,
        flex: 1,
      }}
    >
      {history.length === 0 && (
        <Text
          style={{
            textAlign: "center",
            marginTop: 20,
            fontSize: 18,
            color: colors.textColor,
          }}
        >
          You don't have any previous reports.
        </Text>
      )}
      <FlatList
        data={history}
        renderItem={({ item }) => (
          <ReportCard
            reportType={item.reportType}
            type={item.type}
            actionStatus={item.action_status}
            date={item.date}
            reportedDate={item.createdAt}
          />
        )}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
