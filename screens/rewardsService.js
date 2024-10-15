// rewardsService.js
const rewards = [
    { id: 1, name: 'Long Bond Paper', points: 50, image: require('../assets/images/longbondpaper.jpg') },
    { id: 2, name: 'Long Folder', points: 30, image: require('../assets/images/longfolder.jpg') },
    { id: 3, name: 'Notebook', points: 100, image: require('../assets/images/notebook.jpg') },
    { id: 4, name: 'Permanent Marker', points: 100, image: require('../assets/images/permanentmarker.jpg') },
    { id: 5, name: 'Short Folder', points: 100, image: require('../assets/images/shortfolder.jpg') },
    { id: 6, name: 'Whiteboard Marker', points: 100, image: require('../assets/images/whiteboardmarker.jpg') }
  ];
  
  
  // Function to get available rewards
  export const getAvailableRewards = async () => {
    // Simulate API call; replace with actual API logic
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(rewards);
      }, 1000);
    });
  };
  
  // Function to claim a reward
  export const claimReward = async (rewardId) => {
    // Simulate claiming reward; replace with actual API logic
    const reward = rewards.find((r) => r.id === rewardId);
    if (reward) {
      // Logic to deduct points from user and mark reward as claimed
      return true; // Return true if claim is successful
    }
    return false; // Return false if claim fails
  };
  