import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../firebaseConfig';
import { collection, query, where, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'goals'),
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGoals(list);
    });

    return unsubscribe;
  }, []);

  // DELETE FUNCTION
  const handleDelete = (id) => {
    Alert.alert(
      'Delete Goal',
      'Are you sure you want to delete this goal?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const docRef = doc(db, 'goals', id);
              await deleteDoc(docRef);
              console.log('Goal deleted:', id);
            } catch (error) {
              console.log('Error deleting goal:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Goals</Text>

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <Text style={styles.goalText}>{item.title || 'Untitled Goal'}</Text>
            <Text style={styles.progressText}>
              Progress: {item.progress ?? 0}%
            </Text>

            <View style={styles.buttonsContainer}>
              <Pressable
                style={[styles.button, { backgroundColor: '#21cc8d' }]}
                onPress={() => router.push(`/goals/edit/${item.id}`)}
              >
                <Text style={styles.buttonText}>Edit</Text>
              </Pressable>

              <Pressable
                style={[styles.button, { backgroundColor: 'red' }]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No goals yet. Add one!</Text>
        }
      />

      <Pressable style={[styles.button, { backgroundColor: 'red', margin: 16 }]} onPress={() => signOut(auth)}>
        <Text style={styles.buttonText}>Logout</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Goals;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 30,
  },
  goalItem: {
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  goalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
    color: 'gray',
  },
});
