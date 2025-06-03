# Modified question.tsx with Show/Hide Answer Field

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SetQna: undefined;
  Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface QuestionScreenProps {
  navigation: NavigationProp;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ navigation }) => {
  const [storedQuestion, setStoredQuestion] = useState<string | null>(null);
  const [storedAnswer, setStoredAnswer] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  
  // NEW: State for showing/hiding the answer field
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const loadQna = async () => {
      try {
        const question = await AsyncStorage.getItem('question');
        const answer = await AsyncStorage.getItem('answer');
        if (!question || !answer) {
          Alert.alert('Error', 'No security question found. Please set one first.');
          navigation.replace('SetQna');
          return;
        }

        setStoredQuestion(question);
        setStoredAnswer(answer);
      } catch (err) {
        Alert.alert('Error', 'Failed to load security data.');
      }
    };

    loadQna();
  }, [navigation]);

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      Alert.alert('Error', 'Answer cannot be empty.');
      return;
    }

    if (userAnswer.trim().toLowerCase() === storedAnswer?.trim().toLowerCase()) {
      Alert.alert('Success', 'Your answer is correct.');
      navigation.replace('Profile');
    } else {
      Alert.alert('Incorrect', 'That answer is incorrect. Please try again.');
    }
  };

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

export default QuestionScreen;
```

## Key Changes Made:

### 1. Show/Hide Answer Field ✅
- Added `showAnswer` state to control visibility of the answer input
- Modified the TextInput layout to include a show/hide button
- Added `inputContainer` style to properly align the input and button
- Used `secureTextEntry={!showAnswer}` to hide/show the text
- Added consistent styling with the main.tsx implementation

### 2. Improved Layout
- Wrapped the TextInput and button in a flex container
- Added proper spacing and alignment
- Maintained the existing color scheme and styling consistency

### 3. Accessibility
- Added `autoCorrect={false}` and `autoCapitalize="none"` for better UX
- Maintained existing placeholder text and validation logic

The implementation is consistent with the show/hide functionality in main.tsx and follows React Native best practices for password/secure input fields.