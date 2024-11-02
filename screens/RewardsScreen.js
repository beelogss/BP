// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
// import { getAvailableRewards } from './rewardsService'; // Fetch from Firestore
// import RewardActionSheet from '../components/RewardActionSheet'; // Import the centralized ActionSheet
// import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { SheetManager } from 'react-native-actions-sheet';

// const RewardsScreen = ({ navigation }) => {
//   const [rewards, setRewards] = useState([]);
//   const [points, setPoints] = useState(0);
//   const [selectedReward, setSelectedReward] = useState(null);

//   useEffect(() => {
//     fetchRewards();
//     fetchUserPoints();
//   }, []);

//   const fetchRewards = async () => {
//     const availableRewards = await getAvailableRewards();
//     setRewards(availableRewards.slice(0, 3)); // Show only 3 rewards for this screen
//   };

//   const fetchUserPoints = () => {
//     // Fetch user points logic here
//     setPoints(100);
//   };

//   const handleRewardPress = (reward) => {
//     setSelectedReward(reward);
//     SheetManager.show('reward-details-rewards-screen');
//   };

//   const renderRewardItem = ({ item }) => (
//     <TouchableOpacity style={styles.rewardItem} onPress={() => handleRewardPress(item)}>
//       <Image source={item.image} style={styles.rewardImage} />
//       <View style={styles.rewardInfo}>
//         <Text style={styles.rewardName}>{item.name}</Text>
//         <Text style={styles.rewardPoints}>BP: {item.points}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.topContainer}>
//         <View style={styles.headerContainer}>
//           <Text style={styles.header}>Rewards</Text>
//           <Text style={{ fontSize: hp('1.2%'), fontFamily: 'Poppins-SemiBold', color: '#7a9b57' }}>Available Points:</Text>
//           <View style={styles.pointsContainer}>
//             <FontAwesome6 name="coins" size={wp('5%')} color="#7a9b57" style={styles.icon} />
//             <Text style={{ fontSize: hp('2%'), fontFamily: 'Poppins-Regular', color: '#7a9b57' }}>{points}</Text>
//           </View>
//         </View>
//       </View>
//       {/* Popular Rewards */}
//       <View style={styles.RewardContainer}>
//         <Text style={styles.popularRewards}>Rewards</Text>
//         <View style={styles.rewardContainer}>
//           <TouchableOpacity
//             style={styles.seeAllButton}
//             onPress={() => navigation.navigate('AllRewards')}
//           >
//             <Text style={styles.seeAllText}>See All</Text>
//           </TouchableOpacity>
//           <FlatList
//             data={rewards}
//             renderItem={renderRewardItem}
//             keyExtractor={(item) => item.id.toString()}
//             horizontal={true}
//             showsHorizontalScrollIndicator={false}
//           />
//         </View>

//         {/* Button to navigate to ClaimedRewardsScreen */}
//         <Pressable
//           style={styles.claimedRewardsButton}
//           onPress={() => navigation.navigate('ClaimedRewards')}
//         >
//           <MaterialCommunityIcons name="gift-open-outline" size={wp('6%')} color="#7a9b57" style={{ justifyContent: 'center' }} />
//           <Text style={styles.claimedRewardsButtonText}>View Rewards</Text>
//         </Pressable>

