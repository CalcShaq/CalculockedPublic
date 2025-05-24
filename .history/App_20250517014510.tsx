import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth } from 'firebase/auth';
import 

// Firebase setup
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Stack = createStackNavigator();

import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Auth: undefined;
  Calculator: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

interface AuthScreenProps {
  navigation: AuthScreenNavigationProp;
}

const AuthScreen = ({ navigation }: AuthScreenProps) => {
  const [email, setEmail] = useState('');

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Calculator')}
      >
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
      <Stack.Navigator initialRouteName="Auth">
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
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
    backgroundColor: '#f2f2f2',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
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
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});