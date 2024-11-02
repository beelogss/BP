import React, {useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

const LeaderboardScreen = ({ navigation }) => {
  const leaderboardData = [
    { id: 1, name: 'Gerard', points: 150 },
    { id: 2, name: 'Miano', points: 120 },
    { id: 3, name: 'Lopez', points: 100 },
    { id: 4, name: 'Leyd', points: 90 },
    { id: 5, name: 'Lie', points: 90 },
    { id: 6, name: 'Villo', points: 80 },
    { id: 7, name: 'Ward', points: 80 },
    { id: 8, name: 'Charlie Davis', points: 80 },
    { id: 9, name: 'Charlie Davis', points: 80 },
    { id: 10, name: 'Charlie Davis', points: 80 },

    // Add more users as needed
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
        <View style={styles.topThreeContainer}>
          {leaderboardData.slice(0, 3).map((user, index) => (
            <View key={user.id} style={styles.topThreeItem}>
              <Text style={styles.topThreeRank}>{index + 1}</Text>
              <Text style={styles.topThreeName}>{user.name}</Text>
              <Text style={styles.topThreePoints}>{user.points} points</Text>
            </View>
          ))}
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
    backgroundColor: '#f5f3f8',
  },
  title: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  topThreeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: hp('3%'),
  },
  topThreeItem: {
    alignItems: 'center',
    backgroundColor: '#e5eeda',
    padding: hp('2%'),
    borderRadius: wp('5%'),
    width: wp('28%'),
  },
  topThreeRank: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#7a9b57',
  },
  topThreeName: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    marginTop: hp('1%'),
  },
  topThreePoints: {
    fontSize: hp('2%'),
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