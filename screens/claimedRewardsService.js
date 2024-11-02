// import { collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { db } from '../backend/firebaseConfig';

// // Function to add a claimed reward to Firestore
// export const addClaimedReward = async (reward) => {
//   try {
//     const claimedRewardsCollection = collection(db, 'claimedRewards');
//     const docRef = await addDoc(claimedRewardsCollection, reward);
//     return docRef; // Return the document reference
//   } catch (error) {
//     console.error('Error adding claimed reward:', error);
//     throw error; // Rethrow the error to handle it in the calling function
//   }
// };

// // Function to get all claimed rewards from Firestore
// export const getClaimedRewards = async () => {
//   try {
//     const claimedRewardsCollection = collection(db, 'claimedRewards');
//     const claimedRewardsSnapshot = await getDocs(claimedRewardsCollection);

//     const claimedRewards = claimedRewardsSnapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     return claimedRewards;
//   } catch (error) {
//     console.error('Error fetching claimed rewards:', error);
//     return [];
//   }
// };

// // Function to update the status of a claimed reward in Firestore
// export const updateClaimedRewardStatus = async (rewardId, status) => {
//   try {
//     const rewardDoc = doc(db, 'claimedRewards', rewardId);
//     await updateDoc(rewardDoc, { status });
//   } catch (error) {
//     console.error('Error updating claimed reward status:', error);
//     throw error; // Rethrow the error to handle it in the calling function
//   }
// };
import { collection, query, where, addDoc, getDocs, updateDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';
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

// Function to get all claimed rewards for a specific user from Firestore
export const getClaimedRewards = async (studentNumber) => {
  try {
    const claimedRewardsCollection = collection(db, 'claimedRewards');
    const q = query(claimedRewardsCollection, where('studentNumber', '==', studentNumber));
    const claimedRewardsSnapshot = await getDocs(q);

    const claimedRewards = claimedRewardsSnapshot.docs.map((doc) => {
      const rewardData = doc.data();
      return {
        id: doc.id,
        image: { uri: rewardData.imageUrl },
        ...rewardData,
      };
    });

    return claimedRewards;
  } catch (error) {
    console.error('Error fetching claimed rewards:', error);
    return [];
  }
};

// Function to update the status of a claimed reward in Firestore
export const updateClaimedRewardStatus = async (rewardId, status) => {
  try {
    const rewardDocRef = doc(db, 'claimedRewards', rewardId);
    const rewardDoc = await getDoc(rewardDocRef);

    if (!rewardDoc.exists()) {
      console.error(`No document to update: ${rewardDocRef.path}`);
      throw new Error(`No document to update: ${rewardDocRef.path}`);
    }

    await updateDoc(rewardDocRef, { status });
    console.log(`Document ${rewardDocRef.path} updated successfully`);
  } catch (error) {
    console.error('Error updating claimed reward status:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};

// Function to delete a claimed reward from Firestore
export const deleteClaimedReward = async (rewardId) => {
  try {
    const rewardDocRef = doc(db, 'claimedRewards', rewardId);
    await deleteDoc(rewardDocRef);
    console.log(`Document ${rewardDocRef.path} deleted successfully`);
  } catch (error) {
    console.error('Error deleting claimed reward:', error);
    throw error; // Rethrow the error to handle it in the calling function
  }
};