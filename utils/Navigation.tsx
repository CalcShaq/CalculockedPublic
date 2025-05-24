import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens
import WelcomeScreen from '../screens/LogUser/welcome';
import LoginScreen from '../screens/LogUser/login';
import SignUpScreen from '../screens/LogUser/signup';
import CalculatorScreen from '../screens/security/Calculator';
import SettingsPage from '../screens/main/settings';
import ProfileScreen from '../screens/main/main';
import SetQna from '../screens/security/SetQna';
import QuestionScreen from '../screens/security/Question';

const Stack = createStackNavigator();

export default function NavigationProvider() {
  return (
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