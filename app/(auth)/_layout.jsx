// app/(auth)/_layout.jsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // We'll handle our own headers in the components
        gestureEnabled: true, // Allow swipe back
        animation: 'slide_from_right', // Smooth transitions
      }}
    >
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'Login',
          // Custom transition if needed
        }}
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'Sign Up',
          // Can customize per screen
        }}
      />
    </Stack>
  );
}