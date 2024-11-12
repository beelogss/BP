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
  const [selectedReward, setSelectedReward] = useState(null);
  const points = user ? user.points : 0;

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    const availableRewards = await getAvailableRewards();
    setRewards(availableRewards.slice(0, 3)); // Show only 3 rewards for this screen
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
        <View style={{ flexDirection: 'row', alignItems: 'center', bottom: hp('0.5%'), marginLeft: hp('0.5%') }}>
          <Image
            style={{ height: hp('1.5%'), width: wp('3%') }}
            source={require('../assets/images/points.png')}
          />
          <Text style={styles.rewardPoints}>{item.points}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.header}>Rewards</Text>
        <View style={styles.headerRow}>
          <View style={styles.headerContainer}>
            <Image
              style={styles.pointsImage}
              source={require('../assets/images/points.png')}
            />
            <View style={styles.pointsContainer}>
              <Text style={styles.points}>{points} <Text style={{ fontSize: hp('1.5%'), fontFamily: 'Poppins-SemiBold' }}>points</Text></Text>
              <Text style={{ bottom: hp('1.3%'), fontSize: hp('1.3%'), fontFamily: 'Poppins-SemiBold', color: '#455e14' }}>Total Points Earned</Text>
              <View style={styles.horizontalLine1} />
            </View>
            
          </View>
          <Pressable
            style={styles.claimedRewardsButton}
            onPress={() => navigation.navigate('ClaimedRewards')}
          >
            <MaterialCommunityIcons name="gift-open-outline" size={wp('6%')} color="#7a9b57" style={{ justifyContent: 'center' }} />
            <Text style={styles.claimedRewardsButtonText}>View Rewards</Text>
          </Pressable>
        </View>
      </View>
      {/* Popular Rewards */}
      <View style={styles.RewardContainer}>
        <Text style={styles.popularRewards}>Rewards Catalog</Text>
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

        <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-rewards-screen" user={user} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'whitesmoke',
    paddingTop: hp('5%'),
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'column',
    paddingHorizontal: wp('4%'),
    paddingVertical: wp('1%'),
    backgroundColor: '#bdd299',
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
  },
  header: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginTop: hp('3%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  headerContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: hp('10%'),
    padding: wp('3%'),
    borderRadius: wp('4%'),
    marginRight: wp('2%'),
    flexDirection: 'row',
  },
  points: {
    fontSize: hp('2.8%'), 
    fontFamily: 'Poppins-Bold', 
    color: '#83951c' 
  },
  pointsContainer: {
    flexDirection: 'column',
    marginLeft: wp('2%'),
  },
  pointsImage: {
    marginTop: hp('1%'),
    height: hp('3.5%'),
    width: wp('7%'),
  },
  horizontalLine1: {
    height: hp('.1%'), 
    backgroundColor: '#bdd299', 
    width: wp('37%'),
    right: wp('8%'),
  },
  claimedRewardsButton: {
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    alignItems: 'center',
    width: wp('45%'),
    height: hp('10%'),
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
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    marginTop: hp('0.5%'),
    marginLeft: wp('.5%'),
  },
  popularRewards: {
    fontSize: hp('2.5%'),
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
});

export default RewardsScreen;