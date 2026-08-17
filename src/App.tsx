import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { MilkProvider } from './context/MilkContext';
import { AppContainer } from './AppContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MilkProvider>
            <AppContainer />
          </MilkProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
