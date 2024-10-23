// import React from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
// import { Feather } from '@expo/vector-icons';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// const RewardActionSheet = ({ selectedReward, points, sheetId }) => {
//   return (
//     <ActionSheet id={sheetId}>
//       <View style={styles.actionSheetContent}>
//         {selectedReward && (
//           <>
//             <View style={styles.actionSheetHeader}>
//               <TouchableOpacity onPress={() => SheetManager.hide(sheetId)}>
//                 <Feather name="x" size={wp('10%')} color="#455e14" />
//               </TouchableOpacity>
//             </View>
//             <Image source={selectedReward.image} style={styles.actionSheetImage} />
//             <Text style={styles.actionSheetTitle}>{selectedReward.name}</Text>
//             <Text style={styles.actionSheetPoints}>BP: {selectedReward.points}</Text>
//             <Text style={styles.actionSheetPoints}>Available Stock: {selectedReward.stock}</Text>
//             <TouchableOpacity
//               style={[styles.actionSheetButton, selectedReward.points > points && styles.disabledButton]}
//               onPress={() => alert('Claim Reward functionality')} // Placeholder for claiming
//               disabled={selectedReward.points > points}
//             >
//               <Text style={styles.sheetButtonText}>Claim</Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </View>
//     </ActionSheet>
//   );
// };

// const styles = StyleSheet.create({
//   actionSheetContent: {
//     padding: hp('2%'),
//   },
//   actionSheetImage: {
//     width: wp('80%'),
//     height: hp('30%'),
//     borderRadius: 10,
//     marginBottom: wp('4%'),
//     resizeMode: 'contain',
//     borderColor: '#455e14',
//     borderWidth: 1,
//     alignSelf: 'center',
//   },
//   actionSheetTitle: {
//     fontSize: hp('3.5%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
//   },
//   actionSheetPoints: {
//     fontSize: hp('2.5%'),
//     fontFamily: 'Poppins-Regular',
//     marginBottom: hp('10%'),
//   },
//   actionSheetButton: {
//     backgroundColor: '#83951c',
//     padding: hp('2%'),
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: hp('1%'),
//   },
//   disabledButton: {
//     backgroundColor: '#a9a9a9',
//   },
//   sheetButtonText: {
//     color: 'white',
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
//   actionSheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
// });

// export default RewardActionSheet;
// import React, { useState } from 'react';
// import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
// import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
// import { Feather } from '@expo/vector-icons';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { updateRewardStock } from '../screens/rewardsService';
// import { addClaimedReward } from '../screens/claimedRewardsService'; // Import the function to add claimed rewards

// const RewardActionSheet = ({ selectedReward, points, sheetId, barcodeFormat = 'ean13' }) => {
//   const [showConfirmModal, setShowConfirmModal] = useState(false);
//   const [showBarcodeModal, setShowBarcodeModal] = useState(false);
//   const [barcodeUrl, setBarcodeUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleClaimPress = () => {
//     setShowConfirmModal(true);
//   };

//   const handleConfirmClaim = async () => {
//     let newBarcode;
//     if (barcodeFormat === 'ean13' || barcodeFormat === 'upca') {
//       // Ensure the barcode data is numeric and has the correct length
//       const numericId = selectedReward.id.replace(/\D/g, '').padStart(12, '0').slice(0, 12);
//       const checkDigit = calculateCheckDigit(numericId);
//       newBarcode = numericId + checkDigit;
//     } else {
//       newBarcode = `REWARD-${selectedReward.id}-${selectedReward.name}-${selectedReward.points}-${Date.now()}`;
//     }

//     setLoading(true);

//     // Generate the barcode image URL using bwip-js API
//     const barcodeApiUrl = `https://bwipjs-api.metafloor.com/?bcid=${barcodeFormat}&text=${encodeURIComponent(newBarcode)}&scale=3&includetext`;

//     setBarcodeUrl(barcodeApiUrl);
//     setLoading(false);
//     setShowConfirmModal(false);
//     setShowBarcodeModal(true);