//         <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-rewards-screen" />
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f3f8',
//     paddingTop: hp('5%'),
//   },
//   topContainer: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: wp('4%'),
//     paddingVertical: wp('.5%'),
//     backgroundColor: '#bdd299',
//     borderBottomLeftRadius: wp('6%'),
//     borderBottomRightRadius: wp('6%'),
//     zIndex: 1,
//   },
//   headerContainer: {
//     marginBottom: hp('1%'),
//     backgroundColor: '#e5eeda',
//     width: '100%',
//     height: hp('12%'),
//     padding: wp('3%'),
//     borderRadius: wp('5%'),
//     justifyContent: 'space-between',
//     zIndex: 2,
//     top: hp('7%'),
//   },
//   header: {
//     fontSize: hp('3%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
//     textAlign: 'center',
//   },
//   pointsContainer: {
//     flexDirection: 'row',
//   },
//   points: {
//     fontSize: hp('1.3%'),
//     fontFamily: 'Poppins-Medium',
//     color: '#7a9b57',
//   },
//   icon: {
//     marginRight: hp('1%'),
//   },
//   RewardContainer: {
//     top: hp('16%'),
//   },
//   rewardContainer: {
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     height: hp('30%'),
//     borderRadius: wp('3%'),
//   },
//   rewardItem: {
//     flexDirection: 'column',
//     padding: wp('3%'),
//     borderColor: '#ddd',
//     backgroundColor: 'white',
//     borderRadius: wp('8%'),
//     width: wp('42%'),
//     height: hp('23.5%'),
//     marginRight: hp('2%'),
//     borderWidth: 1,
//     borderColor: '#7a9b57',
//   },
//   rewardImage: {
//     width: wp('35%'),
//     height: hp('15%'),
//     borderRadius: 10,
//     resizeMode: 'contain',
//     alignSelf: 'center',
//     backgroundColor: 'white',
//     borderBottomWidth: 5,
//     borderColor: '#455e14',
//   },
//   rewardInfo: {
//     backgroundColor: '#f1f1f1',
//     width: wp('42%'),
//     height: hp('7.1%'),
//     borderBottomRightRadius: wp('8%'),
//     borderBottomLeftRadius: wp('8%'),
//     alignSelf: 'center',
//     paddingLeft: wp('3%'),
//     borderWidth: 1,
//     borderColor: '#7a9b57',
//     justifyContent: 'center',
//   },
//   rewardName: {
//     fontSize: hp('1.6%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
//   },
//   rewardPoints: {
//     fontSize: hp('1.5%'),
//     fontFamily: 'Poppins-SemiBold',
//     color: '#83951c',
//   },
//   popularRewards: {
//     fontSize: hp('2.8%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
//   },
//   seeAllButton: {
//     // alignItems: 'center',
//   },
//   seeAllText: {
//     fontSize: hp('2%'),
//     color: '#83951c',
//     fontFamily: 'Poppins-Bold',
//     textAlign: 'right',
//     marginRight: hp('1.5%'),
//   },
//   claimedRewardsButton: {
//     top: hp('2%'),
//     backgroundColor: 'white',
//     borderRadius: wp('4%'),
//     alignItems: 'center',
//     width: wp('45%'),
//     height: hp('11%'),
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   claimedRewardsButtonText: {
//     color: '#455e14',
//     fontSize: hp('1.8%'),
//     fontFamily: 'Poppins-SemiBold',
//     marginLeft: hp('0.5%'),
//     paddingTop: hp('0.7%'),
//     textAlign: 'center',
//   },
// });

// export default RewardsScreen;

import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { getAvailableRewards } from './rewardsService'; // Fetch from Firestore
import RewardActionSheet from '../components/RewardActionSheet'; // Import the centralized ActionSheet
import { FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SheetManager } from 'react-native-actions-sheet';
import { UserContext } from '../context/UserContext'; // Import UserContext

const RewardsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    fetchRewards();
    fetchUserPoints();
  }, []);

  const fetchRewards = async () => {
    const availableRewards = await getAvailableRewards();
    setRewards(availableRewards.slice(0, 3)); // Show only 3 rewards for this screen
  };

  const fetchUserPoints = () => {
    // Fetch user points logic here
    setPoints(100);
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    SheetManager.show('reward-details-rewards-screen');
  };

  const renderRewardItem = ({ item }) => (
    <TouchableOpacity style={styles.rewardItem} onPress={() => handleRewardPress(item)}>
      <Image source={item.image} style={styles.rewardImage} />
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardPoints}>BP: {item.points}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Rewards</Text>
          <Text style={{ fontSize: hp('1.2%'), fontFamily: 'Poppins-SemiBold', color: '#7a9b57' }}>Available Points:</Text>
          <View style={styles.pointsContainer}>
            <FontAwesome6 name="coins" size={wp('5%')} color="#7a9b57" style={styles.icon} />
            <Text style={{ fontSize: hp('2%'), fontFamily: 'Poppins-Regular', color: '#7a9b57' }}>{points}</Text>
          </View>
        </View>
      </View>
      {/* Popular Rewards */}
      <View style={styles.RewardContainer}>
        <Text style={styles.popularRewards}>Rewards</Text>
        <View style={styles.rewardContainer}>
          <TouchableOpacity
            style={styles.seeAllButton}
            onPress={() => navigation.navigate('AllRewards')}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
          <FlatList
            data={rewards}
            renderItem={renderRewardItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Button to navigate to ClaimedRewardsScreen */}
        <Pressable
          style={styles.claimedRewardsButton}
          onPress={() => navigation.navigate('ClaimedRewards')}
        >
          <MaterialCommunityIcons name="gift-open-outline" size={wp('6%')} color="#7a9b57" style={{ justifyContent: 'center' }} />
          <Text style={styles.claimedRewardsButtonText}>View Rewards</Text>
        </Pressable>

        <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-rewards-screen" user={user} />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f3f8',
    paddingTop: hp('5%'),
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('.5%'),
    backgroundColor: '#bdd299',
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
    zIndex: 1,
  },
  headerContainer: {
    marginBottom: hp('1%'),
    backgroundColor: '#e5eeda',
    width: '100%',
    height: hp('12%'),
    padding: wp('3%'),
    borderRadius: wp('5%'),
    justifyContent: 'space-between',
    zIndex: 2,
    top: hp('7%'),
  },
  header: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
  },
  points: {
    fontSize: hp('1.3%'),
    fontFamily: 'Poppins-Medium',
    color: '#7a9b57',
  },
  icon: {
    marginRight: hp('1%'),
  },
  RewardContainer: {
    top: hp('16%'),
  },
  rewardContainer: {
    justifyContent: 'center',
    backgroundColor: 'white',
    height: hp('30%'),
    borderRadius: wp('3%'),
  },
  rewardItem: {
    flexDirection: 'column',
    padding: wp('3%'),
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: wp('8%'),
    width: wp('42%'),
    height: hp('23.5%'),
    marginRight: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
  },
  rewardImage: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 5,
    borderColor: '#455e14',
  },
  rewardInfo: {
    backgroundColor: '#f1f1f1',
    width: wp('42%'),
    height: hp('7.1%'),
    borderBottomRightRadius: wp('8%'),
    borderBottomLeftRadius: wp('8%'),
    alignSelf: 'center',
    paddingLeft: wp('3%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
    justifyContent: 'center',
  },
  rewardName: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  rewardPoints: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#83951c',
  },
  popularRewards: {
    fontSize: hp('2.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  seeAllButton: {
    // alignItems: 'center',
  },
  seeAllText: {
    fontSize: hp('2%'),
    color: '#83951c',
    fontFamily: 'Poppins-Bold',
    textAlign: 'right',
    marginRight: hp('1.5%'),
  },
  claimedRewardsButton: {
    top: hp('2%'),
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    alignItems: 'center',
    width: wp('45%'),
    height: hp('11%'),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  claimedRewardsButtonText: {
    color: '#455e14',
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    marginLeft: hp('0.5%'),
    paddingTop: hp('0.7%'),
    textAlign: 'center',
  },
});

export default RewardsScreen;