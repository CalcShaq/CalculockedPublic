import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens
import WelcomeScreen from '../screens/LogUser/welcome';
import LoginScreen from '../screens/LogUser/login';
import SignUpScreen from '../screens/LogUser/signup';
import CalculatorScreen from '../screens/Calculator';
import SecurityQuestionScreen from '../screens/security';
import QuestionScreen from '../screens/question';
import SettingsPage from '../screens/settings';

const Stack = createStackNavigator();

export default function NavigationProvider() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Welcome Screen */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Login',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />

        {/* Sign Up Screen */}
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            title: 'Sign Up',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />

        {/* Calculator Screen */}
        <Stack.Screen
          name="Calculator"
          component={CalculatorScreen}
          options={{
            title: 'Calculator',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />

        {/* Security Question Screen */}
        <Stack.Screen
          name="Security"
          component={SecurityQuestionScreen}
          options={{
            title: 'Security Question',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />

        {/* Question Screen */}
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{
            title: 'Answer Security Question',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />

        {/* Settings Screen */}
        <Stack.Screen
          name="Settings"
          component={SettingsPage}
          options={{
            title: 'Settings',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}