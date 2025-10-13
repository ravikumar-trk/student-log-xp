import { useAppSelector } from "../hooks/reduxHooks";
import { useMemo } from "react";
import {
  darkBackgroundColor,
  darkModeTextColor,
  themeBorderColor,
  borderColor,
  tableStripedRowColor,
  darkModeTableRowColor,
} from "./colors";

// Optimized custom hook to get theme-based styles from Redux
export function useStyles() {
  const primaryColor = useAppSelector((state) => state.theme.primaryColor);
  const mode = useAppSelector((state) => state.theme.mode);
  const skin = useAppSelector((state) => state.theme.skin);

  // Memoize all style objects for performance
  return useMemo(() => {
    const isDark = mode === "dark";
    const isDefaultSkin = skin === "default";

    return {
      bodyBackgroundColor: {
        // backgroundColor: isDark ? darkBackgroundColor : "#f4f4f4",
      },

      getTextColor(selected: boolean): string {
        if (selected) return primaryColor.color;
        if (isDark) return darkModeTextColor;
        return darkBackgroundColor;
      },

      m_0: { margin: 0 },
      p_0: { padding: 0 },
      mb_16: { marginBottom: 16 },
      mb_8: { marginBottom: 8 },
      mb_4: { marginBottom: 4 },
      mt_16: { marginTop: 16 },
      mt_8: { marginTop: 8 },
      mt_4: { marginTop: 4 },
      mr_8: { marginRight: 8 },
      ml_8: { marginLeft: 8 },
      flexCenter: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      verticalCenter: { display: "flex", alignItems: "center" },
      horizontalCenter: { display: "flex", justifyContent: "center" },
      // top navigation bar styles
      navTitleStyle: {
        fontSize: "1.5rem",
        color: primaryColor.color,
        fontWeight: 600,
        letterSpacing: "1px",
      },
      appBarStyles: {
        boxShadow: isDefaultSkin
          ? "2px 2px 3px 1px rgba(0, 0, 0, 0.1)"
          : "none",
        border: isDefaultSkin ? "none" : `1px solid ${borderColor}`,
        backgroundColor: isDark ? darkBackgroundColor : "#fff",
      },
      navIconButtonStyle: {
        background: primaryColor.lightColor,
        boxShadow: isDefaultSkin ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
        borderRadius: 12,
        border: `1px solid ${primaryColor.color}`,
      },
      navIconStyle: {
        color: primaryColor.color,
      },
      trackerIconStyle: {
        // color: primaryColor.color,
        color: isDark ? darkModeTextColor : darkModeTextColor,
        fontSize: 46,
      },

      // sidebar styles
      sidebarStyles: {
        width: 200,
        minHeight: "calc(100vh - 64px)",
        background: isDark ? darkBackgroundColor : "#fff",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        zIndex: 1100,
        borderRight: `1px solid ${borderColor}`,
        boxShadow: isDefaultSkin
          ? "2px 2px 3px 1px rgba(0, 0, 0, 0.1)"
          : "none",
      },

      // Styles for the theme drawer title
      themeBoxStyle: {
        height: "100%",
        width: 400,
        p: 2,
        backgroundColor: mode === "dark" ? darkBackgroundColor : "#fff",
      },
      themeDrawerTitleStyle: {
        fontSize: "1rem",
        fontWeight: 500,
        color: isDark ? darkModeTextColor : "#000",
        marginBottom: "8px",
        letterSpacing: "1px",
      },
      toggleButtonStyle: {
        flex: 1,
        justifyContent: "flex-start",
      },
      themeSectionStyle: {
        fontWeight: 600,
        letterSpacing: "0.5px",
        backgroundColor: primaryColor.lightColor,
        color: primaryColor.color,
        padding: "6px",
        borderRadius: 3,
        maxWidth: "fit-content",
      },
      themeColorBoxStyle: (color: string) => ({
        width: 60,
        height: 60,
        minWidth: 60,
        minHeight: 60,
        border: `3px solid ${
          primaryColor.color === color ? color : themeBorderColor
        }`,
        borderRadius: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        "&:hover": { border: `3px solid ${color}` },
      }),
      themeColorButtonsStyle: (color: string) => ({
        width: 36,
        height: 36,
        minWidth: 36,
        minHeight: 36,
        borderRadius: 3,
        background: color,
        p: "18px",
        boxSizing: "border-box",
        "&:hover": { background: color },
      }),
      skinDefaultButtonStyle: {
        // width: 32,
        height: 25,
        bgcolor: "#eee",
        borderRadius: 3,
        mb: 1,
        border: `1px solid ${borderColor}`,
      },
      skinBorderedButtonStyle: {
        // width: 32,
        height: 25,
        bgcolor: "#eee",
        borderRadius: 3,
        mb: 1,
        border: "2px dashed #1976d2",
      },
      themeModeCardStyle: (active: boolean) => ({
        p: "16px 24px",
        borderRadius: 3,
        border: active
          ? `3px solid ${primaryColor.color}`
          : `3px solid ${themeBorderColor}`,
        background: active ? primaryColor.lightColor : "transparent",
        cursor: "pointer",
        boxShadow: active ? "0 2px 8px 0 rgba(105,108,255,0.10)" : "none",
        transition: "all 0.2s",
        "&:hover": {
          border: `3px solid ${primaryColor.color}`,
        },
      }),
      themeModeIconsStyle: (theme: string) => ({
        mr: 1,
        fontSize: 32,
        color: theme === mode ? primaryColor.color : "#888",
      }),
      themeModeTextStyle: (theme: string) => ({
        fontSize: "16px",
        letterSpacing: ".5px",
        color: theme === mode || theme === skin ? primaryColor.color : "#888",
        fontWeight: 500,
      }),
      bodyMainDiv: {
        height: "calc(100vh - 64px)",
        width: "100%",
        padding: 16,
        boxSizing: "border-box",
        overflowY: "auto",
      },
      bodySubMainDiv: {
        backgroundColor: isDark ? darkBackgroundColor : "#fff",
        borderRadius: 8,
        boxShadow: isDefaultSkin ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
        margin: "0 auto",
        border: isDefaultSkin ? "none" : `1px solid ${borderColor}`,
      },

      // tabs styles
      tabDividerStyles: {
        borderBottom: `1px solid ${isDark ? darkModeTextColor : "#0000001f"}`,
      },
      tabTitleStyles: {
        color: isDark ? darkModeTextColor : "#000",
        fontWeight: 600,
        letterSpacing: "0.5px",
      },
      tabTitleSelectedStyles: {
        color: `${primaryColor.color} !important`,
        fontWeight: 600,
        letterSpacing: "0.5px",
      },
      tabIndicatorColor: {
        backgroundColor: primaryColor.color,
        height: "3px",
      },

      // accoun tab styles

      accountTabStyles: {
        padding: 16,
        boxSizing: "border-box",
      },

      accountTabImageDiv: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRight: "1px solid #eee",
      },

      accountTabLogo: {
        width: "50%",
        height: "fit-content",
      },

      displayTitle: {
        fontSize: "14px",
        fontWeight: 400,
        marginBottom: 4,
        letterSpacing: "0.5px",
        color: isDark ? darkModeTextColor : "#000",
      },

      displayValue: {
        fontSize: "16px",
        fontWeight: 600,
        letterSpacing: "0.5px",
        color: isDark ? darkModeTextColor : "#000",
      },

      // mui table styles
      tablePaperStyles: {
        boxShadow: isDefaultSkin ? "0 2px 4px rgba(0, 0, 0, 0.1)" : "none",
        "& svg": { color: isDark ? darkModeTextColor : "#000" },
      },
      tableHeaderCellStyle: {
        backgroundColor: isDark ? darkModeTableRowColor : "#fff",
        color: isDark ? darkModeTextColor : "#000",
        fontSize: "14px",
        fontWeight: 600,
        borderBottom: `1px solid ${borderColor}`,
        letterSpacing: "0.5px",
        // fontFamily: "Roboto, Arial, sans-serif",
        "& .MuiTableSortLabel-icon": {
          color: isDark ? `${darkModeTextColor} !important` : "#000",
        },
        "& .MuiInput-input": { color: isDark ? darkModeTextColor : "#000" },
        "& .MuiInput-underline::before": {
          borderBottom: `1px solid ${isDark ? darkModeTextColor : "#000"}`,
        },
      },
      tableBodyCellStyle: {
        color: isDark ? darkModeTextColor : "#000",
        fontSize: "14px",
        // fontWeight: 600,
        borderBottom: `1px solid ${borderColor}`,
        letterSpacing: "0.5px",
        // fontFamily: "Roboto, Arial, sans-serif",
      },
      tableToolBarStyles: {
        backgroundColor: isDark ? darkModeTableRowColor : "#fff",
        color: isDark ? darkModeTextColor : "#000",
        "& label": { color: isDark ? darkModeTextColor : "#000" },
        "& .MuiSelect-select": { color: isDark ? darkModeTextColor : "#000" },
        "& .MuiSelect-icon": { color: isDark ? darkModeTextColor : "#000" },
        "& .MuiInputBase-input": { color: isDark ? darkModeTextColor : "#000" },
        "& .MuiInputBase-formControl": {
          border: `1px solid ${isDark ? darkModeTextColor : "none"}`,
        },
      },
      muiTableBodyRowProps: (row: any) => {
        if (isDark) {
          // In dark mode, all rows get darkModeTableRowColor
          return { backgroundColor: darkModeTableRowColor };
        } else {
          // In normal mode, striped rows alternate between #fff and tableStripedRowColor
          return {
            backgroundColor:
              row.index % 2 === 0 ? "#fff" : tableStripedRowColor,
          };
        }
      },

      // ticket details styles
      ticketDetailsTitle: {
        margin: 0,
        fontWeight: 500,
        fontSize: "1.25rem",
        color: isDark ? darkModeTextColor : "#000",
      },

      newTicketCards: {
        backgroundColor: isDark ? darkBackgroundColor : "#fff",
        borderRadius: "8px",
        boxShadow: isDark
          ? "rgb(255 255 255 / 10%) 0px 2px 12px 4px"
          : isDefaultSkin
          ? "0 2px 12px rgba(0, 0, 0, 0.1)"
          : "none",
        margin: "0 auto",
        border: isDefaultSkin ? "none" : `1px solid ${borderColor}`,
        padding: "16px",
        cursor: "pointer",
        height: "100%",
        "&:hover hr": {
          width: "100%",
        },
        // change paragraph color when the card is hovered
      },

      newTicketCardTitle: {
        color: isDark ? darkModeTextColor : "#000",
        fontWeight: 600,
        letterSpacing: "0.5px",
        marginTop: 0,
        marginBottom: "8px",
      },
      newTicketCardItem: {
        color: isDark ? darkModeTextColor : "#000",
        fontWeight: 400,
        letterSpacing: "0.5px",
        marginTop: 0,
        marginBottom: "8px",
        // how to add transition for both color and transform
        transition: "color 0.3s, transform 0.3s",
        "&:hover": {
          color: primaryColor.color,
          cursor: "pointer",
          transform: "translateX(5px)",
        },
      },
      newTicketHr: {
        backgroundColor: primaryColor.color,
        border: "none",
        height: 2,
        margin: "8px 0 16px 0",
        width: "100px",
        transition: "width 0.3s",
        display: "block",
      },
    };
  }, [primaryColor, mode, skin]);
}
