import React from 'react';
import NavigationProvider from './utils/Navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './utils/authProvider';





export default function App() {
return (
    <AuthProvider>
<NavigationProvider />;
</AuthProvider>)
}