import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SecurityQuestionScreen: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (selectedQuestion && answer) {
      try {
        // Save the question and answer to AsyncStorage
        await AsyncStorage.setItem("securityQuestion", selectedQuestion);
        await AsyncStorage.setItem("securityAnswer", answer);

        // Navigate to the main page
        navigation.navigate("Welcome" as never); // Replace with your main page
      } catch (error) {
        Alert.alert("Error", "Failed to save data. Please try again.");
      }
    } else {
      Alert.alert("Error", "Please select a question and provide an answer.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Security Question</Text>

      <Text style={styles.label}>Select a Security Question:</Text>
      <Picker
        selectedValue={selectedQuestion}
        onValueChange={(itemValue) => setSelectedQuestion(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="-- Select a question --" value="" />
        <Picker.Item label="What is the name of your first pet?" value="pet" />
        <Picker.Item
          label="What is the name of your elementary school?"
          value="school"
        />
        <Picker.Item label="In what city were you born?" value="city" />
      </Picker>

      <Text style={styles.label}>Your Answer:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your answer"
        value={answer}
        onChangeText={setAnswer}
      />

      <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F5F5F5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  picker: {
    height: 50,
    backgroundColor: "#FFF",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 5,
  },
  input: {
    height: 40,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#FFF",
    marginBottom: 20,
  },
});

export default SecurityQuestionScreen;