import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { updateRewardStock } from '../screens/rewardsService';
import { addClaimedReward } from '../screens/claimedRewardsService'; // Import the function to add claimed rewards
import axios from 'axios'; // Import axios for API calls
import { UserContext } from '../context/UserContext'; // Import UserContext

const RewardActionSheet = ({ selectedReward, points, sheetId, user }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(UserContext); // Use setUser to update user data

  const handleClaimPress = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmClaim = async () => {
    let newBarcode;
    if (barcodeFormat === 'ean13' || barcodeFormat === 'upca') {
      // Generate a unique ID by appending a timestamp
      let uniqueId = `${selectedReward.id}${Date.now()}`;
      // Ensure it's numeric and length is correct
      let numericId = uniqueId.replace(/\D/g, '').padStart(12, '0').slice(0, 12);

      // Ensure the first digit is not 0
      if (numericId.startsWith('0')) {
        numericId = '1' + numericId.slice(1); // Replace first 0 with 1
      }

      const checkDigit = calculateCheckDigit(numericId);
      newBarcode = numericId + checkDigit;
    } else {
      newBarcode = `REWARD-${selectedReward.id}-${selectedReward.name}-${selectedReward.points}-${Date.now()}`;
    }

    setLoading(true);

    // Generate the barcode image URL using bwip-js API
    const barcodeApiUrl = `https://bwipjs-api.metafloor.com/?bcid=${barcodeFormat}&text=${encodeURIComponent(newBarcode)}&scale=3&includetext`;

    setBarcodeUrl(barcodeApiUrl);

    try {
      // Call the backend to claim the reward and update the user's points
      const response = await axios.post('http://192.168.1.9:3000/claim-reward', {
        userId: user.id,
        rewardId: selectedReward.id,
      });

      if (response.data.success) {
        // Update the user context with the new points
        setUser((prevUser) => ({
          ...prevUser,
          points: response.data.newPoints,
        }));
        ToastAndroid.show('Reward claimed successfully!', ToastAndroid.LONG);
      } else {
        Alert.alert('Error', response.data.message);
      }

      // Update stock in Firestore
      await updateRewardStock(selectedReward.id, selectedReward.stock - 1);

      // Add claimed reward to Firestore and get the document ID
      const docRef = await addClaimedReward({
        name: selectedReward.name,
        points: selectedReward.points,
        barcode: newBarcode,
        barcodeUrl: barcodeApiUrl, // Store the barcode URL
        claimedAt: new Date().toISOString(),
        status: 'toBeClaimed',
        imageUrl: selectedReward.image.uri, // Store the image URL
        userName: user?.name || 'Unknown', // Add user name with default value
        studentNumber: user?.studentNumber || 'Unknown', // Add student number with default value
      });

      // Store the document ID for future updates
      selectedReward.claimedRewardDocId = docRef.id;
      console.log(`Claimed reward added with document ID: ${docRef.id}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to claim reward');
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setShowBarcodeModal(true);
    }
  };

  // Function to calculate the check digit for EAN-13 and UPC-A barcodes
  const calculateCheckDigit = (numericId) => {
    let sum = 0;
    for (let i = 0; i < numericId.length; i++) {
      const digit = parseInt(numericId[i], 10);
      sum += (i % 2 === 0) ? digit : digit * 3;
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit.toString();
  };

  return (
    <ActionSheet id={sheetId}>
      <View style={styles.actionSheetContent}>
        {selectedReward ? (
          <>
            <View style={styles.actionSheetHeader}>
              <View style={styles.headerLine} />
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => SheetManager.hide(sheetId)}
              >
                <Feather name="x" size={wp('6%')} color="#455e14" />
              </TouchableOpacity>
            </View>

            <Image source={selectedReward.image} style={styles.actionSheetImage} />
            
            <View style={styles.detailsContainer}>
              <Text style={styles.actionSheetTitle}>{selectedReward.name}</Text>
              
              <View style={styles.infoRow}>
                <View style={styles.stockContainer}>
                  <MaterialCommunityIcons name="package-variant" size={wp('5%')} color="#83951c" />
                  <Text style={styles.actionSheetStock}>
                    Stock: <Text style={styles.stockNumber}>{selectedReward.stock}</Text>
                  </Text>
                </View>

                <View style={styles.pointsContainer}>
                  <Image
                    style={styles.pointsIcon}
                    source={require('../assets/images/points.png')}
                  />
                  <Text style={styles.actionSheetPoints}>{selectedReward.points}</Text>
                </View>
              </View>

              {/* Points Status */}
              {selectedReward.points > points ? (
                <View style={styles.pointsStatusContainer}>
                  <MaterialCommunityIcons name="alert-circle-outline" size={wp('5%')} color="#FFA000" />
                  <Text style={styles.pointsNeededText}>
                    You need <Text style={styles.pointsHighlight}>{selectedReward.points - points}</Text> more points
                  </Text>
                </View>
              ) : (
                <View style={styles.pointsStatusContainer}>
                  <MaterialCommunityIcons name="check-circle-outline" size={wp('5%')} color="#4CAF50" />
                  <Text style={styles.canClaimText}>You can claim this reward!</Text>
                </View>
              )}

              {/* Description section if you have it */}
              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionTitle}>About this reward</Text>
                <Text style={styles.descriptionText}>
                  {selectedReward.description || "Claim this reward at the designated redemption area. Show the barcode to the staff to redeem your reward."}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.actionSheetButton,
                (selectedReward.points > points || selectedReward.stock <= 0) 
                  ? styles.disabledButton 
                  : styles.enabledButton
              ]}
              onPress={handleClaimPress}
              disabled={selectedReward.points > points || selectedReward.stock <= 0}
            >
              <Text style={[
                styles.sheetButtonText,
                (selectedReward.points > points || selectedReward.stock <= 0) 
                  && styles.disabledButtonText
              ]}>
                {selectedReward.stock <= 0 
                  ? 'Out of Stock' 
                  : selectedReward.points > points 
                    ? 'Insufficient Points' 
                    : 'Claim Reward'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noRewardText}>No reward selected</Text>
        )}
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Claim</Text>
            <Text style={styles.modalText}>Are you sure you want to claim this reward?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleConfirmClaim}>
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Barcode Modal */}
      <Modal
        visible={showBarcodeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowBarcodeModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reward Claimed</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#83951c" />
            ) : (
              <Image source={{ uri: barcodeUrl }} style={styles.barcodeImage} />
            )}
            <Text style={styles.modalText}>Reward: {selectedReward?.name}</Text>
            <Text style={styles.modalText}>Points: {selectedReward?.points}</Text>
            <TouchableOpacity style={styles.modalButtonss} onPress={() => setShowBarcodeModal(false)}>
              <Text style={styles.modalButtonTexts}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionSheetContent: {
    padding: hp('2%'),
    backgroundColor: '#fff',
    borderTopRightRadius: wp('5%'),
    borderTopLeftRadius: wp('5%'),
  },
  actionSheetHeader: {
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  headerLine: {
    width: wp('15%'),
    height: hp('0.5%'),
    backgroundColor: '#E0E0E0',
    borderRadius: wp('1%'),
    marginBottom: hp('2%'),
  },
  closeButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: wp('2%'),
  },
  actionSheetImage: {
    width: wp('90%'),
    height: hp('25%'),
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: '#f6f6f6',
  },
  detailsContainer: {
    padding: wp('4%'),
  },
  actionSheetTitle: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
  pointsIcon: {
    height: hp('2.5%'),
    width: wp('5%'),
    marginRight: wp('1%'),
  },
  actionSheetStock: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    marginLeft: wp('1%'),
  },
  stockNumber: {
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
  },
  actionSheetPoints: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
  },
  pointsStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f6f6',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  pointsNeededText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#FFA000',
    marginLeft: wp('2%'),
  },
  pointsHighlight: {
    fontFamily: 'Poppins-Bold',
  },
  canClaimText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#4CAF50',
    marginLeft: wp('2%'),
  },
  descriptionContainer: {
    marginTop: hp('2%'),
  },
  descriptionTitle: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  descriptionText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    lineHeight: hp('2.5%'),
  },
  actionSheetButton: {
    padding: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    marginTop: hp('2%'),
    width: '100%',
  },
  enabledButton: {
    backgroundColor: '#83951c',  // Your theme green for enabled state
  },
  disabledButton: {
    backgroundColor: '#cccccc',  // Gray color for disabled state
  },
  sheetButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  disabledButtonText: {
    color: '#666666',  // Darker gray for disabled text
  },
  noRewardText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    textAlign: 'center',
    marginTop: hp('2%'),
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
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('2%'),
    color: '#455e14',
  },
  modalText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
  },
  barcodeImage: {
    width: wp('70%'), // Adjusted width
    height: hp('20%'), // Adjusted height
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    padding: hp('1.5%'),
    margin: hp('0.5%'),
    backgroundColor: '#83951c',
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  modalButtonss: {
    padding: hp('1%'),
    paddingHorizontal: hp('3%'),
    backgroundColor: '#83951c',
    borderRadius: 5,
    justifyContent: 'center',
  },
  modalButtonTexts: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default RewardActionSheet;