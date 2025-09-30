import { createTheme } from "@mantine/core";

export const themePalette = [
  "#fff0f6", // 0
  "#ffdeeb", // 1
  "#fcc2d7", // 2
  "#faa2c1", // 3
  "#f783ac", // 4
  "#fd33be", // 5
  "#fd00ae", // 6 PRIMARY
  "#d6336c", // 7
  "#c2255c", // 8
  "#a61e4d", // 9
] as const;

export const theme = createTheme({
  primaryColor: "primary",
  primaryShade: 6,
  colors: {
    primary: themePalette,
  },
});
