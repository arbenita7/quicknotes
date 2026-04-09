import {
  View,
  Text,
} from "react-native";
import { Stack, } from "expo-router"
import { AuthProvider, useAuth } from "@/context/AuthContext"

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
      <RootLayoutNav />
    </AuthProvider>
  )
}