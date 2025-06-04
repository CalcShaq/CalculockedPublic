/**
 * @format
 */

// Import necessary modules and components
import {AppRegistry} from 'react-native'; // Import AppRegistry from react-native
import App from './App'; // Import the main App component
import {name as appName} from './app.json'; // Import the app name from app.json

// Register the main App component with the AppRegistry
AppRegistry.registerComponent(appName, () => App);