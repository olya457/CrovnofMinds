import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AppNavigation } from './src/navigation/AppNavigation';

const App: React.FC = () => (
  <NavigationContainer>
    <AppNavigation />
  </NavigationContainer>
);

export default App;
