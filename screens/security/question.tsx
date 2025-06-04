// Import necessary libraries and components
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for persistent storage
import React, { useState, useEffect } from 'react'; // Import React and hooks for managing state and side effects
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native'; // Import necessary components from React Native
import type { StackNavigationProp } from '@react-navigation/stack'; // Import navigation types from React Navigation

// Define the navigation parameters for the app
type RootStackParamList = { // Define the navigation parameters for the app
  SetQna: undefined; // SetQna screen does not require any parameters
  Profile: undefined; // Profile screen does not require any parameters
};

// Define the navigation prop type for Question screen
type NavigationProp = StackNavigationProp<RootStackParamList>; // Use StackNavigationProp to define navigation prop type

// Define the props for QuestionScreen component
interface QuestionScreenProps { // Define the props for QuestionScreen component
  navigation: NavigationProp; // Navigation prop for navigating between screens
}

// Define the QuestionScreen component
const QuestionScreen: React.FC<QuestionScreenProps> = ({ navigation }) => { // Define the QuestionScreen component
  const [storedQuestion, setStoredQuestion] = useState<string | null>(null); // State to hold the stored security question
  const [storedAnswer, setStoredAnswer] = useState<string | null>(null); // State to hold the stored security answer
  const [userAnswer, setUserAnswer] = useState(''); // State to hold the user's answer input
  const [showAnswer, setShowAnswer] = useState(false); // State to manage show/hide functionality for the answer input 

  // Load the security question and answer from AsyncStorage when the component mounts
  useEffect(() => { // useEffect hook to run side effects when the component mounts
    const loadQna = async () => { // Function to load security question and answer from AsyncStorage
      try { // Attempt to retrieve the security question and answer from AsyncStorage
        const question = await AsyncStorage.getItem('question'); // Retrieve the stored security question
        const answer = await AsyncStorage.getItem('answer'); // Retrieve the stored security answer
        if (!question || !answer) { // Check if either the question or answer is not found
          Alert.alert('Error', 'No security question found. Please set one first.'); // Show an alert if no security question is found
          navigation.replace('SetQna'); // Navigate to SetQna screen if no security question is found
          return; // Exit the function if no security question is found
        }
        // Set the retrieved question and answer to the state variables
        setStoredQuestion(question); // Set the stored question
        setStoredAnswer(answer); // Set the stored answer
      } catch (err) { // Catch any errors that occur while retrieving the data
        Alert.alert('Error', 'Failed to load security data.'); // Show an alert if there is an error loading the security data
      }
    };
    // Call the loadQna function to load the security question and answer
    loadQna(); // Load the security question and answer when the component mounts
  }, [navigation]); // Dependency array to run the effect only once when the component mounts

  // Function to handle the submission of the user's answer
  const handleSubmit = () => { // Function to handle the submission of the user's answer
    if (!userAnswer.trim()) { // Check if the user's answer is empty
      Alert.alert('Error', 'Answer cannot be empty.'); // Show an alert if the user's answer is empty
      return; // Exit the function if the user's answer is empty
    }

    // Compare the user's answer with the stored answer
    if (userAnswer.trim().toLowerCase() === storedAnswer?.trim().toLowerCase()) { // Check if the user's answer matches the stored answer
      Alert.alert('Success', 'Your answer is correct.'); // Show a success alert if the user's answer is correct
      navigation.replace('Profile'); // Navigate to Profile screen if the user's answer is correct
    } else { // If the user's answer does not match the stored answer
      Alert.alert('Incorrect', 'That answer is incorrect. Please try again.'); // Show an alert if the user's answer is incorrect
    }
  };

  // Render the QuestionScreen component
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Security Verification</Text>
      
      {storedQuestion ? (
        <>
          <Text style={styles.label}>{storedQuestion}</Text>
          
          {/* NEW: Answer input with show/hide functionality */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={userAnswer}
              onChangeText={setUserAnswer}
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
          
          <Button title="Submit" onPress={handleSubmit} />
        </>
      ) : (
        <Text style={styles.loading}>Loading question...</Text>
      )}
    </View>
  );
};

// Styles for the QuestionScreen component
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
    marginBottom: 20,
    textAlign: 'center',
    color: '#004080',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
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
  loading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});

// Export the QuestionScreen component as the default export
export default QuestionScreen;