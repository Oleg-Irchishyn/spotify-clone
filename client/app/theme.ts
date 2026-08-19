'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data',
  },
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: '#1db954',
          light: '#1ed760',
          contrastText: '#000000',
        },
        background: {
          default: '#121212',
          paper: '#181818',
        },
        text: {
          primary: '#ffffff',
          secondary: '#b3b3b3',
        },
        error: {
          main: '#f15e6c',
        },
      },
    },
    light: {
      palette: {
        primary: {
          main: '#0e6b34',
          light: '#1db954',
          contrastText: '#ffffff',
        },
        background: {
          default: '#ffffff',
          paper: '#f7f7f7',
        },
        text: {
          primary: '#121212',
          secondary: '#5a5a5a',
        },
        error: {
          main: '#e0344a',
        },
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-montserrat)',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: 500,
          paddingLeft: 24,
          paddingRight: 24,
        },
        text: ({ theme }) => ({
          backgroundColor: theme.palette.action.hover,
          '&:hover': {
            backgroundColor: theme.palette.action.selected,
          },
        }),
      },
    },
  },
});

export default theme;
