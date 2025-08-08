import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#004D61',
      secondary: '#EDEAE0',
      contrastText: '#e1dbca',
    },
    secondary: {
      main: '#C82D2D',
      dark: '#3e1518',
    },
    background: {
      default: '#EDEAE0',
      paper: '#EDEAE0',
    },
    text: {
      primary: '#333333',
      secondary: '#e1dbca',
    },
    heroTexts: '#b7391b',
  },
  typography: {
    fontFamily: `'Oswald', 'Inter', 'Roboto', 'Helvetica', 'Arial', 'Lucida', sans-serif`,
    h1: { 
      fontWeight: 700,
      fontSize: 'clamp(2rem, 5vw, 6rem)',
      lineHeight: 1.2,
    },
    h2: { 
      fontWeight: 600,
      fontSize: 'clamp(1.75rem, 4vw, 4rem)',
      lineHeight: 1.3,
    },
    h3: { 
      fontWeight: 600,
      fontSize: 'clamp(1.5rem, 3vw, 3rem)',
      lineHeight: 1.3,
    },
    h4: { 
      fontWeight: 500,
      fontSize: 'clamp(1.25rem, 2.5vw, 2.5rem)',
      lineHeight: 1.4,
    },
    h5: { 
      fontWeight: 500,
      fontSize: 'clamp(1rem, 2vw, 2rem)',
      lineHeight: 1.4,
    },
    h6: { 
      fontWeight: 500,
      fontSize: 'clamp(0.875rem, 1.5vw, 1.5rem)',
      lineHeight: 1.5,
    },
    body1: { 
      fontSize: 'clamp(0.875rem, 1vw, 1.125rem)',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: { 
      fontSize: 'clamp(0.75rem, 0.9vw, 1rem)',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: { 
      textTransform: 'none',
      fontWeight: 600,
      fontSize: 'clamp(0.875rem, 1vw, 1.125rem)',
    },
  },
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
      styleOverrides: {
        root: {
          paddingLeft: '16px',
          paddingRight: '16px',
          '@media (min-width: 600px)': {
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '@media (min-width: 900px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
          '@media (min-width: 1536px)': {
            paddingLeft: '48px',
            paddingRight: '48px',
          },
        },
      },
    },
  },  
});

export default theme;
