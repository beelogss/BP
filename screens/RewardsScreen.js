import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Button, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAvailableRewards, claimReward } from './rewardsService'; // Import the service for fetching and claiming rewards
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
const RewardsScreen = ({ navigation }) => {
  const [rewards, setRewards] = useState([]);
  const [points, setPoints] = useState(0); // Assume you have a way to get user points
  const [selectedReward, setSelectedReward] = useState(null); // State for selected reward
  const actionSheetRef = useRef(null); // Create a ref using useRef

  useEffect(() => {
    fetchRewards();
    fetchUserPoints(); // Fetch user points on component mount
  }, []);

  const fetchRewards = async () => {
    const availableRewards = await getAvailableRewards(); // Fetch rewards from the service
    setRewards(availableRewards);
  };

  const fetchUserPoints = () => {
    // Fetch user points logic here
    setPoints(100); // Example points value; replace with actual logic
  };


  const handleRewardPress = (reward) => {
    setSelectedReward(reward); // Set the selected reward
    SheetManager.show('reward-details'); // Show the action sheet
  };

  const renderRewardItem = ({ item }) => (
    <TouchableOpacity style={styles.rewardItem} onPress={() => handleRewardPress(item)}>
      <Image source={typeof item.image === 'string' ? { uri: item.image } : item.image} style={styles.rewardImage} />
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName}>{item.name}</Text>
        <Text style={styles.rewardPoints}>{item.points} points</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Rewards</Text>
        <Text style={styles.points}>Available Points:</Text>
        <View style={styles.pointsContainer}>
          <FontAwesome6 name="coins" size={wp('5%')} color="#7a9b57" style={styles.icon} />
          <Text style={{fontSize: hp('2%'), fontFamily: 'Poppins-Regular',color: '#7a9b57',}}>{points}</Text>
        </View>
      </View>
      <Text style={{
        fontSize: hp('2.8%'),
        fontFamily: 'Poppins-Bold',
        color: '#455e14',
      }}>Popular Rewards</Text>
      <FlatList
        data={rewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        showsHorizontalScrollIndicator={false} // Hide horizontal scroll indicator
        horizontal={true}
      />

      <ActionSheet id="reward-details" ref={actionSheetRef}>
        <View style={styles.actionSheetContent}>
          {selectedReward && (
            <>
              <View style={styles.actionSheetHeader}>
                <TouchableOpacity onPress={() => SheetManager.hide('reward-details')}>
                  <Feather name="x" size={wp('10%')} color="#455e14" />
                </TouchableOpacity>
              </View>
              <Image source={typeof selectedReward.image === 'string' ? { uri: selectedReward.image } : selectedReward.image} style={styles.actionSheetImage} />
              <Text style={styles.actionSheetTitle}>{selectedReward.name}</Text>
              <Text style={styles.actionSheetPoints}>{selectedReward.points} points</Text>
              <TouchableOpacity
                style={[styles.actionSheetButton, selectedReward.points > points && styles.disabledButton]}
                onPress={() => handleClaimReward(selectedReward.id)}
                disabled={selectedReward.points > points}
              >
                <Text style={styles.sheetButtonText}>
                  Claim
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ActionSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    paddingHorizontal: wp('7%'),
    paddingTop: hp('5%'),
  },
  headerContainer: {
    marginBottom: hp('2%'),
    backgroundColor: '#e5eeda',
    padding: wp('3%'),
    borderRadius: wp('5%'),
    marginVertical: hp('2%'),
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
    elevation: 2,
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    borderRadius: wp('8%'),
    width: wp('50%'),
    height: hp('25%'),
    marginRight: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
  },
  rewardImage: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: 10,
    resizeMode: 'contain',
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  rewardInfo: {
    flex: 1,
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
  actionSheetContent: {
    padding: hp('2%'),
  },
  actionSheetImage: {
    width: wp('80%'),
    height: hp('30%'),
    borderRadius: 10,
    marginBottom: wp('4%'),
    resizeMode: 'contain',
    borderColor: '#455e14',
    borderWidth: 1,
    alignSelf: 'center',
  },
  actionSheetTitle: {
    fontSize: hp('3.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  actionSheetPoints: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('10%'),
  },
  actionSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionSheetButton: {
    backgroundColor: '#83951c',
    padding: hp('2%'),
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  disabledButton: {
    backgroundColor: '#a9a9a9',
  },
  sheetButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default RewardsScreen;