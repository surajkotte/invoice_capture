import { createContext, useMemo, useState, useContext } from "react";
//import { lightTheme, darkTheme } from "./Theme";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [lightMode, setLightMode] = useState(true);

  const toggleColorMode = () => {
    const newMode = !lightMode;
    setLightMode((prev) => !prev);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ lightMode, toggleColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
