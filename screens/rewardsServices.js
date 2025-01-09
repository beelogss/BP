import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../backend/firebase/firebaseConfig';
// Function to get available rewards from Firestore
export const getAvailableRewards = async () => {
  try {
    const rewardsCollection = collection(db, 'rewards');
    const rewardsSnapshot = await getDocs(rewardsCollection);

    const rewards = rewardsSnapshot.docs.map((doc) => {
      const rewardData = doc.data();
      
      return {
        id: doc.id,
        name: rewardData.reward_name,
        points: rewardData.points,
        image: { uri: rewardData.image_url },  // Use the full URL directly
        stock: rewardData.stock,
      };
    });

    return rewards;
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return [];
  }
};

// Function to update reward stock in Firestore
export const updateRewardStock = async (rewardId, newStock) => {
  try {
    const rewardDoc = doc(db, 'rewards', rewardId);
    await updateDoc(rewardDoc, { stock: newStock });
  } catch (error) {
    console.error('Error updating reward stock:', error);
  }
};