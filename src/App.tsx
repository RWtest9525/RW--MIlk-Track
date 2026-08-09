import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { MilkProvider } from './context/MilkContext';
import { AppContainer } from './AppContainer';

export default function App() {
  return (
    <AuthProvider>
      <MilkProvider>
        <AppContainer />
      </MilkProvider>
    </AuthProvider>
  );
}
