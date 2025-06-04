// Importing libraries and components
import React, { useState } from 'react'; // Import React and useState hook for managing state
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'; // Import necessary components from React Native
import auth from '@react-native-firebase/auth'; // Import Firebase authentication module

const LoginScreen = ({ navigation }: { navigation: any }) => { // Define the LoginScreen component
  const [email, setEmail] = useState(''); // State to hold the email input
  const [password, setPassword] = useState(''); // State to hold the password input
  const [loading, setLoading] = useState(false); // State to manage loading state during login

  // Function to handle login
  const handleLogin = async () => { 
    if (!email.trim() || !password.trim()) { // Check if email and password are provided
      Alert.alert('Validation Error', 'Email and password are required.'); // Show an alert if validation fails
      return; // Exit the function if validation fails
    }

    setLoading(true); // Set loading state to true to indicate login process has started
    try {
      await auth().signInWithEmailAndPassword(email.trim(), password); // Attempt to sign in with Firebase authentication
      Alert.alert('Success', 'Logged in successfully!'); // Show success alert on successful login
      navigation.replace('Calculator'); // Navigate to the Calculator screen after successful login
    } catch (error) { // Catch any errors during the login process
      const message = error instanceof Error ? error.message : 'Failed to log in.'; // Get the error message
      Alert.alert('Login Error', message); // Show an alert with the error message
    } finally { // Ensure loading state is reset after the login attempt
      setLoading(false); // Set loading state back to false
    }
  };

  // Render the login screen 
  // It includes input fields for email and password, a login button, and links to sign up and reset password
  return (
    <View style={styles.container}> 
      <Text style={styles.heading}>Log In</Text> 

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
        autoComplete="password"
        textContentType="password"
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}> 
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log In</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading} style={{ marginTop: 12 }}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading} style={{ marginTop: 12 }}>
        <Text style={styles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles for the LoginScreen component
const styles = StyleSheet.create({ // Styles for the LoginScreen component
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e6f7ff' }, // Main container style
  heading: { fontSize: 32, fontWeight: 'bold', color: '#004080', marginBottom: 16, textAlign: 'center' }, // Heading style
  input: { // Style for input fields
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#333',
  },
  button: { // Style for the login button
    width: '80%',
    backgroundColor: '#004080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkText: { color: '#004080', fontWeight: '600', fontSize: 16, textDecorationLine: 'underline' },
});

// Export the LoginScreen component as the default export
export default LoginScreen;
