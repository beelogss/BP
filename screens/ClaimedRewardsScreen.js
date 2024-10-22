// import React, { useState, useEffect, useCallback } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, BackHandler, Pressable, RefreshControl } from 'react-native';
// import { getClaimedRewards, updateClaimedRewardStatus } from './claimedRewardsService';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { AntDesign } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';

// const ClaimedRewardsScreen = ({ navigation }) => {
//   const [claimedRewards, setClaimedRewards] = useState([]);
//   const [filter, setFilter] = useState('toBeClaimed'); // 'toBeClaimed' or 'claimed'
//   const [selectedReward, setSelectedReward] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchClaimedRewards();
//   }, []);

//   const fetchClaimedRewards = async () => {
//     const rewards = await getClaimedRewards();
//     setClaimedRewards(rewards);
//   };

//   const handleClaimed = async (rewardId) => {
//     try {
//       setLoading(true);
//       await updateClaimedRewardStatus(rewardId, 'claimed');
//       fetchClaimedRewards();
//       setLoading(false);
//     } catch (error) {
//       console.error('Error updating claimed reward status:', error);
//       setLoading(false);
//     }
//   };

//   const handleRewardPress = (reward) => {
//     setSelectedReward(reward);
//     setShowModal(true);
//   };

//   const filteredRewards = claimedRewards.filter((reward) =>
//     filter === 'toBeClaimed' ? reward.status !== 'claimed' : reward.status === 'claimed'
//   );

