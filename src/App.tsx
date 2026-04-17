import React, { useState, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import CyberLayout from './components/CyberLayout';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Force dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return <CyberLayout onLogout={() => setIsLoggedIn(false)} />;
}
