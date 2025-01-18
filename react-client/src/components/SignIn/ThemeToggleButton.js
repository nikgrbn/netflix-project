import React from "react";


const ThemeToggleButton = ({ theme, toggleTheme }) => {
  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      Switch to {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggleButton;
