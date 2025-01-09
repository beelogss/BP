import React, { useState, useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator, Alert, ToastAndroid } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { updateRewardStock } from '../screens/rewardsServices';
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
    try {
      setLoading(true);

      // Generate barcode using the original format
      let newBarcode;
      const barcodeFormat = 'ean13'; // Use EAN-13 format

      // Generate a unique ID by appending a timestamp
      let uniqueId = `${selectedReward.id}${Date.now()}`;
      // Ensure it's numeric and length is correct
      let numericId = uniqueId.replace(/\D/g, '').padStart(12, '0').slice(0, 12);

      // Ensure the first digit is not 0
      if (numericId.startsWith('0')) {
        numericId = '1' + numericId.slice(1); // Replace first 0 with 1
      }

      // Calculate check digit for EAN-13
      const calculateCheckDigit = (number) => {
        const digits = number.split('').map(Number);
        const sum = digits.reduce((acc, digit, index) => {
          return acc + digit * (index % 2 === 0 ? 1 : 3);
        }, 0);
        return ((10 - (sum % 10)) % 10).toString();
      };

      const checkDigit = calculateCheckDigit(numericId);
      newBarcode = numericId + checkDigit;

      // Generate barcode URL using the EAN-13 format
      const barcodeApiUrl = `https://bwipjs-api.metafloor.com/?bcid=${barcodeFormat}&text=${newBarcode}&scale=3&includetext`;

      // Rest of the claiming process
      const response = await axios.post(
        'https://bp-opal.vercel.app//claim-reward',
        {
          userId: user.id,
          rewardId: selectedReward.id,
          points: selectedReward.points,
          barcode: newBarcode
        },
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      if (!response || !response.data.success) {
        throw new Error('Failed to claim reward');
      }

      // If we get here, the claim was successful
      try {
        // Update user points
        setUser((prevUser) => ({
          ...prevUser,
          points: response.data.newPoints || prevUser.points - selectedReward.points
        }));

        // Update stock in Firestore
        await updateRewardStock(selectedReward.id, selectedReward.stock - 1);

        // Add claimed reward to Firestore
        const docRef = await addClaimedReward({
          name: selectedReward.name,
          points: selectedReward.points,
          barcode: newBarcode,
          barcodeUrl: barcodeApiUrl,
          claimedAt: new Date().toISOString(),
          status: 'toBeClaimed',
          imageUrl: selectedReward.image?.uri || null,
          userName: user?.name || 'Unknown',
          studentNumber: user?.studentNumber || 'Unknown',
          userId: user.id // Add user ID for reference
        });

        // Set the barcode URL and show success
        setBarcodeUrl(barcodeApiUrl);
        ToastAndroid.show('Reward claimed successfully!', ToastAndroid.LONG);

        selectedReward.claimedRewardDocId = docRef.id;
        console.log(`Claimed reward added with document ID: ${docRef.id}`);

      } catch (dbError) {
        console.error('Database error:', dbError);
        Alert.alert(
          'Warning',
          'Reward claimed but some updates failed. The reward is still valid.',
          [{ text: 'OK' }]
        );
      }

    } catch (error) {
      console.error('Final claim error:', error);
      let errorMessage = 'Failed to claim reward. Please try again.';

      if (error.response) {
        errorMessage = error.response.data?.message || 'Server error occurred';
      } else if (error.request) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage);
      setLoading(false);
      setShowConfirmModal(false);
      return; // Don't show barcode modal on error
    }

    // Only reach here on success
    setLoading(false);
    setShowConfirmModal(false);
    setShowBarcodeModal(true);
  };

  return (
    <ActionSheet id={sheetId}>
      <View style={styles.actionSheetContent}>
        {selectedReward ? (
          <>
            <View style={styles.actionSheetHeader}>
              <View style={styles.headerLine} />
              <TouchableOpacity
                onPress={() => SheetManager.hide(sheetId)}
              >
                <Feather name="x" size={wp('8%')} color="#455e14" />
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
                {["Short Bond Paper", "Long Bond Paper"].some(paper => selectedReward.name.includes(paper)) ? (
                  <>
                    <Text style={styles.noteStyle}>Note: You will only get 10 pieces of this item per claim.</Text>
                    <Text style={styles.descriptionText}>
                      {"\n"}Claim this reward at the designated redemption area. Show the barcode to the staff to redeem your reward.
                    </Text>
                  </>
                ) : (
                  <Text style={styles.descriptionText}>
                    {selectedReward.description || "Claim this reward at the designated redemption area. Show the barcode to the staff to redeem your reward."}
                  </Text>
                )}
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
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.confirmModalContent]}>
            <MaterialCommunityIcons name="alert-circle-outline" size={50} color="#83951c" />
            <Text style={styles.modalTitle}>Confirm Claim</Text>
            <Text style={styles.confirmModalText}>
              Are you sure you want to claim {selectedReward?.name} for {selectedReward?.points} points?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmModal(false)}
              >
                <Text style={[styles.modalButtonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleConfirmClaim}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.loadingModalContent]}>
            <ActivityIndicator size="large" color="#83951c" />
            <Text style={styles.loadingText}>Claiming your reward...</Text>
          </View>
        </View>
      </Modal>

      {/* Barcode Modal */}
      <Modal
        visible={showBarcodeModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowBarcodeModal(false);
          setBarcodeUrl('');
        }}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, styles.barcodeModalContent]}>
            <View style={styles.successIconContainer}>
              <MaterialCommunityIcons name="check-circle" size={60} color="#4CAF50" />
            </View>
            <Text style={styles.modalTitle}>Reward Claimed!</Text>
            {barcodeUrl ? (
              <Image
                source={{ uri: barcodeUrl }}
                style={styles.barcodeImage}
                onError={(e) => console.log('Barcode image error:', e.nativeEvent.error)}
              />
            ) : (
              <View style={styles.barcodeError}>
                <Text style={styles.errorText}>Failed to load barcode</Text>
              </View>
            )}
            <View style={styles.rewardDetailsContainer}>
              <Text style={styles.rewardName}>{selectedReward?.name}</Text>
              <Text style={styles.pointsText}>{selectedReward?.points} points</Text>
            </View>
            <Text style={styles.noteText}>
              You can view the details of this reward in the rewards page on rewards tab.
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setShowBarcodeModal(false);
                setBarcodeUrl('');
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
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
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginBottom: hp('2%'),
  },
  headerLine: {
    position: 'absolute',
    left: '42.5%',
    width: wp('15%'),
    height: hp('0.5%'),
    backgroundColor: '#E0E0E0',
    borderRadius: wp('1%'),
    top: hp('1%'),
  },
  closeButton: {
    paddingVertical: hp('1.5%'),
    borderRadius: 10,
    marginTop: hp('2%'),
    width: '100%',
    alignItems: 'flex-end',
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
  noteStyle: {
    fontSize: hp('1.8%'),
    color: '#FFA000', // Orange color for note
    fontFamily: 'Poppins-Medium'
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
    backgroundColor: '#83951c80',  // Semi-transparent green
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
    width: wp('85%'),
    padding: hp('3%'),
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  confirmModalContent: {
    paddingTop: hp('4%'),
  },
  loadingModalContent: {
    padding: hp('4%'),
    backgroundColor: 'white',
    borderRadius: 15,
  },
  barcodeModalContent: {
    paddingTop: hp('2%'),
  },
  modalTitle: {
    fontSize: hp('2.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginVertical: hp('2%'),
    textAlign: 'center',
  },
  confirmModalText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Medium',
    color: '#666666',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  loadingText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
    marginTop: hp('2%'),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp('2%'),
  },
  modalButton: {
    flex: 1,
    padding: hp('1.5%'),
    margin: hp('1%'),
    backgroundColor: '#83951c',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#83951c',
  },
  modalButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  cancelButtonText: {
    color: '#83951c',
  },
  successIconContainer: {
    marginBottom: hp('1%'),
  },
  rewardDetailsContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  rewardName: {
    fontSize: hp('2.2%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    textAlign: 'center',
  },
  pointsText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
    marginTop: hp('0.5%'),
  },
  closeButton: {
    borderRadius: 10,
    marginTop: hp('2%'),
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: '#83951c',
    padding: hp('1%'),
  },
  closeButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
    alignSelf: 'center',
  },
  barcodeImage: {
    width: wp('70%'), // Adjusted width
    height: hp('20%'), // Adjusted height
    resizeMode: 'contain',
    marginBottom: hp('2%'),
  },
  barcodeError: {
    width: wp('70%'),
    height: hp('20%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginBottom: hp('2%'),
  },
  errorText: {
    color: '#ed3e3e',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
  },
  noteText: {
    fontSize: hp('1.7%'),
    color: '#666666',
    fontFamily: 'Poppins-Regular',
    marginTop: hp('1%'),
  },
});

export default RewardActionSheet;