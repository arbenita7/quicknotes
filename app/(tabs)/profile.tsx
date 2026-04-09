import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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

const getInitialsFromEmail = (email?: string) => {
  if (!email) return "US";

  const namePart = email.split("@")[0];
  const parts = namePart.split(/[._-]/);

  if (parts.length >= 2) {
    return (
      parts[0][0].toUpperCase() + parts[1][0].toUpperCase()
    );
  }

  return namePart.slice(0, 2).toUpperCase();
};

export default function Profile() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [notesCount, setNotesCount] = useState(0);

  const initials = getInitialsFromEmail(user?.email);
  const email = user?.email ?? "—";
  const plan = "Free Tier";
  const joined = "February 2026";

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/(auth)/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      setName(user.email?.split("@")[0] || "");
      fetchNotesCount();
    }
  }, [user]);

  const fetchNotesCount = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .select("id")
      .eq("user_id", user.id);

    if (error) {
      console.log("ERROR:", error);
    } else {
      setNotesCount(data?.length || 0);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/(auth)/login");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {Platform.OS === "web" && <Header />}

      {/* CARD */}
      <View style={styles.card}>
        <InitialAvatar letter={initials} />

        {editing ? (
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor="#64748b"
          />
        ) : (
          <Text style={styles.name}>
            {name || "No name set"}
          </Text>
        )}

        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>
            {editing ? "Save" : "Edit profile"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.email}>{email}</Text>

        <View style={styles.infoRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PLAN</Text>
            <Text style={styles.badgeValue}>{plan}</Text>
          </View>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>JOINED</Text>
            <Text style={styles.badgeValue}>{joined}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {/* MANAGE NOTES */}
      <TouchableOpacity
        style={styles.manageBox}
        onPress={() => router.push("/notes")}
      >
        <Text style={styles.manageText}>Manage My Notes</Text>
      </TouchableOpacity>

      {/* NOTES COUNT */}
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
    backgroundColor: "#0f172a",
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
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
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
    backgroundColor: "#020617",
    padding: 12,
    borderRadius: 12,
    minWidth: 120,
  },
  badgeText: {
    color: "#9ca3af",
    fontSize: 12,
  },
  badgeValue: {
    color: "#e5e7eb",
    fontWeight: "600",
    marginTop: 4,
  },
  logoutBtn: {
    borderWidth: 1,
    borderColor: "#ef4444",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  logoutText: {
    color: "#ef4444",
    fontWeight: "600",
  },
  manageBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#020617",
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
  },
  editBtn: {
    color: "#3b82f6",
    fontWeight: "600",
  },
});
