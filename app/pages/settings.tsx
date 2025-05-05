import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { router } from "expo-router";

const SettingsPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeToggle = () => {
    setIsDarkMode((prevState) => !prevState);
    Alert.alert(
      "Dark Mode",
      `Dark mode has been ${!isDarkMode ? "enabled" : "disabled"}.`
    );
  };

  const handleChangeSecurityQuestion = () => {
    router.replace("./security");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.settingItem}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={handleDarkModeToggle}
        />
      </View>

      <Button
        title="Change Security Question"
        onPress={handleChangeSecurityQuestion}
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

export default SettingsPage;