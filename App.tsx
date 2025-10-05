import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import GameScreen from './src/screens/GameScreen';
import CardCreatorScreen from './src/screens/CardCreatorScreen';
import { GameProvider } from './src/context/GameContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#1a1a2e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
          >
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Pokemon Card Battle' }}
            />
            <Stack.Screen 
              name="Game" 
              component={GameScreen} 
              options={{ title: 'Battle Arena' }}
            />
            <Stack.Screen 
              name="CardCreator" 
              component={CardCreatorScreen} 
              options={{ title: 'Create Card' }}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
});
