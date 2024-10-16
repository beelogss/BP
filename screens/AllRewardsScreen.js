import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getAvailableRewards } from './rewardsService'; // Fetch from Firestore
import RewardActionSheet from '../components/RewardActionSheet'; // Import the centralized ActionSheet
import { FontAwesome6 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SheetManager } from 'react-native-actions-sheet';

const AllRewardsScreen = ({ navigation }) => {
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    fetchRewards();
    fetchUserPoints();
  }, []);

  const fetchRewards = async () => {
    const availableRewards = await getAvailableRewards();
    setRewards(availableRewards);
  };

  const fetchUserPoints = () => {
    // Fetch user points logic here
    setPoints(100);
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    SheetManager.show('reward-details-all-rewards-screen');
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
        <Text style={styles.header}>All Rewards</Text>
        <Text style={styles.points}>Available Points:</Text>
        <View style={styles.pointsContainer}>
          <FontAwesome6 name="coins" size={wp('5%')} color="#7a9b57" style={styles.icon} />
          <Text style={{ fontSize: hp('2%'), fontFamily: 'Poppins-Regular', color: '#7a9b57' }}>{points}</Text>
        </View>
      </View>
      <FlatList
        data={rewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />

      <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-all-rewards-screen" />
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
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('3%'),
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
    width: wp('80%'),
    height: hp('25%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
    alignSelf: 'center',
  },
  rewardImage: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  rewardInfo: {
    marginLeft: hp('1%'),
  },
  rewardName: {
    fontSize: hp('1.7%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  rewardPoints: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#83951c',
  },
});

export default AllRewardsScreen;