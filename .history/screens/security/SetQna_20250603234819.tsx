# Modified SetQna.tsx with Show/Hide Answer Field

```tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SetQna: undefined;
  QuestionScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SetQna: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  
  // NEW: State for showing/hiding the answer field
  const [showAnswer, setShowAnswer] = useState(false);
  
  const navigation = useNavigation<NavigationProp>();

  const handleSave = async () => {
    if (question.trim() === '' || answer.trim() === '') {
      Alert.alert('Error', 'Both the question and answer fields are required.');
      return;
    }

    try {
      await AsyncStorage.setItem('question', question.trim());
      await AsyncStorage.setItem('answer', answer.trim());
      await AsyncStorage.setItem('hasQna', 'true'); // Save the Q&A setup flag
      Alert.alert('Success', 'Security question and answer saved.', [
        {
          text: 'OK',
          onPress: () => navigation.replace('Question'),
        },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save your security question.');
    }
  };

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

export default SetQna;
```

## Key Changes Made:

### 1. Show/Hide Answer Field ✅
- Added `showAnswer` state to control visibility of the answer input
- Modified the answer TextInput layout to include a show/hide button
- Added `inputContainer` style to properly align the input and button
- Used `secureTextEntry={!showAnswer}` to hide/show the text
- Added consistent styling with both main.tsx and question.tsx implementations

### 2. Improved Layout
- Wrapped the answer TextInput and button in a flex container
- Added proper spacing and alignment between elements
- Maintained the existing color scheme (#004080) and styling consistency
- Used the same button styling as in question.tsx for consistency

### 3. Enhanced UX
- Added `autoCorrect={false}` and `autoCapitalize="none"` for better input handling
- Maintained the existing question field as multiline for longer questions
- Preserved all existing validation and navigation logic

### 4. Consistency
- The show/hide implementation matches the pattern used in main.tsx
- Button styling and colors are consistent across all three files
- Maintained the same visual hierarchy and spacing

All three files now have consistent show/hide password/answer functionality that follows React Native best practices and maintains a cohesive user experience throughout the application.