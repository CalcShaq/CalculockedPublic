// Import necessary libraries and components
import React, { useState, useEffect } from "react"; // Import React and hooks for managing state and side effects
import {View, Text, TouchableOpacity, StyleSheet, Modal, Button} from "react-native"; // Import necessary components from React Native
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook for navigation
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistent storage
import auth from "@react-native-firebase/auth"; // Import Firebase authentication module
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Import navigation types from React Navigation

// Define the navigation parameters for the app
type RootStackParamList = { // Define the navigation parameters for the app
  Security: undefined; // Security screen does not require any parameters
  Question: undefined; // Question screen does not require any parameters
  Profile: undefined; // Profile screen does not require any parameters
  Calculator: undefined; // Calculator screen does not require any parameters
};

// Define navigation prop type for Calculator screen
function evaluateExpression(expr: string): string { // Function to evaluate mathematical expressions
  try { // Check if the expression contains only valid characters
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return "Error"; // Regular expression to validate the expression
    const result = new Function("return " + expr)(); // Create a new function to evaluate the expression
    if (typeof result === "number" && isFinite(result)) { // Check if the result is a finite number
      return result.toString(); // Return the result as a string
    }
    // If the result is not a valid number, return "Error"
    return "Error"; // Return "Error" if the result is not a valid number
  } catch { // Catch any errors during evaluation
    return "Error"; // Return "Error" if there is an error during evaluation
  }
}

// Define navigation prop type for Calculator screen
export default function CalculatorScreen() { // Define the CalculatorScreen component
  const [input, setInput] = useState("0"); // State to hold the input expression
  const [pressCount, setPressCount] = useState(0); // State to hold the count of consecutive equal presses
  const [lastPress, setLastPress] = useState(""); // State to hold the last pressed button
  const [showModal, setShowModal] = useState(false); // State to control the visibility of the welcome modal
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Use useNavigation hook to get navigation object

  // Effect to check if it's the user's first visit and show the welcome modal
  useEffect(() => { // Effect to check if it's the user's first visit and show the welcome modal
    const checkFirstVisit = async () => { // Function to check if it's the user's first visit
      const hasVisited = await AsyncStorage.getItem("hasVisitedCalculator"); // Check if the user has visited the calculator before
      if (!hasVisited) { // If the user has not visited the calculator before
        setShowModal(true); // Show the welcome modal
        await AsyncStorage.setItem("hasVisitedCalculator", "true"); // Mark the calculator as visited
      }
    };

  // Subscribe to authentication state changes
  const unsubscribe = auth().onAuthStateChanged((user) => { // Subscribe to authentication state changes
    if (user) { // If the user is logged in
      checkFirstVisit(); // Check if it's the user's first visit
    } else { // If the user is not logged in
      navigation.replace("Welcome"); // Navigate to the Welcome screen
    }
  });
 // Effect cleanup function to unsubscribe from authentication state changes
    return () => unsubscribe(); // Unsubscribe from authentication state changes when the component unmounts
  }, [navigation]); // Effect to check if it's the user's first visit and show the welcome modal 

  // Function to handle button presses
  const handlePress = async (value: string): Promise<void> => { // Function to handle button presses
    const hasQna = await AsyncStorage.getItem("hasQna"); // Check if the user has set a security question and answer

    // If the pressed button is "=", handle the evaluation of the expression
    if (value === "=") { // If the pressed button is "=", handle the evaluation of the expression
      if (lastPress === value) { // If the last pressed button was "=", increment the press count
        setPressCount((prev) => { // Increment the press count
          const newCount = prev + 1; // Increment the press count
          if (newCount === 3) { // If the press count reaches 3, navigate to the Question or Profile screen
            if (hasQna === "true") { // If the user has set a security question and answer
              navigation.replace("Question"); // Navigate to the Question screen
            } else { // If the user has not set a security question and answer
              navigation.replace("Profile"); // Navigate to the Profile screen
            }
          }
          return newCount; // Return the updated press count
        });
      } else { // If the last pressed button was not "=", reset the press count to 1
        setPressCount(1); // Reset the press count to 1
      }

      // Set the last pressed button to "=" and evaluate the expression
      setLastPress(value); // Set the last pressed button to "="
      const result = evaluateExpression(input); // Evaluate the expression
      setInput(result); // Set the input to the evaluated result
    } else { // If the pressed button is not "=", handle other button presses
      setPressCount(0); // Reset the press count to 0
      setLastPress(value); // Set the last pressed button to the current value

      // Handle special buttons like "C", "%", "^", "√" and numeric inputs
      if (value === "C") { // If the pressed button is "C", clear the input
        setInput("0"); // Set the input to "0"
      } else if (value === "%") { // If the pressed button is "%", convert the input to a percentage
        const val = parseFloat(input); // Parse the input as a float
        if (!isNaN(val)) { // If the parsed value is a valid number
          setInput((val / 100).toString()); // Convert the value to a percentage and set the input
        } else { // If the parsed value is not a valid number
          setInput("Error"); // Set the input to "Error"
        } 
      } 
      // Handle exponentiation and square root operations
      else if (value === "^") { // If the pressed button is "^", square the input
        const val = parseFloat(input); // Parse the input as a float
        if (!isNaN(val)) { // If the parsed value is a valid number
          setInput((val * val).toString()); // Square the value and set the input
        } else { // If the parsed value is not a valid number
          setInput("Error"); // Set the input to "Error"
        }
      } 
      // Handle square root operation
      else if (value === "√") { // If the pressed button is "√", calculate the square root of the input
        const val = parseFloat(input); // Parse the input as a float
        if (!isNaN(val) && val >= 0) { // If the parsed value is a valid number and non-negative
          setInput(Math.sqrt(val).toString()); // Calculate the square root and set the input
        } else { // If the parsed value is not a valid number or negative
          setInput("Error"); // Set the input to "Error"
        }
      } else { // If the pressed button is a numeric input or decimal point
        setInput((prev) => (prev === "0" ? value : prev + value)); // If the previous input is "0", replace it with the current value, otherwise append the current value to the input
      }
    }
  };

  // Define the buttons for the calculator
  const buttons = [
    "7", "8", "9", "/", // First row of buttons
    "4", "5", "6", "*", // Second row of buttons
    "1", "2", "3", "-", // Third row of buttons
    "C", "0", "=", "+", // Fourth row of buttons
    "%", "^", "√", ".", // Fifth row of buttons
  ];

  // Render the Calculator screen
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

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Welcome to the Calculator! This is a clever masquerade for the real function of this app.
              {"\n\n"}To learn more, tap the equal sign 3 times in a row.
              {"\n\n"}Enjoy!
            </Text>
            <Button title="Got it!" onPress={() => setShowModal(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Styles for the CalculatorScreen component
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
});