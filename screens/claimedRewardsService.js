import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../backend/firebaseConfig';

// Function to add a claimed reward to Firestore
export const addClaimedReward = async (reward) => {
  try {
    const claimedRewardsCollection = collection(db, 'claimedRewards');
    const docRef = await addDoc(claimedRewardsCollection, reward);
    return docRef; // Return the document reference
  } catch (error) {
    console.error('Error adding claimed reward:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Function to get all claimed rewards from Firestore
export const getClaimedRewards = async () => {
  try {
    const claimedRewardsCollection = collection(db, 'claimedRewards');
    const claimedRewardsSnapshot = await getDocs(claimedRewardsCollection);

    const claimedRewards = claimedRewardsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return claimedRewards;
  } catch (error) {
    console.error('Error fetching claimed rewards:', error);
    return [];
  }
};

// Function to update the status of a claimed reward in Firestore
export const updateClaimedRewardStatus = async (rewardId, status) => {
  try {
    const rewardDoc = doc(db, 'claimedRewards', rewardId);
    await updateDoc(rewardDoc, { status });
  } catch (error) {
    console.error('Error updating claimed reward status:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};