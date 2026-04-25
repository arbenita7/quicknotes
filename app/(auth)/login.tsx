import Header from '@/components/Header';
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      await signIn(email, password);
      router.replace("/(auth)/verify");
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" && <Header />}

      <View style={styles.center}>
        <View style={styles.box}>
          <Text style={styles.title}>Login</Text>

          <TextInput
            placeholder="Email"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
            returnKeyType='done'
            onSubmitEditing={handleLogin}
            
          />

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </Pressable>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={{ marginTop: 20 }}
          >
            <Text style={styles.link}>
              Don’t have an account? Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#060b16',
    padding: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  box: {
    width: "100%",
    maxWidth: 400,
  },

  title: {
    fontSize: 28,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: "#334155",
    padding: 14,
    marginBottom: 12,
    borderRadius: 10,
    color: "#fff",
  },

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

  link: {
    color: "#94a3b8",
    textAlign: "center",
  },
});