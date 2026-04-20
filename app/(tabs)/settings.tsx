import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

import { useState } from "react";

export default function Settings() {
  const { user } = useAuth();
  const { darkMode, toggleTheme, colors } = useTheme();
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  const handleDelete = async () => {
    Alert.alert("Delete account", "This will delete all your data!", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await supabase.from("notes").delete().eq("user_id", user?.id);
            await supabase.from("profiles").delete().eq("id", user?.id);

            await supabase.auth.signOut();
            Alert.alert("Deleted", "Your data has been removed");
            router.replace("/(auth)/login");
          } catch {
            Alert.alert("Error", "Something went wrong");
          }
        },
      },
    ]);
  };

  const handleChangePassword = async () => {
  if (!password || password.length < 6) {
    Alert.alert("Error", "Password must be at least 6 characters");
    return;
  }

  if (password !== confirmPassword) {
    Alert.alert("Error", "Passwords do not match");
    return;
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    Alert.alert("Error", "Session expired. Please login again.");
    return;
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    Alert.alert("Error", error.message);
  } else {
    Alert.alert("Success", "Password updated");
    setModalVisible(false);
    setPassword("");
    setConfirmPassword("");
  } console.log("CLICK SAVE");

};

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.bg},
      ]}
    >
      {Platform.OS === "web" && <Header />}

      <Text style={[styles.title, { color: darkMode ? "#fff" : "#000" }]}>
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

      <Pressable style={styles.item} onPress={() => setModalVisible(true)}>
        <Text style={[styles.text, { color: darkMode ? "#fff" : "#000" }]}>
          Change Password
        </Text>
      </Pressable>

      <View style={styles.itemRow}>
        <Text style={[styles.text, { color: darkMode ? "#fff" : "#000" }]}>
          Dark Mode
        </Text>
        <Switch value={darkMode} onValueChange={toggleTheme} />
      </View>

      <Pressable style={styles.item} onPress={handleLogout}>
        <Text style={[styles.text, { color: "#3b82f6" }]}>Logout</Text>
      </Pressable>

      <Pressable style={styles.item} onPress={handleDelete}>
        <Text style={[styles.text, { color: "red" }]}>Delete Account</Text>
      </Pressable>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <View style={styles.inputRow}>
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#888"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.inputFlex}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eye}>
                  {showPassword ? "🙈" : "👁️"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.inputRow}>
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#888"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
                style={styles.inputFlex}
              />
            </View>

            <Pressable style={styles.button} onPress={handleChangePassword}>
              <Text style={styles.buttonText}>Save</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.cancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: { fontSize: 22, fontWeight: "600", marginBottom: 20 },

  card: {
    borderWidth: 1,
    borderColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },

  label: { color: "#64748b", fontSize: 12 },

  value: { fontSize: 16, marginTop: 4 },

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

  text: { fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#020617",
    padding: 20,
    borderRadius: 16,
  },

  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 15,
    textAlign: "center",
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 10,
  },

  inputFlex: {
    flex: 1,
    color: "#fff",
    paddingVertical: 12,
  },

  eye: { fontSize: 18, paddingHorizontal: 5 },

  button: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },

  cancel: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});