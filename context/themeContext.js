import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useEffect, useState } from "react";
import { lightTheme, darkTheme } from "../constants/Colors";

export const ThemeContext = createContext({
  colors: {},
  setColors: () => {},
  swithTheme: () => {},
  mode: "",
});

export default function ThemeContextProvider({ children }) {
  const [colors, setColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("light");

  async function swithTheme(isEnabled) {
    const theme = isEnabled ? darkTheme : lightTheme;
    const mode = isEnabled ? "dark" : "light";
    setColors(theme);
    setMode(mode);

    await AsyncStorage.setItem("theme", mode);
  }

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem("theme");
        if (value === null) {
          setMode("light");
          await AsyncStorage.setItem("theme", "light");
          return;
        }

        const theme = value === "light" ? lightTheme : darkTheme;
        const mode = value === "light" ? "light" : "dark";

        setColors(theme);
        setMode(mode);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <ThemeContext.Provider value={{ colors, setColors, swithTheme, mode }}>
      {!loading && children}
    </ThemeContext.Provider>
  );
}
