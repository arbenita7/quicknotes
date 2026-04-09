import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useRouter, usePathname, Href } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function Header() {
  const router = useRouter()
  const path = usePathname()

  const Tab = ({
    label,
    icon,
    route,
  }: {
    label: string
    icon: any
    route: Href
  }) => {
    const active = path === route

    return (
      <Pressable
        onPress={() => router.push(route)}
        style={[styles.tab, active && styles.activeTab]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={active ? '#2563eb' : '#64748b'}
        />
        <Text style={[styles.text, active && styles.activeText]}>
          {label}
        </Text>
      </Pressable>
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>QuickNotes</Text>

      <View style={styles.tabs}>
        <Tab label="Home" icon="home-outline" route="/" />
        <Tab label="Notes" icon="document-text-outline" route="/notes" />
        <Tab label="Profile" icon="person-outline" route="/profile" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: '#020617',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  logo: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    paddingBottom: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#2563eb',
  },
  text: {
    marginLeft: 6,
    color: '#94a3b8',
    fontSize: 14,
  },
  activeText: {
    color: '#2563eb',
    fontWeight: '600',
  },
})