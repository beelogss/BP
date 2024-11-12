import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { getAvailableRewards } from './rewardsService'; // Fetch from Firestore
import RewardActionSheet from '../components/RewardActionSheet'; // Import the centralized ActionSheet
import { FontAwesome6 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SheetManager } from 'react-native-actions-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // Import UserContext

const AllRewardsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [rewards, setRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const points = user ? user.points : 0;

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    const availableRewards = await getAvailableRewards();
    setRewards(availableRewards);
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
        <View style={{ flexDirection: 'row', alignItems: 'center', bottom: hp('0.5%'), marginLeft: hp('0.5%')}}>
        <Image
            style={{height: hp('1.5%'), width: wp('3%'), }}
            source={require('../assets/images/points.png')}
          />
        <Text style={styles.rewardPoints}>: {item.points}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>All Rewards</Text>
        <Text style={styles.points}>Available Points:</Text>
        <View style={styles.pointsContainer}>
          <Image
            style={styles.pointsImage}
            source={require('../assets/images/points.png')}
          />
            <Text style={{ fontSize: hp('2%'), fontFamily: 'Poppins-Bold', color: '#83951c' }}>: {points}</Text>
          </View>
      </View>
      <FlatList
        data={rewards}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={2} // Set the number of columns to 2
        columnWrapperStyle={styles.columnWrapper} // Add this line to style the columns
        key={2} // Add this line to force a fresh render when the number of columns changes
      />

      <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-all-rewards-screen" user={user}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'whitesmoke',
    paddingTop: hp('5%'),
    flexDirection: 'column',
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
  pointsImage: {
    marginRight: wp('1%'),
    marginLeft: wp('1%'),
    marginTop: hp('0.5%'),
    height: hp('2%'),
    width: wp('4%'),
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
    width: wp('42%'), // Adjust the width to fit two columns
    height: hp('25%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
    margin: wp('2%'), // Add margin to separate the items
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
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    marginTop: hp('0.5%'),
    marginLeft: wp('.5%'),
  },
  columnWrapper: {
    justifyContent: 'space-between', // Add this line to space out the columns
  },
});

export default AllRewardsScreen;