import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getAvailableRewards } from './rewardsService'; // Fetch from Firestore
import RewardActionSheet from '../components/RewardActionSheet'; // Import the centralized ActionSheet
import { FontAwesome6 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SheetManager } from 'react-native-actions-sheet';

const RewardsScreen = ({ navigation }) => {
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
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Rewards</Text>
        <Text style={{ fontSize: hp('1.2%'), fontFamily: 'Poppins-SemiBold', color: '#7a9b57' }}>Available Points:</Text>
        <View style={styles.pointsContainer}>
          <FontAwesome6 name="coins" size={wp('5%')} color="#7a9b57" style={styles.icon} />
          <Text style={{ fontSize: hp('2%'), fontFamily: 'Poppins-Regular', color: '#7a9b57' }}>{points}</Text>
        </View>
      </View>
      <Text style={styles.popularRewards}>Popular Rewards</Text>
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
      
      {/* Button to navigate to ClaimedRewardsScreen */}
      <TouchableOpacity
        style={styles.claimedRewardsButton}
        onPress={() => navigation.navigate('ClaimedRewards')}
      >
        <Text style={styles.claimedRewardsButtonText}>View Claimed Rewards</Text>
      </TouchableOpacity>

      <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-rewards-screen" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingTop: hp('5%'),
  },
  headerContainer: {
    marginBottom: hp('2%'),
    backgroundColor: '#e5eeda',
    padding: wp('3%'),
    borderRadius: wp('5%'),
    justifyContent: 'space-between',
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
  },
  claimedRewardsButton: {
    bottom: hp('10%'),
    padding: hp('1.5%'),
    backgroundColor: '#83951c',
    borderRadius: 5,
    alignItems: 'center',
  },
  claimedRewardsButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default RewardsScreen;