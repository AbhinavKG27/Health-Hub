// frontend/src/theme.js
//
// One shared theme for the whole app (patient site, admin panel, doctor panel).
// Replaces the ad-hoc hex codes scattered across components (#dcfcec, #acb2bd,
// #ccff99, etc.) with a real token system.
//
// Add these two font families to public/index.html <head>:
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=IBM+Plex+Sans:wght@400;500;600&display=swap" rel="stylesheet">

import { createTheme } from "@mui/material/styles";

export const palette = {
  pine: "#173C36",       // primary — deep pine green, trustworthy/clinical
  pineDark: "#0E2622",
  sage: "#EEF3EF",       // page background — cool, not the generic warm cream
  paper: "#FFFFFF",
  amber: "#C98A3E",      // accent / CTA — warm but not the generic terracotta
  ink: "#152321",        // primary text
  inkMuted: "#4B5F5A",   // secondary text
  line: "#D7E2DD",       // hairline borders/dividers
};

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: palette.pine, dark: palette.pineDark, contrastText: "#fff" },
    secondary: { main: palette.amber, contrastText: "#fff" },
    background: { default: palette.sage, paper: palette.paper },
    text: { primary: palette.ink, secondary: palette.inkMuted },
    divider: palette.line,
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"IBM Plex Sans", "Segoe UI", sans-serif',
    h1: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: "-0.01em" },
    h2: { fontFamily: '"Fraunces", serif', fontWeight: 600, letterSpacing: "-0.01em" },
    h3: { fontFamily: '"Fraunces", serif', fontWeight: 600 },
    h4: { fontFamily: '"Fraunces", serif', fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 999, paddingLeft: 22, paddingRight: 22, paddingTop: 10, paddingBottom: 10 },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { border: `1px solid ${palette.line}`, boxShadow: "none" },
      },
    },
  },
});

export default theme;