//   const onRefresh = useCallback(async () => {
//     setRefreshing(true);
//     await fetchClaimedRewards();
//     setRefreshing(false);
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       const onBackPress = () => {
//         navigation.goBack();
//         return true;
//       };

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [navigation])
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContainer}>
//         <View style={styles.header}>
//           <Pressable delayLongPress={200} android_ripple={{ color: '#f9f9f9', borderless: true, radius: 50 }}>
//             <AntDesign name="arrowleft" size={wp('10%')} color="#bdd299" style={{ marginLeft: wp('3%'), marginTop: wp('5%') }} onPress={() => navigation.goBack()} />
//           </Pressable>
//           <Text style={styles.title}>Rewards</Text>
//         </View>
//         <View style={styles.filterContainer}>
//           <TouchableOpacity
//             style={[styles.filterButton, filter === 'toBeClaimed' && styles.activeFilterButton]}
//             onPress={() => setFilter('toBeClaimed')}
//           >
//             <Text style={styles.filterButtonText}>To Be Claimed</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.filterButton, filter === 'claimed' && styles.activeFilterButton]}
//             onPress={() => setFilter('claimed')}
//           >
//             <Text style={styles.filterButtonText}>Claimed</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//       <FlatList
//         style={{ padding: wp('3%') }}
//         data={filteredRewards}
//         keyExtractor={(item, index) => item.id + index.toString()}
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         renderItem={({ item }) => (
//           <Pressable onPress={() => handleRewardPress(item)}>
//             <View style={styles.rewardItem}>
//               <Text style={styles.rewardName}>{item.name}</Text>
//               <Text style={styles.rewardPoints}>Points: {item.points}</Text>
//               <Text style={styles.rewardDate}>Claimed At: {new Date(item.claimedAt).toLocaleString()}</Text>
//             </View>
//           </Pressable>
//         )}
//       />

//       {/* Reward Details Modal */}
//       {selectedReward && (
//         <Modal
//           visible={showModal}
//           transparent={true}
//           animationType="slide"
//           onRequestClose={() => setShowModal(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalContent}>
//               <Text style={styles.modalTitle}>{selectedReward.name}</Text>
//               <Text style={styles.modalText}>Points: {selectedReward.points}</Text>
//               <Text style={styles.modalText}>Claimed At: {new Date(selectedReward.claimedAt).toLocaleString()}</Text>
//               <Image source={{ uri: selectedReward.barcodeUrl }} style={styles.barcodeImage} />
//               {loading ? (
//                 <ActivityIndicator size="large" color="#83951c" />
//               ) : (
//                 filter === 'toBeClaimed' && (
//                   <TouchableOpacity style={styles.claimButton} onPress={() => handleClaimed(selectedReward.id)}>
//                     <Text style={styles.claimButtonText}>Mark as Claimed</Text>
//                   </TouchableOpacity>
//                 )
//               )}
//               <TouchableOpacity style={styles.closeButton} onPress={() => setShowModal(false)}>
//                 <Text style={styles.closeButtonText}>Close</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </Modal>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f6f6f6',
//   },
//   headerContainer: {
//     backgroundColor: 'white',
//     borderBottomColor: '#455e14',
//     borderBottomWidth: 0.5,
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: wp('4%'),
//   },
//   title: {
//     color: 'black',
//     fontSize: wp('6%'),
//     marginLeft: wp('5%'),
//     marginTop: wp('6%'),
//     fontFamily: 'Poppins-Bold',
//   },
//   filterContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     marginBottom: hp('1%'),
//   },
//   filterButton: {
//     padding: hp('1.3%'),
//   },
//   activeFilterButton: {
//     borderRadius: 20,
//     backgroundColor: '#bdd299',
//     paddingHorizontal: wp('4%'),
//   },
//   filterButtonText: {
//     color: 'black',
//     fontSize: hp('1.5%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
//   rewardItem: {
//     padding: hp('2%'),
//     marginVertical: hp('1%'),
//     backgroundColor: 'white',
//     borderRadius: 10,
//     elevation: 3,
//   },
//   rewardName: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Bold',
//     color: 'black',
//   },
//   rewardPoints: {
//     fontSize: hp('1.7%'),
//     fontFamily: 'Poppins-Regular',
//     color: '#83951c',
//   },
//   rewardDate: {
//     fontSize: hp('1.7%'),
//     fontFamily: 'Poppins-Regular',
//     color: '#83951c',
//   },
//   rewardBarcode: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Regular',
//     color: '#83951c',
//   },
//   barcodeImage: {
//     width: wp('50%'), // Adjusted width
//     height: hp('20%'), // Adjusted height
//     resizeMode: 'contain',
//     marginBottom: hp('2%'),
//     backgroundColor: '#e5eeda',
//     alignSelf: 'center',
//   },
//   claimButton: {
//     marginTop: hp('1%'),
//     padding: hp('1%'),
//     borderRadius: 5,
//     backgroundColor: '#83951c',
//     alignItems: 'center',
//   },
//   claimButtonText: {
//     color: 'white',
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: wp('80%'),
//     padding: hp('2%'),
//     backgroundColor: 'white',
//     borderRadius: 10,
//   },
//   modalTitle: {
//     fontSize: hp('3%'),
//     fontFamily: 'Poppins-Bold',
//     marginBottom: hp('2%'),
//     color: '#455e14',
//     alignSelf: 'center',
//   },
//   modalText: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Regular',
//     marginBottom: hp('2%'),
//   },
//   closeButton: {
//     marginTop: hp('2%'),
//     padding: hp('1%'),
//     borderRadius: 5,
//     backgroundColor: '#83951c',
//     alignItems: 'center',
//   },
//   closeButtonText: {
//     color: 'white',
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
// });

// export default ClaimedRewardsScreen;

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, BackHandler, Pressable, RefreshControl, ToastAndroid } from 'react-native';
import { getClaimedRewards, updateClaimedRewardStatus } from './claimedRewardsService';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const ClaimedRewardsScreen = ({ navigation }) => {
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [filter, setFilter] = useState('toBeClaimed'); // 'toBeClaimed' or 'claimed'
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchClaimedRewards();
  }, []);

  const fetchClaimedRewards = async () => {
    const rewards = await getClaimedRewards();
    setClaimedRewards(rewards);
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

  const filteredRewards = claimedRewards.filter((reward) =>
    filter === 'toBeClaimed' ? reward.status !== 'claimed' : reward.status === 'claimed'
  );

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
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable delayLongPress={200} android_ripple={{ color: '#f9f9f9', borderless: true, radius: 50 }}>
            <AntDesign name="arrowleft" size={wp('10%')} color="#bdd299" style={{ marginLeft: wp('3%'), marginTop: wp('5%') }} onPress={() => navigation.goBack()} />
          </Pressable>
          <Text style={styles.title}>Rewards</Text>
        </View>
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
      </View>
      {filteredRewards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="delete-empty-outline" size={wp('20%')} color="#83951c" borderRadius={20} />
          <Text style={styles.emptyText}>
            {filter === 'toBeClaimed' ? (
              <>
                <Text>Your <Text
              style={{ fontFamily: 'Poppins-Bold', fontSize: hp('1.8%'), color: '#455e14' }}
            >to be claimed</Text> rewards {"\n"} will appear here.</Text>
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
                <Text style={styles.rewardName}>{item.name}</Text>
                <Text style={styles.rewardPoints}>Points: {item.points}</Text>
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
    backgroundColor: '#f6f6f6',
  },
  headerContainer: {
    backgroundColor: 'white',
    borderBottomColor: '#455e14',
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp('4%'),
  },
  title: {
    color: 'black',
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
    padding: hp('1.3%'),
  },
  activeFilterButton: {
    borderRadius: 20,
    backgroundColor: '#bdd299',
    paddingHorizontal: wp('4%'),
  },
  filterButtonText: {
    color: 'black',
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
    padding: hp('2%'),
    marginVertical: hp('1%'),
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
  rewardName: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: 'black',
  },
  rewardPoints: {
    fontSize: hp('1.7%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
  },
  rewardDate: {
    fontSize: hp('1.7%'),
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