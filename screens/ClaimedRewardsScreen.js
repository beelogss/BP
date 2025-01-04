import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, BackHandler, Pressable, RefreshControl, ToastAndroid, Alert } from 'react-native';
import { getClaimedRewards, updateClaimedRewardStatus, deleteClaimedReward } from './claimedRewardsService';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AntDesign, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // Import UserContext
import Animated, { FadeIn, FadeInDown, SlideInDown } from 'react-native-reanimated';

const ClaimedRewardsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [filter, setFilter] = useState('toBeClaimed'); // 'toBeClaimed' or 'claimed'
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('date'); // 'date' or 'name'
  const [isLoadingRewards, setIsLoadingRewards] = useState(true);

  useEffect(() => {
    fetchClaimedRewards();
  }, [user]);

  const fetchClaimedRewards = async () => {
    try {
      setIsLoadingRewards(true);
      if (user && user.studentNumber) {
        const rewards = await getClaimedRewards(user.studentNumber);
        setClaimedRewards(rewards);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
      ToastAndroid.show('Error loading rewards', ToastAndroid.SHORT);
    } finally {
      setIsLoadingRewards(false);
    }
  };

  const handleClaimed = async (rewardId) => {
    if (!rewardId) {
      console.error('Invalid rewardId:', rewardId);
      return;
    }

    try {
      setLoading(true);
      console.log(`Updating reward status for document ID: ${rewardId}`);
      await updateClaimedRewardStatus(rewardId, 'claimed');
      fetchClaimedRewards();
      setLoading(false);
      setShowModal(false);
      ToastAndroid.show('Reward claimed successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Error updating claimed reward status:', error);
      setLoading(false);
    }
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    setShowModal(true);
  };

  const handleDeleteReward = async (rewardId) => {
    Alert.alert(
      'Delete Reward',
      'Are you sure you want to delete this reward?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteClaimedReward(rewardId);
              fetchClaimedRewards();
              setLoading(false);
              ToastAndroid.show('Reward deleted successfully', ToastAndroid.SHORT);
            } catch (error) {
              console.error('Error deleting reward:', error);
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const filteredRewards = claimedRewards
    .filter((reward) =>
      filter === 'toBeClaimed' ? reward.status !== 'claimed' : reward.status === 'claimed'
    )
    .sort((a, b) => {
      if (sortCriteria === 'date') {
        return new Date(a.claimedAt) - new Date(b.claimedAt);
      } else if (sortCriteria === 'name') {
        return a.name.localeCompare(b.name);
      }
    });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchClaimedRewards();
    setRefreshing(false);
  }, []);

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
      <Animated.View 
        entering={FadeIn}
        style={styles.headerContainer}
      >
        <View style={styles.header}>
          <Pressable 
            style={styles.backButton}
            android_ripple={{ color: '#f9f9f9', borderless: true, radius: 28 }}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={wp('7%')} color="#455e14" />
          </Pressable>
          <Text style={styles.title}>Rewards</Text>
        </View>
        <View style={styles.filterContainer}>
          {['toBeClaimed', 'claimed'].map((filterType) => (
            <Animated.View 
              key={filterType}
              entering={FadeInDown.delay(filterType === 'claimed' ? 200 : 0)}
            >
              <TouchableOpacity
                style={[styles.filterButton, filter === filterType && styles.activeFilterButton]}
                onPress={() => setFilter(filterType)}
              >
                <Text style={[
                  styles.filterButtonText,
                  filter === filterType && styles.activeFilterText
                ]}>
                  {filterType === 'toBeClaimed' ? 'To Be Claimed' : 'Claimed'}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
      <View style={styles.sortContainer}>
        <Text style={styles.sortText}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === 'date' && styles.activeSortButton]}
          onPress={() => setSortCriteria('date')}
        >
          <Text style={styles.sortButtonText}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, sortCriteria === 'name' && styles.activeSortButton]}
          onPress={() => setSortCriteria('name')}
        >
          <Text style={styles.sortButtonText}>Name</Text>
        </TouchableOpacity>
      </View>

      {isLoadingRewards ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#83951c" />
          <Text style={styles.loadingText}>Loading rewards...</Text>
        </View>
      ) : filteredRewards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="delete-empty-outline" size={wp('20%')} color="#83951c" borderRadius={20} />
          <Text style={styles.emptyText}>
            {filter === 'toBeClaimed' ? (
              <>
                <Text>Your <Text
                  style={{ fontFamily: 'Poppins-Bold', fontSize: hp('1.8%'), color: '#455e14' }}
                >to-be-claimed</Text> rewards {"\n"} will appear here.</Text>
              </>
            ) : (
              <Text>Your <Text
                style={{ fontFamily: 'Poppins-Bold', fontSize: hp('1.8%'), color: '#455e14' }}
              >claimed</Text> rewards {"\n"} will appear here.</Text>
            )}
          </Text>
        </View>
      ) : (
        <FlatList
          style={{ padding: wp('3%') }}
          data={filteredRewards}
          keyExtractor={(item, index) => item.id + index.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleRewardPress(item)}>
              <View style={styles.rewardItem}>
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
                {filter === 'claimed' && (
                  <TouchableOpacity onPress={() => handleDeleteReward(item.id)} style={styles.deleteIcon}>
                    <MaterialCommunityIcons name="delete-outline" size={wp('10%')} color="#f66" />
                  </TouchableOpacity>
                )}
              </View>
            </Pressable>
          )}
        />
      )}

      {/* Reward Details Modal */}
      {selectedReward && (
        <Modal
          visible={showModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowModal(false)}
        >
          <Animated.View 
            entering={FadeIn}
            style={styles.modalContainer}
          >
            <Pressable 
              style={styles.modalBackground}
              onPress={() => setShowModal(false)}
            />
            <Animated.View 
              entering={SlideInDown}
              style={styles.modalContent}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Reward Details</Text>
                <Pressable 
                  style={styles.modalCloseIcon}
                  onPress={() => setShowModal(false)}
                >
                  <Ionicons name="close" size={wp('6%')} color="#455e14" />
                </Pressable>
              </View>
              
              <Image source={selectedReward.image} style={styles.modalImage} />
              <Text style={styles.modalTitles}>{selectedReward.name}</Text>
              
              <View style={styles.modalInfoContainer}>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="star" size={wp('5%')} color="#83951c" />
                  <Text style={styles.modalInfoText}>Points: {selectedReward.points}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <MaterialCommunityIcons name="clock-outline" size={wp('5%')} color="#83951c" />
                  <Text style={styles.modalInfoText}>
                    {new Date(selectedReward.claimedAt).toLocaleString()}
                  </Text>
                </View>
              </View>

              <Text style={[
                styles.modalText, 
                styles.statusText, 
                selectedReward.status === 'claimed' 
                  ? styles.completedStatus 
                  : selectedReward.availability?.toLowerCase() === 'can be claimed'
                    ? styles.canBeClaimedStatus 
                    : styles.pendingStatus
              ]}>
                Status: {selectedReward.status === 'claimed' 
                  ? 'Completed' 
                  : selectedReward.availability}
              </Text>
              <Image source={{ uri: selectedReward.barcodeUrl }} style={styles.barcodeImage} />
              {loading ? (
                <ActivityIndicator size="large" color="#83951c" />
              ) : (
                filter === 'toBeClaimed' && 
                selectedReward.availability === 'can be claimed' && (
                  <TouchableOpacity 
                    style={styles.claimButton}
                    onPress={() => handleClaimed(selectedReward.id)}
                  >
                    <Text style={styles.claimButtonText}>Mark as Claimed</Text>
                  </TouchableOpacity>
                )
              )}
            </Animated.View>
          </Animated.View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp('4%'),
  },
  title: {
    color: '#455e14',
    fontSize: wp('6%'),
    marginLeft: wp('5%'),
    marginTop: wp('6%'),
    fontFamily: 'Poppins-Bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: hp('1%'),
  },
  filterButton: {
    paddingVertical: hp('1.3%'),
    paddingHorizontal: wp('6%'),
    borderRadius: wp('5%'),
    marginHorizontal: wp('2%'),
    backgroundColor: '#f5f8f2',
  },
  activeFilterButton: {
    backgroundColor: '#455e14',
  },
  filterButtonText: {
    color: '#83951c',
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-SemiBold',
  },
  activeFilterText: {
    color: 'white',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: hp('1%'),
  },
  sortText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    marginRight: wp('2%'),
  },
  sortButton: {
    padding: hp('1%'),
  },
  activeSortButton: {
    borderRadius: 20,
    backgroundColor: '#bdd299',
    paddingHorizontal: wp('4%'),
  },
  sortButtonText: {
    color: '#455e14',
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins-SemiBold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    textAlign: 'center',
  },
  rewardItem: {
    marginVertical: hp('1%'),
    backgroundColor: 'white',
    borderRadius: hp('2%'),
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp('11%'),
  },
  rewardInfo: {
    marginLeft: hp('1%'),
    flex: 1,
  },
  rewardImage: {
    width: wp('30%'), // Adjusted width
    height: hp('11%'), // Adjusted height
    resizeMode: 'contain',
    alignSelf: 'center',
    borderRightWidth: 1,
    borderRightColor: '#83951c',
    borderRadius: hp('2%'),
    borderColor: '#455e14',
  },
  rewardName: {
    fontSize: hp('2%'),
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
  deleteIcon: {
    marginLeft: 'auto',
    backgroundColor: '#f6f6f6',
    borderTopRightRadius: hp('2%'),
    borderBottomRightRadius: hp('2%'),
    width: wp('22%'),
    height: hp('11%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    height: hp('20%'), // Adjusted height
    resizeMode: 'contain',
    alignSelf: 'center',
    borderWidth: hp('0.2%'),
    borderColor: '#83951c',
    borderRadius: hp('1%'),
    paddingHorizontal: wp('35%'),
  },
  barcodeImage: {
    width: wp('50%'), // Adjusted width
    height: hp('20%'), // Adjusted height
    resizeMode: 'contain',
    marginBottom: hp('2%'),
    alignSelf: 'center',
  },
  claimButton: {
    backgroundColor: '#455e14',
    paddingVertical: hp('1.5%'),
    borderRadius: wp('3%'),
    marginTop: hp('2%'),
    elevation: 2,
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    width: wp('90%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalCloseIcon: {
    padding: wp('2%'),
  },
  modalInfoContainer: {
    backgroundColor: '#f5f8f2',
    borderRadius: wp('3%'),
    padding: wp('4%'),
    marginVertical: hp('2%'),
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
  },
  modalInfoText: {
    marginLeft: wp('3%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
  },
  modalTitle: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    alignSelf: 'center',
  },
  modalTitles: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    alignSelf: 'center',
  },
  modalText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
  },
  statusText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
    marginVertical: hp('1%'),
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 5,
  },
  completedStatus: {
    color: '#4CAF50',
    backgroundColor: '#E8F5E9',
  },
  canBeClaimedStatus: {
    color: '#83951c',
    backgroundColor: '#e5eeda',
  },
  pendingStatus: {
    color: '#FFA000',
    backgroundColor: '#FFF3E0',
  },
  backButton: {
    padding: wp('3%'),
    marginLeft: wp('2%'),
    marginTop: wp('5%'),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
});

export default ClaimedRewardsScreen;