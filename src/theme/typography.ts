import { Platform } from 'react-native';

const headingFont = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia'
});

const bodyFont = Platform.select({
  ios: 'Avenir-Book',
  android: 'sans-serif-condensed',
  default: 'Avenir-Book'
});

export const typography = {
  headingFont,
  bodyFont,
  sizes: {
    xs: 12,
    sm: 14,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 26
  }
};
