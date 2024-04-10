import { DefaultTheme } from 'react-native-paper';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#ADC178',
    background: '#DDE5B6',
    surface: '#F0EAD2',
    text: '#333333',
    error: '#FF0000',
    logoutButton: '#6A040F',
  },
  fonts: {
    regular: {
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: '100',
    },
  },
  // Add more custom styles as needed
};

export default theme;
