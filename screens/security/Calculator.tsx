import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Security: undefined;
  Question: undefined;
  Profile: undefined;
  Calculator: undefined;
};

function evaluateExpression(expr: string): string {
  try {
    if (!/^[0-9+\-*/().\s]+$/.test(expr)) return "Error";
    const result = new Function("return " + expr)();
    if (typeof result === "number" && isFinite(result)) {
      return result.toString();
    }
    return "Error";
  } catch {
    return "Error";
  }
}

export default function CalculatorScreen() {
  const [input, setInput] = useState("0");
  const [pressCount, setPressCount] = useState(0);
  const [lastPress, setLastPress] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasVisited = await AsyncStorage.getItem("hasVisitedCalculator");
      if (!hasVisited) {
        setShowModal(true);
        await AsyncStorage.setItem("hasVisitedCalculator", "true");
      }
    };

  const unsubscribe = auth().onAuthStateChanged((user) => {
    if (user) {
      checkFirstVisit();
    } else {
      navigation.replace("Welcome");
    }
  });

    

    return () => unsubscribe();
  }, [navigation]);

  const handlePress = async (value: string): Promise<void> => {
    const hasQna = await AsyncStorage.getItem("hasQna");

    if (value === "=") {
      if (lastPress === value) {
        setPressCount((prev) => {
          const newCount = prev + 1;
          if (newCount === 3) {
            if (hasQna === "true") {
              navigation.replace("Question");
            } else {
              navigation.replace("Profile");
            }
          }
          return newCount;
        });
      } else {
        setPressCount(1);
      }

      setLastPress(value);
      const result = evaluateExpression(input);
      setInput(result);
    } else {
      setPressCount(0);
      setLastPress(value);

      if (value === "C") {
        setInput("0");
      } else if (value === "%") {
        const val = parseFloat(input);
        if (!isNaN(val)) {
          setInput((val / 100).toString());
        } else {
          setInput("Error");
        }
      } else if (value === "^") {
        const val = parseFloat(input);
        if (!isNaN(val)) {
          setInput((val * val).toString());
        } else {
          setInput("Error");
        }
      } else if (value === "√") {
        const val = parseFloat(input);
        if (!isNaN(val) && val >= 0) {
          setInput(Math.sqrt(val).toString());
        } else {
          setInput("Error");
        }
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
