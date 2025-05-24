import React from 'react';
import Navigation from './utils/Navigation'; // adjust path as needed

import WelcomeScreen from './'; // Import your screen component
import DetailsScreen from './DetailsScreen'; // Another screen

type RootStackParamList = {
  Home: undefined; // No params expected for Home
  Details: { id: string }; // Details expects a param 'id' of type string
};

const Stack = createNativeStackNavigator<RootStackParamList>(); 
// Create a typed stack navigator using our route param types

export default function App() {
  return <Navigation />;
}