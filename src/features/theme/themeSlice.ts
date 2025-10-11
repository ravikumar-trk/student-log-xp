import { createSlice } from "@reduxjs/toolkit";
import { themeColors } from "../../theme/colors";

type colorObject = {
  color: string;
  lightColor: string;
};

type ThemeMode = "light" | "dark" | "custom";
type SkinType = "default" | "bordered";
type ThemeState = {
  mode: ThemeMode;
  primaryColor: colorObject;
  skin: SkinType;
};

const THEME_STORAGE_KEY = "student-log:theme";

function loadThemeState(): ThemeState | undefined {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);

    // basic validation
    if (
      !parsed ||
      (parsed.mode !== "light" &&
        parsed.mode !== "dark" &&
        parsed.mode !== "custom") ||
      !parsed.primaryColor ||
      typeof parsed.primaryColor.color !== "string" ||
      typeof parsed.primaryColor.lightColor !== "string" ||
      (parsed.skin !== "default" && parsed.skin !== "bordered")
    ) {
      return undefined;
    }

    return parsed as ThemeState;
  } catch (e) {
    // log parse errors and fallback to default
    // eslint-disable-next-line no-console
    console.warn("Failed to parse stored theme state", e);
    return undefined;
  }
}

function saveThemeState(state: ThemeState) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // log quota or storage errors
    // eslint-disable-next-line no-console
    console.warn("Failed to save theme state to localStorage", e);
  }
}

const initialState: ThemeState = loadThemeState() ?? {
  mode: "light",
  primaryColor: themeColors[0], // default to the first color in the array
  skin: "default",
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      saveThemeState(state);
    },
    setTheme: (state, action) => {
      state.mode = action.payload;
      saveThemeState(state);
    },
    setPrimaryColor: (state, action) => {
      state.primaryColor = action.payload;
      saveThemeState(state);
    },
    setSkin: (state, action) => {
      state.skin = action.payload;
      saveThemeState(state);
    },
  },
});

export const { toggleTheme, setTheme, setPrimaryColor, setSkin } =
  themeSlice.actions;
export default themeSlice.reducer;
