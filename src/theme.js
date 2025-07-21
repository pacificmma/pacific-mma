import { createTheme } from '@mui/material/styles';

const theme = createTheme({
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
    h1: { fontWeight: 700 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 500 },
    h6: { fontWeight: 500 },
    body1: { fontSize: '1rem', fontWeight: 400 },
    body2: { fontSize: '0.875rem', fontWeight: 400 },
    button: { textTransform: 'none', fontWeight: 600 },
  },  
});

export default theme;
