import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet, ActivityIndicator, Keyboard } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";

const EditGoal = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState("");      // changed from 'goal' to 'title'
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(true);

  
  // Fetch goal data
  useEffect(() => {
    const fetchGoal = async () => {
      try {
        const docRef = doc(db, "goals", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title);                   // changed from data.goal
          setProgress(String(data.progress));
        }
      } catch (error) {
        console.log("Error fetching goal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoal();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const docRef = doc(db, "goals", id);
      await updateDoc(docRef, {
        title,                                  // update Firestore 'title' field
        progress: Number(progress),
      });
      Keyboard.dismiss();
      router.push("/goals");
    } catch (error) {
      console.log("Error updating goal:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Goal</Text>

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}                           // changed from goal
        onChangeText={setTitle}                 // changed from setGoal
      />

      <TextInput
        style={styles.input}
        placeholder="Progress"
        keyboardType="numeric"
        value={progress}
        onChangeText={setProgress}
      />

      <Pressable onPress={handleUpdate} style={styles.button}>
        <Text style={{ color: "white" }}>Update Goal</Text>
      </Pressable>
    </View>
  );
};

export default EditGoal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#21cc8d",
    borderRadius: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
