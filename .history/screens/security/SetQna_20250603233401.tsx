import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SetQna: undefined;
  QuestionScreen: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'SetQna'>;

const SetQna: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
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

      <Text style={styles.label}>Question:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter a security question"
        value={question}
        onChangeText={setQuestion}
      />

      <Text style={styles.label}>Answer:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your answer"
        value={answer}
        onChangeText={setAnswer}
        secureTextEntry
        autoCapitalize="none"
      />

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
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
  },
});

export default SetQna;



