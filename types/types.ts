// This export snippet defines the types for the navigation parameters used in the app's root stack navigator. Each screen in the app can have its own set of parameters, and this type definition helps ensure type safety when navigating between screens.
export type RootStackParamList = { // Define the navigation parameters for the app
  Welcome: undefined; // No params for Welcome screen
  Login: undefined; // No params for Login screen
  SignUp: undefined; // No params for SignUp screen
  Calculator: undefined; // No params for Calculator screen
  Question: undefined; // No params for Question screen
  Security: undefined; // No params for Security screen
  ProfileScreen: undefined // No params for ProfileScreen
};