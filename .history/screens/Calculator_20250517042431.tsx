import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import QuestionScreen from "./question";
import SecurityScreen from "./security";

// Define the type for the navigation stack
type RootStackParamList = {
  Security: undefined;
  Question: undefined;
};

export default function CalculatorScreen() {
  const [input, setInput] = useState("0");
  const [pressCount, setPressCount] = useState(0);
  const [lastPress, setLastPress] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = async (value: string): Promise<void> => {
    if (value === "=") {
      if (lastPress === value) {
        setPressCount(pressCount + 1);
      } else {
        setPressCount(1); // Reset to 1 instead of 0, because this press counts
      }

      setLastPress(value);

      if (pressCount + 1 === 3) {
        try {
          const [question, answer] = await Promise.all([
            AsyncStorage.getItem("securityQuestion"),
            AsyncStorage.getItem("securityAnswer"),
          ]);

          const isQuestionValid = question && question.trim() !== "";
          const isAnswerValid = answer && answer.trim() !== "";

          if (isQuestionValid && isAnswerValid) {
            navigation.navigate("Question");
          } else {
            navigation.navigate("Security");
          }
        } catch (error) {
          console.error("Error retrieving security data:", error);
          navigation.navigate(SecurityQuestionScreen);
        } finally {
          setPressCount(0);
        }
        return; // Prevent eval from running after routing
      }

      try {
        setInput(eval(input).toString());
      } catch (error) {
        setInput("Error");
      }
    } else {
      setPressCount(0);
      setLastPress(value);

      if (value === "C") {
        setInput("0");
      } else if (value === "%") {
        setInput((prev) => (parseFloat(prev) / 100).toString());
      } else if (value === "^") {
        setInput((prev) => Math.pow(parseFloat(prev), 2).toString());
      } else if (value === "√") {
        setInput((prev) => Math.sqrt(parseFloat(prev)).toString());
      } else {
        setInput((prev) => (prev === "0" ? value : prev + value));
      }
    }
  };

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "C", "0", "=", "+",
    "%", "^", "√", ".",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{input}</Text>
      <View style={styles.buttonContainer}>
        {buttons.map((btn) => (
          <TouchableOpacity
            key={btn}
            style={styles.button}
            onPress={() => handlePress(btn)}
          >
            <Text style={styles.buttonText}>{btn}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#282c34",
  },
  display: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  button: {
    width: 80,
    height: 80,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#61dafb",
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 24,
    color: "#000",
  },
});
