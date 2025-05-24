import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  SetQna: undefined;
  Profile: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'SetQna'>;

interface QuestionScreenProps {
  navigation: NavigationProp;
}

const QuestionScreen: React.FC<QuestionScreenProps> = ({ navigation }) => {
  const [storedQuestion, setStoredQuestion] = useState<string | null>(null);
  const [storedAnswer, setStoredAnswer] = useState<string | null>(null);
  const [userAnswer, setUserAnswer] = useState('');

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
          <TextInput
            style={styles.input}
            placeholder="Enter your answer"
            value={userAnswer}
            onChangeText={setUserAnswer}
            secureTextEntry
            autoCapitalize="none"
          />
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
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
  },
  loading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});

export default QuestionScreen;