//     // Update stock in Firestore
//     await updateRewardStock(selectedReward.id, selectedReward.stock - 1);

//     // Add claimed reward to Firestore and get the document ID
//     const docRef = await addClaimedReward({
//       name: selectedReward.name,
//       points: selectedReward.points,
//       barcode: newBarcode,
//       barcodeUrl: barcodeApiUrl, // Store the barcode URL
//       claimedAt: new Date().toISOString(),
//       status: 'toBeClaimed',
//     });

//     // Store the document ID for future updates
//     selectedReward.claimedRewardDocId = docRef.id;
//     console.log(`Claimed reward added with document ID: ${docRef.id}`);
//   };

//   // Function to calculate the check digit for EAN-13 and UPC-A barcodes
// const calculateCheckDigit = (numericId) => {
//   let sum = 0;
//   for (let i = 0; i < numericId.length; i++) {
//     const digit = parseInt(numericId[i], 10);
//     sum += (i % 2 === 0) ? digit : digit * 3;
//   }
//   const checkDigit = (10 - (sum % 10)) % 10;
//   return checkDigit.toString();
// };

//   return (
//     <ActionSheet id={sheetId}>
//       <View style={styles.actionSheetContent}>
//         {selectedReward ? (
//           <>
//             <View style={styles.actionSheetHeader}>
//               <TouchableOpacity onPress={() => SheetManager.hide(sheetId)}>
//                 <Feather name="x" size={wp('10%')} color="#455e14" />
//               </TouchableOpacity>
//             </View>
//             <Image source={selectedReward.image} style={styles.actionSheetImage} />
//             <Text style={styles.actionSheetTitle}>{selectedReward.name}</Text>
//             <Text style={styles.actionSheetPoints}>BP: {selectedReward.points}</Text>
//             <Text style={styles.actionSheetPoints}>Available Stock: {selectedReward.stock}</Text>
//             <TouchableOpacity
//               style={[styles.actionSheetButton, selectedReward.points > points && styles.disabledButton]}
//               onPress={handleClaimPress}
//               disabled={selectedReward.points > points}
//             >
//               <Text style={styles.sheetButtonText}>Claim</Text>
//             </TouchableOpacity>
//           </>
//         ) : (
//           <Text style={styles.noRewardText}>No reward selected</Text>
//         )}
//       </View>

//       {/* Confirmation Modal */}
//       <Modal
//         visible={showConfirmModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowConfirmModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Confirm Claim</Text>
//             <Text style={styles.modalText}>Are you sure you want to claim this reward?</Text>
//             <View style={styles.modalButtons}>
//               <TouchableOpacity style={styles.modalButton} onPress={() => setShowConfirmModal(false)}>
//                 <Text style={styles.modalButtonText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.modalButton} onPress={handleConfirmClaim}>
//                 <Text style={styles.modalButtonText}>Confirm</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Barcode Modal */}
//       <Modal
//         visible={showBarcodeModal}
//         transparent={true}
//         animationType="slide"
//         onRequestClose={() => setShowBarcodeModal(false)}
//       >
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Reward Claimed</Text>
//             {loading ? (
//               <ActivityIndicator size="large" color="#83951c" />
//             ) : (
//               <Image source={{ uri: barcodeUrl }} style={styles.barcodeImage} />
//             )}
//             <Text style={styles.modalText}>Reward: {selectedReward?.name}</Text>
//             <Text style={styles.modalText}>Points: {selectedReward?.points}</Text>
//             <TouchableOpacity style={styles.modalButtonss} onPress={() => setShowBarcodeModal(false)}>
//               <Text style={styles.modalButtonTexts}>Close</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </ActionSheet>
//   );
// };

