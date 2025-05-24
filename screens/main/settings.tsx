import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import asyncStorage from "@react-native-async-storage/async-storage";

// Define RootStackParamList
type RootStackParamList = {
  Settings: undefined;
  SecurityScreen: undefined;
};

type SettingsScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Settings"
>;

const SettingsPage: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();



  const handleSetupSecurityQuestion = () => {
    // Navigate to the SecurityScreen
    navigation.navigate("SetQna");
  };

  return (
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

export default SettingsPage;