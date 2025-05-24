import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Stack = createStackNavigator();

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Welcome: undefined;
  Auth: undefined;
  Calculator: undefined;
};

type WelcomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Welcome'>;

interface WelcomeScreenProps {
  navigation: WelcomeScreenNavigationProp;
}

const WelcomeScreen = ({ navigation }: WelcomeScreenProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Calculocked</Text>
      <Text style={styles.subheading}>your secret password storage</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('Calculator')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Go to Calculator</Text>
      </TouchableOpacity>
    </View>
  );
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

interface AuthScreenProps {
  navigation: AuthScreenNavigationProp;
}

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  const [email, setEmail] = useState('');

  const handleSignIn = async () => {
    try {
      // Firebase anonymous sign-in
      await auth().signInAnonymously();
      console.log('User signed in anonymously');
      navigation.replace('Calculator');
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign in</Text>
      <Text style={styles.subtext}>
        We'll use this email to contact you and recover access to your accounts.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

const CalculatorScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Calculator</Text>
      <Text style={styles.subtext}>This is the Calculator screen.</Text>
    </View>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// --- Optional Basic Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff', // Light blue background
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#004080', // Dark blue text
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#0066cc', // Medium blue text
    marginBottom: 40,
  },
  subtext: {
    fontSize: 14,
    marginBottom: 20,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#004080', // Dark blue button
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#e6f7ff', // Light blue button
    borderWidth: 1,
    borderColor: '#004080', // Dark blue border
  },
  secondaryButtonText: {
    color: '#004080', // Dark blue text
  },
});