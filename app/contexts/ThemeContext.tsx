import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useCookies } from "react-cookie"; // Import useCookies

export type ThemeContextType = {
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  toggleTheme: () => void; // Add toggleTheme property
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: "dark" | "light";
}) => {
  const [cookies, setCookie] = useCookies(["theme"]);
  // Set the initial theme from cookies or the one provided by the server-side logic
  const [theme, setTheme] = useState(
    () => cookies.theme || initialTheme || "light",
  );

  useEffect(() => {
    // Check if the theme cookie is not set and set based on system preference
    if (!cookies.theme) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      setTheme(systemTheme);
      setCookie("theme", systemTheme, { path: "/" });
    }
  }, []); // Empty dependency array to ensure this runs only once after mount

  useEffect(() => {
    // Update cookie whenever theme changes
    if (theme !== cookies.theme) {
      setCookie("theme", theme, { path: "/" });
    }
  }, [theme, cookies.theme, setCookie]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme } as ThemeContextType}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
