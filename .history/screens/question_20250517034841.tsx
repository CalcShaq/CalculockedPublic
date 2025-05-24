import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';



const QuestionScreen = () => {
  // State to store the security question
  const [question, setQuestion] = useState<string | null>(null);

  // State to store the correct answer fetched from AsyncStorage
  const [storedAnswer, setStoredAnswer] = useState<string | null>(null);

  // State to store the user's input answer
  const [userAnswer, setUserAnswer] = useState<string>('');

  // Navigation hook
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Fetch the security question and answer from AsyncStorage when the component mounts
  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        // Retrieve the question and answer from AsyncStorage
        const [q, a] = await Promise.all([
          AsyncStorage.getItem('securityQuestion'),
          AsyncStorage.getItem('securityAnswer'),
        ]);

        // Set the retrieved question and answer in state
        setQuestion(q);
        setStoredAnswer(a);
      } catch (e) {
        console.error('Error fetching question/answer', e);
        Alert.alert('Error', 'Failed to load security question.');
      }
    };

    fetchSecurityData();
  }, []);

  // Handle the submission of the user's answer
  const handleSubmit = () => {
    // Check if the user's answer matches the stored answer
    if (userAnswer.trim() === storedAnswer) {
      Alert.alert('Success', 'Correct answer!', [
        // Navigate to the main page on success
        { text: 'OK', onPress: () => navigation.navigate('Welcome') },
      ]);
    } else {
      // Show an alert if the answer is incorrect
      Alert.alert('Incorrect', 'That answer is incorrect. Please try again.');
    }
  };

  // Show a loading message if the question is not yet loaded
  if (!question) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading question...</Text>
      </View>
    );
  }

  // Render the security question and input field for the user's answer
  return (
    <View style={styles.container}>
      {/* Display the security question */}
      <Text style={styles.questionText}>{question}</Text>

      {/* Input field for the user's answer */}
      <TextInput
        style={styles.input}
        placeholder="Your answer"
        value={userAnswer}
        onChangeText={setUserAnswer}
        autoCapitalize="none"
      />

      {/* Button to submit the user's answer */}
      <Button title="Submit Answer" onPress={handleSubmit} />
    </View>
  );
};

export default QuestionScreen;

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  questionText: {
    fontSize: 20,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
  },
});
