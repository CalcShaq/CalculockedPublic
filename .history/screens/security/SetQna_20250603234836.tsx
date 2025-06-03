

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
