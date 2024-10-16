// RewardSkeleton.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from 'react-native-reanimated-skeleton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RewardSkeleton = () => (
  <View style={styles.container}>
    <Skeleton style={styles.imageSkeleton} />
    <Skeleton style={styles.textSkeleton} />
    <Skeleton style={styles.textSkeleton} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: wp('3%'),
    borderColor: '#ddd',
    backgroundColor: '#f5f5f5',
    borderRadius: wp('8%'),
    width: wp('90%'),
    height: hp('25%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
  },
  imageSkeleton: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: 10,
    alignSelf: 'center',
    backgroundColor: '#e0e0e0',
  },
  textSkeleton: {
    width: wp('30%'),
    height: 20,
    borderRadius: 5,
    marginTop: hp('1%'),
    backgroundColor: '#e0e0e0',
  },
});

export default RewardSkeleton;