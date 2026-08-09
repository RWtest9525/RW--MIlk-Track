import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MilkProvider } from './context/MilkContext';
import { AppContainer } from './AppContainer';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MilkProvider>
          <AppContainer />
        </MilkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
