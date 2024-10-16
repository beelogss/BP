import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { Feather } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RewardActionSheet = ({ selectedReward, points, sheetId }) => {
  return (
    <ActionSheet id={sheetId}>
      <View style={styles.actionSheetContent}>
        {selectedReward && (
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
              onPress={() => alert('Claim Reward functionality')} // Placeholder for claiming
              disabled={selectedReward.points > points}
            >
              <Text style={styles.sheetButtonText}>Claim</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionSheetContent: {
    padding: hp('2%'),
  },
  actionSheetImage: {
    width: wp('80%'),
    height: hp('30%'),
    borderRadius: 10,
    marginBottom: wp('4%'),
    resizeMode: 'contain',
    borderColor: '#455e14',
    borderWidth: 1,
    alignSelf: 'center',
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
});

export default RewardActionSheet;