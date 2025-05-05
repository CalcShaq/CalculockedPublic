import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return ( 
  <Stack>
    <Stack.Screen 
      name="index"
      options={{
        headerTitle: "Calculator",
      }}
    />
    <Stack.Screen 
    name="main"
    options={{
      headerTitle: "Passwords",
    }}
    />
  </Stack>
  );
}
