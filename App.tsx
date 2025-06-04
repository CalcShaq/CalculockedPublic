// The job of this file is to set up the main application component for a React Native app.

// Importing necessary modules for styling in React Native
import React from 'react'; // Import React for creating components
import NavigationProvider from './utils/Navigation'; // Import NavigationProvider for managing navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Import createNativeStackNavigator for creating a stack navigator
import { AuthProvider } from './utils/authProvider'; // Import AuthProvider for managing authentication state

// Create a stack navigator instance
export default function App() { // Main App component that wraps the application with AuthProvider and NavigationProvider
return ( // Return the AuthProvider and NavigationProvider components
    <AuthProvider>
<NavigationProvider />;
</AuthProvider>)
}