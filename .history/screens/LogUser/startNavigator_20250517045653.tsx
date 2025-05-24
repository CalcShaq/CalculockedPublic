import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/LogUser/welcome'; // Import WelcomeScreen
import CalculatorScreen from '../screens/Calculator'; // Import CalculatorScreen
import LoginScreen from '../screens/LogUser/login'; // Import LoginScreen
import SignUpScreen from '../screens/LogUser/signup'; // Import SignUpScreen

const Stack = createStackNavigator();

export default function StartNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}