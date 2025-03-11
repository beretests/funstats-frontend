// src/components/ThemeToggle.tsx
import React, { useEffect } from "react";
import useThemeStore from "../stores/themeStore";

type ThemeToggleProps = {
  darkIcon: React.ReactNode;
  lightIcon: React.ReactNode;
};

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  darkIcon,
  lightIcon,
}) => {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, toggleTheme]);

  const icons = { dark: lightIcon, light: darkIcon };

  return (
    // <div className="flex items-center space-x-4">
    <button onClick={toggleTheme} className="p-1 rounded-full bg-accent-100 ">
      {theme === "dark" ? icons.dark : icons.light}
    </button>
    // <div></div>
    // </div>
  );
};
