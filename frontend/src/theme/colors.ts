// src/theme/colors.ts

export const colors = {
  // Primary brand colors
  primary: {
    dark: "#003577",    // Header background
    light: "#6b8db1",   // Section background
  },
  
  // Accent colors
  accent: {
    dark: "#221731",    // Footer background
    red: "#e35235",     // Button color
    orange: "#fd4c00",  // Span/Highlight text
  },
  
  // Common colors
  white: "#ffffff",
  black: "#000000",
};

export type ColorPalette = typeof colors;