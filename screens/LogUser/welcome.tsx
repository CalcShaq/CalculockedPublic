// Import necessary libraries and components
import React, { useEffect } from 'react'; // Import React and useEffect hook for managing side effects
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'; // Import necessary components from React Native
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Import navigation types from React Navigation
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation
import auth from '@react-native-firebase/auth'; // Import Firebase authentication module
import type { RootStackParamList } from '../../types/types'; // Import type definitions for navigation parameters

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>; // Define navigation prop type for Welcome screen

// WelcomeScreen component
const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>(); // Use useNavigation hook to get navigation object

  // Check if user is already logged in
  return ( // If user is logged in, navigate to Calculator screen
    <View style={styles.container}> 
      <Text style={styles.heading}>Welcome to Calculocked</Text>
      <Text style={styles.subheading}>your secret password storage</Text> 

      <TouchableOpacity
        style={styles.button} // Use primary button style for Log In
        onPress={() => navigation.replace('Login')} // Navigate to Login screen
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]} // Use secondary button style for Sign Up
        onPress={() => navigation.replace('SignUp')} // Navigate to Sign Up screen
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text> 
      </TouchableOpacity>
    </View>
  );
};

// Check if user is already logged in
export default WelcomeScreen;

// Styles for the WelcomeScreen component
const styles = StyleSheet.create({ // Define styles for the component
  container: { // Main container style
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
  },
  heading: { // Heading style
    fontSize: 32,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: { // Subheading style
    fontSize: 16,
    fontStyle: 'italic',
    color: '#0066cc',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: { // Style for the primary button 
    backgroundColor: '#004080',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: { // Text style for the button
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: { // Style for the secondary button
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#004080',
  },
  secondaryButtonText: { // Text style for the secondary button
    color: '#004080',
  },
});
