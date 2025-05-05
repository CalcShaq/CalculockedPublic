import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, BackHandler, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../FirebaseConfig';

// Firebase setup
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const Authindex = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '<YOUR_CLIENT_ID>', // Firebase Web client ID here
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('Firebase Google login success:', userCredential.user.email);
          router.replace('/pages/Calculator'); // Go to Calculator after login
        })
        .catch((error) => {
          console.log('Google sign-in error:', error.message);
        });
    }
  }, [response]);

  // Block hardware back button
  useEffect(() => {
    const backAction = () => true;
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

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
        onPress={() => router.replace('/pages/Calculator')}
      >
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <Button
        title="Sign in with Google"
        disabled={!request}
        onPress={() => promptAsync()}
      />
    </View>
  );
};

export default Authindex;

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