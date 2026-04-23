import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { signUp } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError(""); 

    if (!email || !password || !confirmPassword) {
      setError("Ploteso te gjitha fushat");
      return;
    }

    if (password.length < 6) {
      setError("Password duhet me pas të paktën 6 karaktere");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwordet nuk përputhen");
      return;
    }

    try {
      await signUp(email, password);
      router.replace("/(auth)/verify");
    } catch (err:any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" && <Header />}

      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          secureTextEntry
        />

        <TextInput
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          secureTextEntry
        />

        {error ? (
          <Text style={{ color: "red", marginBottom: 10 }}>
            {error}
          </Text>
        ) : null}

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Pressable onPress={() => router.push("/login")}>
          <Text style={styles.link}>
            Already have an account? Login
          </Text>
        </Pressable>
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
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color:"#fff"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    color:"#fff"
  },
  button: {
    backgroundColor: "#22c55e",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#555",
  },
});