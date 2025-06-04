// Importing necessary modules for styling in React Native
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens for the application
import WelcomeScreen from '../screens/LogUser/welcome'; // Import the Welcome screen
import LoginScreen from '../screens/LogUser/login'; // Import the Login screen
import SignUpScreen from '../screens/LogUser/signup'; // Import the Sign Up screen
import CalculatorScreen from '../screens/security/Calculator'; // Import the Calculator screen
import SettingsPage from '../screens/main/settings'; // Import the Settings screen
import ProfileScreen from '../screens/main/main'; // Import the Profile screen
import SetQna from '../screens/security/SetQna'; // Import the SetQna screen for setting security questions
import QuestionScreen from '../screens/security/question'; // Import the Question screen for answering security questions

// Create a stack navigator for the application
const Stack = createStackNavigator(); // Create a stack navigator instance

// Export the NavigationProvider component which wraps the stack navigator
export default function NavigationProvider() { // NavigationProvider component that wraps the stack navigator
  return ( // Return the NavigationContainer with the stack navigator
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calculator">
        {/* Welcome Screen */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        {/*profile Screen */}
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Profile',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
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
            title: 'SignUp',
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
          name="SetQna"
          component={SetQna}
          options={{
            title: 'SecurityQuestion',
            headerStyle: { backgroundColor: '#004080' },
            headerTintColor: '#fff',
          }}
        />

        {/* Question Screen */}
        <Stack.Screen
          name="Question"
          component={QuestionScreen}
          options={{
            title: 'AnswerSecurityQuestion',
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