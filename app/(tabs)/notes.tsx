import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Note = {
  id: string;
  title: string;
  content: string | null;
  user_id: string;
  created_at: string;
};

export default function Notes() {
  const { user, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNotes();
    }
  }, [user]);

  if (authLoading) return null;

  if (!user) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: "#999" }}>Please login</Text>
      </View>
    );
  }

  const fetchNotes = async () => {
  if (!user) return;

  setLoading(true);

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log("ERROR:", error);
  } else {
    setNotes(data);
  }

  setLoading(false);
};

  const saveNote = async () => {
    if (!title.trim()) return;
  

    setLoading(true);

    if (editingId) {
      await supabase
        .from("notes")
        .update({ title, content })
        .eq("id", editingId);
    } else {
      await supabase.from("notes").insert({
        title,
        content,
        user_id: user.id,
      });
    }

    resetForm();
    fetchNotes();
    setLoading(false);
  };

  
  const editNote = (note: Note) => {
    setTitle(note.title);
    setContent(note.content ?? "");
    setEditingId(note.id);
  };

  
  const deleteNote = async (id: string) => {
    setLoading(true);

    await supabase.from("notes").delete().eq("id", id);

    await fetchNotes();
    setLoading(false);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingId(null);
  };


  return (
    <View style={styles.container}>
      {Platform.OS === "web" && <Header />}

      {/* FORM */}
      <View style={styles.form}>
        <TextInput
          placeholder="Title"
          placeholderTextColor="#777"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Write your note..."
          placeholderTextColor="#777"
          value={content}
          onChangeText={setContent}
          style={[styles.input, { height: 80 }]}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={saveNote}>
          <Text style={styles.buttonText}>
            {editingId ? "Update Note" : "Add Note"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id} // ✅ FIX
        refreshing={loading}
        onRefresh={fetchNotes}
        ListEmptyComponent={
          <Text style={{ color: "#777", textAlign: "center", marginTop: 40 }}>
            No notes
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.note}>
            <Text style={styles.noteTitle}>{item.title}</Text>

            {!!item.content && (
              <Text style={styles.noteText}>{item.content}</Text>
            )}

            <View style={styles.row}>
              <TouchableOpacity onPress={() => editNote(item)}>
                <Text style={styles.action}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => deleteNote(item.id)}>
                <Text style={[styles.action, { color: "red" }]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#060b16",
    padding: 16,
  },
  form: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    color: "#fff",
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  note: {
    backgroundColor: "#2f2a7a",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  noteTitle: {
    color: "#fff",
    fontWeight: "700",
  },
  noteText: {
    color: "#ddd",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  action: {
    color: "#1e90ff",
    fontWeight: "600",
  },
});