// Import necessary libraries and components
import React, { useState } from "react"; // Import React and useState hook for managing state
import {View, Text, Switch, Button, StyleSheet, Alert,} from "react-native"; // Import necessary components from React Native
import { useNavigation } from "@react-navigation/native"; // Import useNavigation hook for navigation
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Import NativeStackNavigationProp for type safety in navigation
import asyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage for persistent storage

// Define RootStackParamList
type RootStackParamList = { // Define the navigation parameters for the app
  Settings: undefined; // Settings screen does not require any parameters
  SecurityScreen: undefined; // SecurityScreen does not require any parameters
};

// Define navigation prop type for Settings screen
type SettingsScreenNavigationProp = NativeStackNavigationProp< // RootStackParamList, // Use NativeStackNavigationProp to define navigation prop type
  RootStackParamList, // Specify the screen for which this navigation prop is used
  "Settings" // Specify the screen name for which this navigation prop is used
>;

// Define navigation prop type for SecurityScreen
const SettingsPage: React.FC = () => { // Define the SettingsPage component
  const navigation = useNavigation<SettingsScreenNavigationProp>(); // Use useNavigation hook to get navigation object

// Function to handle setup of security question
  const handleSetupSecurityQuestion = () => { // Function to navigate to the SetQna screen
    navigation.navigate("SetQna"); // Navigate to the SetQna screen
  };

  // Function to handle toggle of dark mode
  return ( // Render the SettingsPage component
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingItem}>
      </View>

      <Button
        title="Change Security Question"
        onPress={handleSetupSecurityQuestion}
        color="#007BFF"
      />
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
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
  },
});

// Export the SettingsPage component as default
export default SettingsPage;