// Import necessary libraries and components
import React, { useState } from 'react'; // Import React and useState hook for managing state
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'; // Import necessary components from React Native
import auth from '@react-native-firebase/auth'; // Import Firebase authentication module

// Define the SignUpScreen component
const SignUpScreen = ({ navigation }: { navigation: any }) => { // Define the SignUpScreen component
  const [email, setEmail] = useState(''); // State to hold the email input
  const [password, setPassword] = useState(''); // State to hold the password input
  const [loading, setLoading] = useState(false); // State to manage loading state during sign up

  // Function to handle sign up
  const handleSignUp = async () => { // Check if email and password are provided
    if (!email.trim() || !password.trim()) { // Check if email and password are provided
      Alert.alert('Validation Error', 'Email and password are required.'); // Show an alert if validation fails
      return; // Exit the function if validation fails
    }

    setLoading(true); // Set loading state to true to indicate sign up process has started
    try { 
      await auth().createUserWithEmailAndPassword(email.trim(), password); // Attempt to create a new user with Firebase authentication
      Alert.alert('Success', 'Account created successfully!'); // Show success alert on successful sign up
      navigation.replace('Calculator'); // Navigate to the Calculator screen after successful sign up
    } catch (error) { // Catch any errors during the sign up process
      const message = error instanceof Error ? error.message : 'Failed to sign up.'; // Get the error message
      Alert.alert('Sign Up Error', message); // Show an alert with the error message
    } finally { // Ensure loading state is reset after the sign up attempt
      setLoading(false); // Set loading state back to false
    }
  };

  // Render the sign up screen
  // It includes input fields for email and password, a sign up button, and a link to log in
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Sign Up</Text>

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

      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading} style={{ marginTop: 12 }}>
        <Text style={styles.linkText}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

// Define styles for the SignUpScreen component
const styles = StyleSheet.create({ // Define styles for the SignUpScreen component
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e6f7ff' }, // Main container style
  heading: { fontSize: 32, fontWeight: 'bold', color: '#004080', marginBottom: 16, textAlign: 'center' }, // Heading style
  input: { // Styles for the input fields
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#333',
  },
  button: { // Styles for the sign up button
    width: '80%',
    backgroundColor: '#004080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 }, // Text style for the button
  linkText: { color: '#004080', fontWeight: '600', fontSize: 16, textDecorationLine: 'underline' }, // Style for the link text
});

// Export the SignUpScreen component as the default export
export default SignUpScreen;
