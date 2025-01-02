import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Image, ToastAndroid, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import axios from 'axios';
import { useBackHandler } from '../hooks/useBackHandler';

const getOrdinal = (place) => {
  switch(place) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

const TopThreeItem = ({ user, place }) => {
  const getPlaceColor = () => {
    switch(place) {
      case 1: return ['#ffd700', '#fff5cc']; // Gold
      case 2: return ['#c0c0c0', '#f5f5f5']; // Silver
      case 3: return ['#cd7f32', '#ffddc1']; // Bronze
      default: return ['#ffffff', '#f0f0f0'];
    }
  };

  const [primaryColor, secondaryColor] = getPlaceColor();

  return (
    <Animated.View 
      entering={FadeInDown.delay(place * 200)}
      style={[
        styles.podiumWrapper,
        place === 1 && { marginTop: -hp('4%') }
      ]}
    >
      <View style={[styles.crownContainer, { opacity: place === 1 ? 1 : 0 }]}>
        <MaterialCommunityIcons name="crown" size={hp('4%')} color="#ffd700" />
      </View>
      <Image 
        source={{ uri: user.avatar }} 
        style={[styles.avatar, { borderColor: primaryColor }]} 
      />
      <View style={[styles.podiumItem, { backgroundColor: secondaryColor }]}>
        <Text style={styles.nameText} numberOfLines={1}>{user.name}</Text>
        <View style={[styles.medalContainer, { backgroundColor: primaryColor }]}>
          <MaterialCommunityIcons 
            name="medal" 
            size={hp('2.5%')} 
            color="#fff" 
          />
          <Text style={styles.rankText}>{place}{getOrdinal(place)}</Text>
        </View>
        <View style={styles.bottleInfoContainer}>
          <MaterialCommunityIcons 
            name="bottle-soda" 
            size={hp('2.5%')} 
            color="#83951c" 
          />
          <Text style={styles.bottleText}>{user.bottleCount}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const LeaderboardItem = ({ user, index }) => (
  <Animated.View 
    entering={FadeInUp.delay(index * 100)}
    style={styles.leaderboardItem}
  >
    <View style={styles.rankContainer}>
      <Text style={styles.leaderboardPosition}>{index + 4}</Text>
    </View>
    <Image source={{ uri: user.avatar }} style={styles.leaderboardImage} />
    <View style={styles.userInfoContainer}>
      <Text style={styles.leaderboardName} numberOfLines={1}>{user.name}</Text>
      <View style={styles.bottleCountContainer}>
        <MaterialCommunityIcons 
          name="bottle-soda-outline" 
          size={hp('2%')} 
          color="#83951c" 
        />
        <Text style={styles.bottleCountText}>{user.bottleCount} bottles</Text>
      </View>
    </View>
  </Animated.View>
);

const LeaderboardScreen = ({ navigation }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/leaderboard');
      if (response.data.success) {
        setLeaderboardData(response.data.leaderboard);
      } else {
        ToastAndroid.show('Failed to fetch leaderboard', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
      ToastAndroid.show('Error fetching leaderboard', ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  useBackHandler(navigation);

  // Sort the leaderboard data by bottle count in descending order
  const sortedLeaderboardData = leaderboardData.sort((a, b) => b.bottleCount - a.bottleCount);

  // Separate the top 3 users from the rest
  const top3Users = sortedLeaderboardData.slice(0, 3);
  const restOfUsers = sortedLeaderboardData.slice(3);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#83951c" />
        <Text style={styles.loadingText}>Loading leaderboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.title}>Leaderboard</Text>
      <Text style={styles.subtitle}>Top Users</Text>
      
      <View style={styles.podiumContainer}>
        {top3Users.map((user, index) => (
          <TopThreeItem 
            key={user.studentNumber} 
            user={user} 
            place={index + 1} 
          />
        ))}
      </View>
      <Text style={styles.subtitle}>Others</Text>
      <View style={styles.leaderboardContainer}>
      
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 0.3 }]}>Rank</Text>
          <Text style={[styles.tableHeaderText, { flex: 0.7, textAlign: 'left' }]}>Name</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          {restOfUsers.map((user, index) => (
            <LeaderboardItem 
              key={user.studentNumber} 
              user={user} 
              index={index} 
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: wp('5%'),
    paddingTop: hp('5%'),
  },
  title: {
    fontSize: hp('3.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
    textAlign: 'center',
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: hp('4%'),
    paddingHorizontal: wp('2%'),
  },
  podiumWrapper: {
    alignItems: 'center',
    width: wp('28%'),
    marginHorizontal: wp('1%'),
  },
  crownContainer: {
    marginBottom: -hp('2%'),
    zIndex: 1,
  },
  avatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    borderWidth: 3,
    marginBottom: -hp('2.5%'),
    zIndex: 1,
  },
  podiumItem: {
    width: '100%',
    padding: wp('3%'),
    paddingTop: hp('4%'),
    borderRadius: wp('4%'),
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  medalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('2%'),
    borderRadius: wp('4%'),
    marginVertical: hp('1%'),
  },
  nameText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  rankText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    marginLeft: wp('1%'),
  },
  bottleInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4e8',
    padding: wp('2%'),
    borderRadius: wp('3%'),
  },
  bottleText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    marginLeft: wp('1%'),
  },
  leaderboardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flex: 1,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: '#bdd299',
    marginBottom: hp('2%'),
  },
  tableHeaderText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: wp('3%'),
    marginBottom: hp('1%'),
    borderRadius: wp('3%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  rankContainer: {
    width: wp('8%'),
    height: wp('8%'),
    borderRadius: wp('4%'),
    backgroundColor: '#f0f4e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp('3%'),
  },
  leaderboardPosition: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
  },
  leaderboardImage: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: wp('6%'),
    marginRight: wp('3%'),
    borderWidth: 2,
    borderColor: '#f0f4e8',
  },
  userInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  leaderboardName: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginBottom: hp('0.5%'),
  },
  bottleCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottleCountText: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
    marginLeft: wp('1%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    marginTop: hp('1%'),
  },
});

export default LeaderboardScreen;