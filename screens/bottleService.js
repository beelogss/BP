import { collection, getDocs } from 'firebase/firestore';
import { db } from '../backend/firebaseConfig'; // Adjust the path to your firebaseConfig

export const getAvailableBottles = async () => {
  try {
    const bottlesCollection = collection(db, 'petBottles');
    const bottlesSnapshot = await getDocs(bottlesCollection);
    const bottlesList = bottlesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return bottlesList;
  } catch (error) {
    console.error('Error fetching bottles:', error);
    return [];
  }
};