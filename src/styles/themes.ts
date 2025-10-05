
import { Theme } from 'types/index';
import { lightColors, darkColors } from './colors';
import { fonts, fontSizes, fontWeights } from './fonts';

const baseTheme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
  fontSize: {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
  },

  fonts: fonts,
  fontWeights: fontWeights,
  fontSizes: fontSizes,
};

export const lightTheme: Theme = {
  colors: lightColors,
  ...baseTheme,
};

export const darkTheme: Theme = {
  colors: darkColors,
  ...baseTheme,
};
