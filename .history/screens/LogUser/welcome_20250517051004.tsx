import React, { use } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LoginScreen from './login';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
};

type WelcomeStackNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = ({ navigation }: { navigation: any }) => {
  const navigation = useNavigation<NativeStackNavigationProp>();
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to Calculocked</Text>
      <Text style={styles.subheading}>your secret password storage</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} // Navigate to Login screen
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
        onPress={() => navigation.navigate('SignUp')} // Navigate to SignUp screen
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