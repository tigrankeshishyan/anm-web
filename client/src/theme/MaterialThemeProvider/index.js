import React from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  red,
  green,
  orange,
  primary,
  secondary,
} from '_constants/colors';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: primary,
    },
    secondary: {
      main: secondary,
    },
    error: {
      main: red,
    },
    warning: {
      main: orange,
    },
    success: {
      main: green,
    },
  },
  typography: {
    useNextVariants: true,
  },
});

function MaterialThemeProvider({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline/>
      {children}
    </MuiThemeProvider>
  );
}

export default MaterialThemeProvider;
