import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import type { RootStackParamList } from '../../types/types';

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Calculocked</Text>
      <Text style={styles.subheading}>your secret password storage</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.replace('SignUp')}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default WelcomeScreen;

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e6f7ff',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#004080',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#0066cc',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#004080',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 16,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#e6f7ff',
    borderWidth: 1,
    borderColor: '#004080',
  },
  secondaryButtonText: {
    color: '#004080',
  },
});
