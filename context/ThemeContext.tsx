import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type ThemeType = {
  darkMode: boolean;
  toggleTheme: () => void;
  colors: any;
};

const lightColors = {
  bg: "#ffffff",
  text: "#000000",
  card: "#f1f5f9",
  border: "#e2e8f0",
  primary: "#22c55e",
};

const darkColors = {
  bg: "#020617",
  text: "#ffffff",
  card: "#1e293b",
  border: "#334155",
  primary: "#22c55e",
};

export const ThemeContext = createContext<ThemeType>({
  darkMode: true,
  toggleTheme: () => {},
  colors: darkColors,
});

export const ThemeProvider = ({ children }: any) => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const saved = await AsyncStorage.getItem("theme");
    if (saved !== null) {
      setDarkMode(saved === "dark");
    }
  };

  const toggleTheme = async () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    await AsyncStorage.setItem("theme", newValue ? "dark" : "light");
  };

  const colors = darkMode ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};


export const useTheme = () => useContext(ThemeContext);
