import { AuthProvider, useAuth } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Stack, } from "expo-router";
import {
  Text,
  View,
} from "react-native";

function RootLayoutNav() {
  const { user, loading } = useAuth()

   if (loading) {
      return (
        <View style= {{ flex:1, justifyContent: "center", alignItems: "center"}}>
          <Text>Loading...</Text>
        </View>
      )
    }

  return <Stack screenOptions={{ headerShown: false }} >
   {user ? (
     <Stack.Screen name="(tabs)" /> ) : 
     ( <Stack.Screen name="(auth)" />)
    }
    </Stack>
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  )
}