import { useAuth } from "@/context/AuthContext";
import { Ionicons } from '@expo/vector-icons';
import { Tabs, } from 'expo-router';
import { Platform, Text, View, useWindowDimensions } from 'react-native';




export default function TabLayout() {
  const { loading } = useAuth();
  const {width} = useWindowDimensions ();
  

  if (loading) {
    return (
      <View style= {{ flex:1, justifyContent: "center", alignItems: "center"}}>
        <Text>Loading...</Text>
      </View>
    )
  }
  return (
    <>

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: Platform.OS === 'web' && width >= 768 ? 'none' : 'flex', 
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
          name="stats"
          options={{
            title: 'Statistic',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="stats-chart-outline" size={size} color={color} />
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
        
         <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
         
        

      </Tabs>
    </>
  )
}
