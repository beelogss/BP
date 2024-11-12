import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const LeaderboardScreen = ({ navigation }) => {
  const leaderboardData = [
    { id: 1, name: 'Gerard', points: 150, prize: '$100', avatar: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Miano', points: 120, prize: '$60', avatar: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Lopez', points: 100, prize: '$40', avatar: 'https://via.placeholder.com/100' },
    { id: 4, name: 'Leyd', points: 90 },
    { id: 5, name: 'Lie', points: 90 },
    { id: 6, name: 'Villo', points: 80 },
    { id: 7, name: 'Ward', points: 80 },
    { id: 8, name: 'Charlie Davis', points: 80 },
    { id: 9, name: 'Charlie Davis', points: 80 },
    { id: 10, name: 'Charlie Davis', points: 80 },
  ];

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
    <SafeAreaProvider>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Leaderboard</Text>
        <View style={styles.podiumContainer}>
          {/* Second Place */}
          <View style={styles.podiumWrapper}>
            <Image source={{ uri: leaderboardData[1].avatar }} style={styles.avatar} />
            <Text style={styles.nameText}>{leaderboardData[1].name}</Text>
            <View style={[styles.podiumItem, styles.secondPlace]}>
              <Text style={styles.rankText}>2nd</Text>
              <Text style={styles.pointsText}>{leaderboardData[1].points} PTS - {leaderboardData[1].prize}</Text>
            </View>
          </View>
          {/* First Place */}
          <View style={styles.podiumWrapper}>
            <Image source={{ uri: leaderboardData[0].avatar }} style={styles.avatar} />
            <Text style={styles.nameText}>{leaderboardData[0].name}</Text>
            <View style={[styles.podiumItem, styles.firstPlace]}>
              <Text style={styles.rankText}>1st</Text>
              <Text style={styles.pointsText}>{leaderboardData[0].points} PTS - {leaderboardData[0].prize}</Text>
            </View>
          </View>
          {/* Third Place */}
          <View style={styles.podiumWrapper}>
            <Image source={{ uri: leaderboardData[2].avatar }} style={styles.avatar} />
            <Text style={styles.nameText}>{leaderboardData[2].name}</Text>
            <View style={[styles.podiumItem, styles.thirdPlace]}>
              <Text style={styles.rankText}>3rd</Text>
              <Text style={styles.pointsText}>{leaderboardData[2].points} PTS - {leaderboardData[2].prize}</Text>
            </View>
          </View>
        </View>

        <View style={styles.leaderboardContainer}>
          {leaderboardData.slice(3).map((user) => (
            <View key={user.id} style={styles.leaderboardItem}>
              <Text style={styles.leaderboardName}>{user.name}</Text>
              <Text style={styles.leaderboardPoints}>{user.points} points</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'whitesmoke',
  },
  title: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  podiumContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginBottom: hp('3%'),
  },
  podiumWrapper: {
    alignItems: 'center',
    width: wp('25%'),
    marginHorizontal: wp('1%'),
  },
  podiumItem: {
    alignItems: 'center',
    padding: hp('1.5%'),
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    width: '100%',
  },
  firstPlace: {
    backgroundColor: '#fde9a9',
    height: hp('25%'),
    justifyContent: 'flex-end',
  },
  secondPlace: {
    backgroundColor: '#e5e5e5',
    height: hp('20%'),
    justifyContent: 'flex-end',
  },
  thirdPlace: {
    backgroundColor: '#d3bdbd',
    height: hp('18%'),
    justifyContent: 'flex-end',
  },
  avatar: {
    width: wp('15%'),
    height: wp('15%'),
    borderRadius: wp('7.5%'),
    marginBottom: hp('0.5%'),
  },
  nameText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    marginBottom: hp('0.5%'),
  },
  rankText: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  pointsText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#7a9b57',
    marginTop: hp('0.5%'),
  },
  leaderboardContainer: {
    marginVertical: hp('3%'),
    padding: hp('2%'),
    backgroundColor: '#e5eeda',
    borderRadius: wp('5%'),
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#bdd299',
  },
  leaderboardName: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  leaderboardPoints: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#7a9b57',
  },
});

export default LeaderboardScreen;
