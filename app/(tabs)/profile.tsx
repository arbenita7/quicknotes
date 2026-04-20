import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function InitialAvatar({ letter }: { letter: string }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{letter}</Text>
    </View>
  );
}

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notesCount, setNotesCount] = useState(0);

  const email = user?.email ?? "—";

  const displayName =
    name || user?.email?.split("@")[0] || "User";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchNotesCount();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, avatar_url")
      .eq("id", user?.id)
      .single();

    if (!error && data) {
      setName(data.name || "");
      setAvatar(data.avatar_url || null);
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!res.canceled) {
      uploadImage(res.assets[0].uri);
    }
  };


  const uploadImage = async (uri: string) => {
    if (!user) return;

    try {
      const fileName = `${user.id}.jpg`;

      const response = await fetch(uri);
      const blob = await response.blob();

      const { error } = await supabase.storage
        .from("avatars")
        .upload(fileName, blob, { upsert: true });

      if (error) {
        Alert.alert("Error", "Upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      setAvatar(publicUrl);

      await supabase.from("profiles").upsert({
        id: user.id,
        avatar_url: publicUrl,
      });

    } catch (e) {
      Alert.alert("Error", "Something went wrong");
    }
  };

  const handleSave = async () => {
    if (!user) return;

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      name: name,
      avatar_url: avatar,
    });

    if (error) {
      Alert.alert("Error", "Could not save profile");
    } else {
      Alert.alert("Saved!");
      setEditing(false);
    }
  };

  const fetchNotesCount = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("notes")
      .select("id")
      .eq("user_id", user.id);

    setNotesCount(data?.length || 0);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[
        styles.container,
        { backgroundColor: colors.bg},
      ]}>
      {Platform.OS === "web" && <Header />}

      <View style={styles.card}>
        
        <TouchableOpacity onPress={pickImage}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <InitialAvatar letter={initials} />
          )}
        </TouchableOpacity>

        {/* NAME */}
        {editing ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#64748b"
          />
        ) : (
          <Text style={styles.name}>{displayName}</Text>
        )}

      
        <TouchableOpacity
          onPress={() =>
            editing ? handleSave() : setEditing(true)
          }
        >
          <Text style={styles.editBtn}>
            {editing ? "Save" : "Edit profile"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.email}>{email}</Text>

        <View style={styles.infoRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PLAN</Text>
            <Text style={styles.badgeValue}>Free Tier</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>JOINED</Text>
            <Text style={styles.badgeValue}>
                {user?.created_at
                   ? new Date(user.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
                 : "—"}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.manageBox}
        onPress={() => router.push("/notes")}
      >
        <Text style={styles.manageText}>
          Manage My Notes
        </Text>
      </TouchableOpacity>

      <View style={styles.empty}>
        <Text style={styles.emptyText}>
          You have {notesCount}{" "}
          {notesCount === 1 ? "note" : "notes"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#060b16",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#020617",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    overflow: "hidden",
    marginTop: 20,
  },
  avatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  email: {
    color: "#e5e7eb",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  badgeText: {
    color: "#c42734",
    fontSize: 12,
  },
  badgeValue: {
    color: "#e5e7eb",
    fontWeight: "600",
    marginTop: 4,
  },
  manageBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  manageText: {
    color: "#e5e7eb",
    fontWeight: "600",
  },
  empty: {
    marginTop: 16,
    padding: 20,
    borderRadius: 14,
    backgroundColor: "#020617",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  emptyText: {
    color: "#9ca3af",
  },
  name: {
    color: "#e5e7eb",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    width: "100%",
    marginBottom: 8,
    backgroundColor: "#0f172a",
  },
  editBtn: {
    color: "#3b82f6",
    fontWeight: "600",
    marginBottom: 8,
  },
});