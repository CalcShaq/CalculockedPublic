import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationProvider from './utils/Navigation';
// Import all screens
import WelcomeScreen from './screens/LogUser/welcome';
import LoginScreen from './screens/LogUser/login';
import SignUpScreen from './screens/LogUser/signup';
import CalculatorScreen from './screens/Calculator';
import QuestionScreen from './screens/question';
import SecurityQuestionScreen from './screens/security';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




type RootStackParamList = {
  Welcome: undefined; // No params expected for Home
  Login: undefined;
  Calculator: undefined
  Question: undefined
  Security: undefined // Details expects a param 'id' of type string
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
return <NavigationProvider />;
}
export RootStackParamList;