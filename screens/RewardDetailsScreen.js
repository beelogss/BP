import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RewardDetailsScreen = ({ route, navigation }) => {
  const { reward } = route.params;

  const handleClaim = () => {
    // Replace with the actual claim logic
    Alert.alert('Success', 'Reward Claimed Successfully!');
  };

  return (
    <View style={styles.container}>
      {/* Display image, checking if it's a URL or local image */}
      {typeof reward.image === 'string' ? (
        <Image source={{ uri: reward.image }} style={styles.rewardImage} />
      ) : (
        <Image source={reward.image} style={styles.rewardImage} />
      )}
      <Text style={styles.rewardName}>{reward.name}</Text>
      <Text style={styles.rewardPoints}>{reward.points} points</Text>
      <Text style={styles.rewardDescription}>{reward.description}</Text>
      
      <TouchableOpacity style={styles.claimButton} onPress={handleClaim}>
        <Text style={styles.claimButtonText}>Claim Reward</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: '#e5eeda',
  },
  rewardImage: {
    marginTop: hp('3%'),
    width: '100%',
    height: hp('25%'),
    borderRadius: 10,
    marginBottom: hp('3%'),
    resizeMode: 'contain',
    borderColor: '#83951c',
    borderWidth: 2,
  },
  rewardName: {
    fontSize: wp('7%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('1.5%'),
  },
  rewardPoints: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    marginBottom: hp('1%'),
  },
  rewardDescription: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    marginBottom: hp('2.5%'),
  },
  claimButton: {
    backgroundColor: '#83951c',
    paddingVertical: hp('1.8%'),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    top: hp('30%'),
  },
  claimButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('5%'),
  },
});

export default RewardDetailsScreen;
  