// import React, { useState, useEffect, useCallback, useContext } from 'react';
// import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, BackHandler, Pressable, RefreshControl, ToastAndroid } from 'react-native';
// import { getClaimedRewards, updateClaimedRewardStatus } from './claimedRewardsService';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import { UserContext } from '../context/UserContext'; // Import UserContext

// const ClaimedRewardsScreen = ({ navigation }) => {
//   const { user } = useContext(UserContext); // Use user data from context
//   const [claimedRewards, setClaimedRewards] = useState([]);
//   const [filter, setFilter] = useState('toBeClaimed'); // 'toBeClaimed' or 'claimed'
//   const [selectedReward, setSelectedReward] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     fetchClaimedRewards();
//   }, [user]);

//   const fetchClaimedRewards = async () => {
//     if (user && user.studentNumber) {
//       const rewards = await getClaimedRewards(user.studentNumber);
//       setClaimedRewards(rewards);
//     }
//   };

//   const handleClaimed = async (rewardId) => {
//     if (!rewardId) {
//       console.error('Invalid rewardId:', rewardId);
//       return;
//     }

//     try {
//       setLoading(true);
//       console.log(`Updating reward status for document ID: ${rewardId}`);
//       await updateClaimedRewardStatus(rewardId, 'claimed');
//       fetchClaimedRewards();
//       setLoading(false);
//       setShowModal(false);
//       ToastAndroid.show('Reward claimed successfully', ToastAndroid.SHORT);
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
//       {filteredRewards.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <MaterialCommunityIcons name="delete-empty-outline" size={wp('20%')} color="#83951c" borderRadius={20} />
//           <Text style={styles.emptyText}>
//             {filter === 'toBeClaimed' ? (
//               <>
//                 <Text>Your <Text
//                   style={{ fontFamily: 'Poppins-Bold', fontSize: hp('1.8%'), color: '#455e14' }}
//                 >to-be-claimed</Text> rewards {"\n"} will appear here.</Text>
//               </>
//             ) : (
//               <Text>Your <Text
//                 style={{ fontFamily: 'Poppins-Bold', fontSize: hp('1.8%'), color: '#455e14' }}
//               >claimed</Text> rewards {"\n"} will appear here.</Text>
//             )}
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           style={{ padding: wp('3%') }}
//           data={filteredRewards}
//           keyExtractor={(item, index) => item.id + index.toString()}
//           showsVerticalScrollIndicator={false}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//           renderItem={({ item }) => (
//             <Pressable onPress={() => handleRewardPress(item)}>
//               <View style={styles.rewardItem}>
//                 <Image source={item.image} style={styles.rewardImage} />
//                 <View style={styles.rewardInfo}>
//                   <Text style={styles.rewardName}>{item.name}</Text>
//                   <Text style={styles.rewardPoints}>Points: {item.points}</Text>
//                 </View>
//               </View>
//             </Pressable>
//           )}
//         />
//       )}

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
//               <Text style={styles.modalTitle}>Reward Details</Text>
//               <Image source={selectedReward.image} style={styles.modalImage} />
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
//     color: '#455e14',
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
//     color: '#455e14',
//     fontSize: hp('1.5%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Regular',
//     color: '#455e14',
//     textAlign: 'center',
//   },
//   rewardItem: {
//     padding: hp('2%'),
//     marginVertical: hp('1%'),
//     backgroundColor: 'white',
//     borderRadius: 10,
//     elevation: 3,
//     flexDirection: 'row',
//   },
//   rewardInfo: {
//     marginLeft: hp('1%'),
    
//   },
//   rewardImage: {
//     width: wp('30%'), // Adjusted width
//     height: hp('10%'), // Adjusted height
//     resizeMode: 'contain',
//     alignSelf: 'center',
//   },
//   rewardName: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
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
//   modalImage: {
//     width: wp('50%'), // Adjusted width
//     height: hp('20%'), // Adjusted height
//     resizeMode: 'contain',
//     alignSelf: 'center',
//   },
//   barcodeImage: {
//     width: wp('50%'), // Adjusted width
//     height: hp('20%'), // Adjusted height
//     resizeMode: 'contain',
//     marginBottom: hp('2%'),
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

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, ActivityIndicator, BackHandler, Pressable, RefreshControl, ToastAndroid, Alert } from 'react-native';
import { getClaimedRewards, updateClaimedRewardStatus, deleteClaimedReward } from './claimedRewardsService';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // Import UserContext

const ClaimedRewardsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [claimedRewards, setClaimedRewards] = useState([]);
  const [filter, setFilter] = useState('toBeClaimed'); // 'toBeClaimed' or 'claimed'
  const [selectedReward, setSelectedReward] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchClaimedRewards();
  }, [user]);

  const fetchClaimedRewards = async () => {
    if (user && user.studentNumber) {
      const rewards = await getClaimedRewards(user.studentNumber);
      setClaimedRewards(rewards);
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
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Reward Details</Text>
              <Image source={selectedReward.image} style={styles.modalImage} />
              <Text style={styles.modalTitles}>{selectedReward.name}</Text>
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
    backgroundColor: 'whitesmoke',
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
    padding: hp('1.3%'),
  },
  activeFilterButton: {
    borderRadius: 20,
    backgroundColor: '#bdd299',
    paddingHorizontal: wp('4%'),
  },
  filterButtonText: {
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
    width: wp('85%'),
    padding: hp('2%'),
    backgroundColor: 'white',
    borderRadius: 10,
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