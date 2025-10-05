import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { AppNavigator } from '@navigation/AppNavigator';
import { ThemeProvider } from 'context/ThemeContext';
import { AuthProvider } from 'context/AuthContext';
import { getApiUrl , isProduction, ENV_CONFIG } from 'types/index';
import { ThemeToggleButton } from '@components/index';

const App: React.FC = () => {
  const apiUrl = getApiUrl('login');
  return (
    // <SafeAreaView style={{flex:1}}>
    <ThemeProvider>
      <AuthProvider>
        <StatusBar barStyle="default" />
        <AppNavigator />
       <ThemeToggleButton/>
      </AuthProvider>
    </ThemeProvider>
    // </SafeAreaView>
  );
};

export default App;
