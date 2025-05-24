import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await auth().createUserWithEmailAndPassword(email.trim(), password);
      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Calculator');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to sign up.';
      Alert.alert('Sign Up Error', message);
    } finally {
      setLoading(false);
    }
  };

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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e6f7ff' },
  heading: { fontSize: 32, fontWeight: 'bold', color: '#004080', marginBottom: 16, textAlign: 'center' },
  input: {
    width: '80%',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#333',
  },
  button: {
    width: '80%',
    backgroundColor: '#004080',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  linkText: { color: '#004080', fontWeight: '600', fontSize: 16, textDecorationLine: 'underline' },
});

export default SignUpScreen;
