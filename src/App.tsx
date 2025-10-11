import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import NavBar from './common/NavBar';
import SideBar from './common/SideBar';
import RouterPage from './common/RouterPage';
import theme from './theme';

const App: React.FC = () => {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NavBar />
      <main style={{ display: 'flex' }}>
        <SideBar />
        <RouterPage />
      </main>
    </ThemeProvider>
  );
};

export default App;

