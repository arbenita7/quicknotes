import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Settings() {
  const { user } = useAuth();
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);
  const [editingName, setEditingName] = useState(false);
  const [name, setName] = useState("");

  
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("darkMode");
      if (saved !== null) {
        setDarkMode(saved === "true");
      }
    };
    loadTheme();
  }, []);

  
  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("name")
      .eq("id", user?.id)
      .single();

    if (data?.name) {
      setName(data.name);
    }
  };

  
  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem("darkMode", value.toString());
  };

 
  const handleSaveName = async () => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name: name,
    });

    if (error) {
      Alert.alert("Error", "Could not update name");
    } else {
      Alert.alert("Success", "Name updated");
      setEditingName(false);
    }
  };

  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };


  const handleDelete = async () => {
    if (!user) return;

    Alert.alert(
      "Delete account",
      "This will delete everything permanently!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              
              await supabase.from("notes").delete().eq("user_id", user.id);
              await supabase.from("profiles").delete().eq("id", user.id);

              
              await supabase.functions.invoke("delete-user");

              Alert.alert("Deleted", "Account removed");
              router.replace("/(auth)/login");
            } catch (e) {
              Alert.alert("Error", "Something went wrong");
            }
          },
        },
      ]
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#020617" : "#fff" },
      ]}
    >
      {Platform.OS === "web" && <Header />}

      <Text
        style={[
          styles.title,
          { color: darkMode ? "#fff" : "#000" },
        ]}
      >
        Settings
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Logged in as</Text>
        <Text
          style={[
            styles.value,
            { color: darkMode ? "#fff" : "#000" },
          ]}
        >
          {user?.email ?? "No user"}
        </Text>
      </View>

      <View style={styles.item}>
        {editingName ? (
          <>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#888"
              style={[
                styles.input,
                { color: darkMode ? "#fff" : "#000" },
              ]}
            />
            <Pressable onPress={handleSaveName}>
              <Text style={{ color: "#3b82f6" }}>Save</Text>
            </Pressable>
          </>
        ) : (
          <Pressable onPress={() => setEditingName(true)}>
            <Text
              style={[
                styles.text,
                { color: darkMode ? "#fff" : "#000" },
              ]}
            >
              Change Name ({name || "Not set"})
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.itemRow}>
        <Text
          style={[
            styles.text,
            { color: darkMode ? "#fff" : "#000" },
          ]}
        >
          Dark Mode
        </Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>

      <Pressable style={styles.item} onPress={handleLogout}>
        <Text style={[styles.text, { color: "#3b82f6" }]}>
          Logout
        </Text>
      </Pressable>

      
      <Pressable style={styles.item} onPress={handleDelete}>
        <Text style={[styles.text, { color: "red" }]}>
          Delete Account
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#060b16',
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 20
  },
  card: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  label: {
    color: "#64748b",
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    marginTop: 4,
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  text: {
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
});