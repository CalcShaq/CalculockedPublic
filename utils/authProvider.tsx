// Importing necessary modules for styling in React Native
import React, { createContext, useEffect, useState, ReactNode } from 'react'; // Import React and necessary hooks for managing state and effects
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth'; // Import Firebase authentication module for managing user authentication

// Import necessary types for TypeScript support
type AuthContextType = { // Define the shape of the authentication context
  user: FirebaseAuthTypes.User | null; // User object or null if not authenticated
  initializing: boolean; // Flag to indicate if the authentication state is still being initialized
};

// Create the authentication context with default values
export const AuthContext = createContext<AuthContextType>({ // Create the authentication context
  user: null, // Default user is null
  initializing: true, // Default initializing state is true
});

// Define the AuthProvider component to provide authentication context to the application
type Props = { // Define the props for AuthProvider component
  children: ReactNode; // Children components that will consume the authentication context
};

// AuthProvider component that wraps the application and provides authentication context
export const AuthProvider = ({ children }: Props) => { // Define the AuthProvider component
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null); // State to hold the authenticated user
  const [initializing, setInitializing] = useState(true); // State to manage the initialization status of authentication

  // Effect to listen for authentication state changes
  useEffect(() => { // Set up an effect to listen for changes in authentication state
    const unsubscribe = auth().onAuthStateChanged((usr) => { // Subscribe to authentication state changes
      setUser(usr); // Update the user state with the authenticated user
      if (initializing) setInitializing(false); // If initializing, set it to false after the first user state change
    });
    return unsubscribe; // Cleanup function to unsubscribe from the authentication state listener
  }, [initializing]); // Dependency array to run the effect only once when the component mounts

  // Render the AuthContext provider with user and initializing state
  return ( // Render the AuthContext provider
    <AuthContext.Provider value={{ user, initializing }}>
      {children}
    </AuthContext.Provider>
  ); // Return the AuthContext provider with user and initializing state
};
