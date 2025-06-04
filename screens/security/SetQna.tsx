// Import necessary libraries and components
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for persistent storage
import React, { useState } from 'react'; // Import React and hooks for managing state
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native'; // Import necessary components from React Native
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook for navigation
import type { StackNavigationProp } from '@react-navigation/stack'; // Import navigation types from React Navigation

// Define the navigation parameters for the app
type RootStackParamList = { // Define the navigation parameters for the app
  SetQna: undefined; // SetQna screen does not require any parameters
  QuestionScreen: undefined; // QuestionScreen does not require any parameters
};

// Define the navigation prop type for SetQna screen
type NavigationProp = StackNavigationProp<RootStackParamList>; // Use StackNavigationProp to define navigation prop type

// Define the SetQna component
const SetQna: React.FC = () => { // Define the SetQna component
  const [question, setQuestion] = useState(''); // State to hold the security question input
  const [answer, setAnswer] = useState(''); // State to hold the security answer input
  
  // State to manage show/hide functionality for the answer input
  const [showAnswer, setShowAnswer] = useState(false); // State to manage show/hide functionality for the answer input
  
  // Use useNavigation hook to get navigation object
  const navigation = useNavigation<NavigationProp>(); // Use useNavigation hook to get navigation object

  // Function to handle saving the security question and answer
  const handleSave = async () => { // Function to handle saving the security question and answer
    if (question.trim() === '' || answer.trim() === '') { // Check if the question or answer is empty
      Alert.alert('Error', 'Both the question and answer fields are required.'); // Show an alert if either the question or answer is empty
      return; // Exit the function if either the question or answer is empty
    }

    // Save the question and answer to AsyncStorage
    try { // Attempt to save the question and answer to AsyncStorage
      await AsyncStorage.setItem('question', question.trim()); // Save the question to AsyncStorage
      await AsyncStorage.setItem('answer', answer.trim()); // Save the answer to AsyncStorage
      await AsyncStorage.setItem('hasQna', 'true'); // Indicate that a security question has been set
      Alert.alert('Success', 'Security question and answer saved.', [ // Show a success alert with an OK button
        {
          text: 'OK',
          onPress: () => navigation.replace('Question'), // Navigate to Question screen when OK is pressed
        },
      ]);
    } catch (error) { // Catch any errors that occur while saving the data
      Alert.alert('Error', 'Failed to save your security question.'); // Show an alert if there is an error saving the security question
    }
  };

  // Render the SetQna component, which includes inputs for the security question and answer
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Set Security Question</Text>
      
      {/* Question Input */}
      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        value={question}
        onChangeText={setQuestion}
        placeholder="Enter your security question"
        multiline={true}
        numberOfLines={2}
      />
      
      {/* Answer Input with Show/Hide functionality */}
      <Text style={styles.label}>Answer:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={answer}
          onChangeText={setAnswer}
          placeholder="Enter your answer"
          secureTextEntry={!showAnswer}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.showHideButton}
          onPress={() => setShowAnswer(!showAnswer)}
        >
          <Text style={styles.showHideText}>
            {showAnswer ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      </View>
      
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

// Define styles for the SetQna component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#004080',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  // NEW: Container for input and show/hide button
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: 'black',
    marginRight: 10,
  },
  // NEW: Show/hide button styles
  showHideButton: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#999',
  },
  showHideText: {
    fontSize: 14,
    color: '#004080',
    fontWeight: '500',
  },
});

// Export the SetQna component as the default export
export default SetQna;