/**
 * Poker Bankroll Manager App
 * React Native 0.73.4
 */

import 'react-native-gesture-handler';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import TabNavigator from './src/navigation/TabNavigator';
import {SessionsProvider} from './src/contexts/SessionsContext';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SessionsProvider>
          <TabNavigator />
        </SessionsProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
