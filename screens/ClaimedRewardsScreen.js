import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator } from 'react-native';
import { getClaimedRewards, updateClaimedRewardStatus } from './claimedRewardsService';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const ClaimedRewardsScreen = () => {
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [filter, setFilter] = useState('toBeClaimed'); // 'toBeClaimed' or 'claimed'
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClaimedRewards();
  }, []);

  const fetchClaimedRewards = async () => {
    const rewards = await getClaimedRewards();
    setClaimedRewards(rewards);
  };

  const handleClaimed = async (rewardId) => {
    try {
      setLoading(true);
      await updateClaimedRewardStatus(rewardId, 'claimed');
      fetchClaimedRewards();
      setLoading(false);
    } catch (error) {
      console.error('Error updating claimed reward status:', error);
      setLoading(false);
    }
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };

  const filteredRewards = claimedRewards.filter((reward) =>
    filter === 'toBeClaimed' ? reward.status !== 'claimed' : reward.status === 'claimed'
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'toBeClaimed' && styles.activeFilterButton]}
          onPress={() => setFilter('toBeClaimed')}
        >
          <Text style={styles.filterButtonText}>To Be Claimed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'claimed' && styles.activeFilterButton]}
          onPress={() => setFilter('claimed')}
        >
          <Text style={styles.filterButtonText}>Claimed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredRewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRewardPress(item)}>
            <View style={styles.rewardItem}>
              <Text style={styles.rewardName}>{item.name}</Text>
              <Text style={styles.rewardPoints}>Points: {item.points}</Text>
              <Text style={styles.rewardDate}>Claimed At: {new Date(item.claimedAt).toLocaleString()}</Text>
              <Image source={{ uri: item.barcodeUrl }} style={styles.barcodeImage} />
              {filter === 'toBeClaimed' && (
                <TouchableOpacity style={styles.claimButton} onPress={() => handleClaimed(item.id)}>
                  <Text style={styles.claimButtonText}>Mark as Claimed</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Reward Details Modal */}
      {selectedReward && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedReward.name}</Text>
              <Text style={styles.modalText}>Points: {selectedReward.points}</Text>
              <Text style={styles.modalText}>Claimed At: {new Date(selectedReward.claimedAt).toLocaleString()}</Text>
              <Image source={{ uri: selectedReward.barcodeUrl }} style={styles.barcodeImage} />
              {loading ? (
                <ActivityIndicator size="large" color="#83951c" />
              ) : (
                filter === 'toBeClaimed' && (
                  <TouchableOpacity style={styles.claimButton} onPress={() => handleClaimed(selectedReward.id)}>
                    <Text style={styles.claimButtonText}>Mark as Claimed</Text>
                  </TouchableOpacity>
                )
              )}
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: hp('2%'),
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp('5%'),
    marginBottom: hp('2%'),
  },
  filterButton: {
    padding: hp('1.3%'),
    borderRadius: 5,
    backgroundColor: '#83951c80',
  },
  activeFilterButton: {
    backgroundColor: '#83951c',
  },
  filterButtonText: {
    color: 'white',
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
  },
  rewardItem: {
    padding: hp('2%'),
    marginVertical: hp('1%'),
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  rewardName: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  rewardPoints: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
  },
  rewardDate: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
  },
  rewardBarcode: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
  },
  barcodeImage: {
    width: wp('50%'), // Adjusted width
    height: hp('20%'), // Adjusted height
    resizeMode: 'contain',
    marginBottom: hp('2%'),
    backgroundColor: '#e5eeda',
    alignSelf: 'center',
  },
  claimButton: {
    marginTop: hp('1%'),
    padding: hp('1%'),
    borderRadius: 5,
    backgroundColor: '#83951c',
    alignItems: 'center',
  },
  claimButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: wp('80%'),
    padding: hp('2%'),
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('2%'),
    color: '#455e14',
    alignSelf: 'center',
  },
  modalText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('2%'),
  },
  closeButton: {
    marginTop: hp('2%'),
    padding: hp('1%'),
    borderRadius: 5,
    backgroundColor: '#83951c',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default ClaimedRewardsScreen;