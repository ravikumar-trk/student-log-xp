// src/theme/colors.ts
// Array of theme colors with main and light variants

export interface ThemeColor {
  color: string; // main color
  lightColor: string; // lighter variant
}

export const themeColors: ThemeColor[] = [
  { color: "#696cff", lightColor: "#e7e7ff" },
  { color: "#0D9394", lightColor: "#d8eeee" },
  { color: "#ffa726", lightColor: "#fff2db" },
  { color: "#eb3d63", lightColor: "#fce0e6" },
  { color: "#20bfa9", lightColor: "#d2f5ef" },
  { color: "#e91e63", lightColor: "#fde3ef" },
  { color: "#8c57ff", lightColor: "#ede7fa" },
  { color: "#8e24aa", lightColor: "#f3e6f6" },
];

export const darkBackgroundColor = "#121212"; //"#28243d";
export const lightBackgroundColor = "#f5f5f5";
export const darkModeTextColor = "#e7e3fc";
export const themeBorderColor = "#e4e6e8";
export const borderColor = "#ccc";
export const tableStripedRowColor = "#f9f9ff";
export const darkModeTableRowColor = "#121212";
