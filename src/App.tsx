import { Component } from 'solid-js';
import { createTheme, ThemeProvider } from '@suid/material/styles';
import { createPalette } from '@suid/material/styles/createPalette';
import { CssBaseline, Box, AppBar, Toolbar } from '@suid/material';
import Generator from './Generator';

const App: Component = () => {
  const theme = createTheme({
    palette: createPalette({
      mode: 'dark',
    }),
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ minHeight: 'calc(100vh - 100px)' }}>
        <AppBar position="fixed" color="default" enableColorOnDark>
          <Toolbar>K6 Loading Testing Generator script</Toolbar>
        </AppBar>
        <Toolbar></Toolbar>
        <Box component="main" sx={{ width: 1, padding: '20px' }}>
          <Generator />
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default App;