// const styles = StyleSheet.create({
//   actionSheetContent: {
//     padding: hp('2%'),
//   },
//   actionSheetImage: {
//     width: wp('80%'),
//     height: hp('30%'),
//     borderRadius: 10,
//     marginBottom: wp('4%'),
//     resizeMode: 'contain',
//     borderColor: '#455e14',
//     borderWidth: 1,
//     alignSelf: 'center',
//   },
//   actionSheetTitle: {
//     fontSize: hp('3.5%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
//   },
//   actionSheetPoints: {
//     fontSize: hp('2.5%'),
//     fontFamily: 'Poppins-Regular',
//     marginBottom: hp('10%'),
//   },
//   actionSheetButton: {
//     backgroundColor: '#83951c',
//     padding: hp('2%'),
//     borderRadius: 5,
//     alignItems: 'center',
//     marginVertical: hp('1%'),
//   },
//   disabledButton: {
//     backgroundColor: '#a9a9a9',
//   },
//   sheetButtonText: {
//     color: 'white',
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
//   actionSheetHeader: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//   },
//   noRewardText: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Regular',
//     color: '#83951c',
//     textAlign: 'center',
//     marginTop: hp('2%'),
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
//     alignItems: 'center',
//   },
//   modalTitle: {
//     fontSize: hp('3%'),
//     fontFamily: 'Poppins-Bold',
//     marginBottom: hp('2%'),
//   },
//   modalText: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Regular',
//     marginBottom: hp('2%'),
//   },
//   barcodeImage: {
//     width: wp('70%'), // Adjusted width
//     height: hp('20%'), // Adjusted height
//     resizeMode: 'contain',
//     marginBottom: hp('2%'),
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '100%',
//   },
//   modalButton: {
//     flex: 1,
//     padding: hp('1.5%'),
//     margin: hp('0.5%'),
//     backgroundColor: '#83951c',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   modalButtonText: {
//     color: 'white',
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
//   modalButtonss: {
//     padding: hp('1%'),
//     paddingHorizontal: hp('3%'),
//     backgroundColor: '#83951c',
//     borderRadius: 5,
//     justifyContent: 'center',
//   },
//   modalButtonTexts: {
//     color: 'white',
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-SemiBold',
//   },
// });

// export default RewardActionSheet;

import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { updateRewardStock } from '../screens/rewardsService';
import { addClaimedReward } from '../screens/claimedRewardsService'; // Import the function to add claimed rewards

const RewardActionSheet = ({ selectedReward, points, sheetId, barcodeFormat = 'ean13' }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(false);
    setShowConfirmModal(false);
    setShowBarcodeModal(true);
  
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
    });
  
    // Store the document ID for future updates
    selectedReward.claimedRewardDocId = docRef.id;
    console.log(`Claimed reward added with document ID: ${docRef.id}`);
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
              <TouchableOpacity onPress={() => SheetManager.hide(sheetId)}>
                <Feather name="x" size={wp('10%')} color="#455e14" />
              </TouchableOpacity>
            </View>
            <Image source={selectedReward.image} style={styles.actionSheetImage} />
            <Text style={styles.actionSheetTitle}>{selectedReward.name}</Text>
            <Text style={styles.actionSheetPoints}>BP: {selectedReward.points}</Text>
            <Text style={styles.actionSheetPoints}>Available Stock: {selectedReward.stock}</Text>
            <TouchableOpacity
              style={[styles.actionSheetButton, selectedReward.points > points && styles.disabledButton]}
              onPress={handleClaimPress}
              disabled={selectedReward.points > points}
            >
              <Text style={styles.sheetButtonText}>Claim</Text>
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
    backgroundColor: '#f6f6f6',
  },
  actionSheetImage: {
    width: wp('80%'),
    height: hp('30%'),
    borderRadius: 5,
    marginBottom: wp('4%'),
    resizeMode: 'contain',
    borderColor: '#455e14',
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  actionSheetTitle: {
    fontSize: hp('3.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  actionSheetPoints: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('10%'),
  },
  actionSheetButton: {
    backgroundColor: '#83951c',
    padding: hp('2%'),
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: hp('1%'),
  },
  disabledButton: {
    backgroundColor: '#a9a9a9',
  },
  sheetButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  actionSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
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
  },
  modalText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('2%'),
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