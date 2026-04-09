import {View,Text, Platform } from 'react-native'
import { Tabs, } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import {useAuth} from "@/context/AuthContext"



export default function TabLayout() {
  const { loading } = useAuth();
  

  if (loading) {
    return (
      <View style= {{ flex:1, justifyContent: "center", alignItems: "center"}}>
        <Text>Loading...</Text>
      </View>
    )
  }
  return (
    <>
      {/* ✅ WEB → Header lart 
      {Platform.OS === 'web' && <Header />*/}

      <Tabs
        screenOptions={{
          headerShown: false,

          // ✅ WEB: fsheh tab-bar
          // ✅ MOBILE: tab-bar normal poshtë
          tabBarStyle:
            Platform.OS === 'web'
              ? { display: 'none' }
              : {},

          tabBarLabelStyle: {
            fontSize: 12,
          },
        }}
      >

        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />

         <Tabs.Screen
          name="notes"
          options={{
            title: 'Notes',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />
        
         <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
         
        

      </Tabs>
    </>
  )
}
