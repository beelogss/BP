import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ToastAndroid,
  ActivityIndicator,
  Modal
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext';
import { addReport } from '../services/reportService';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';

const ReportProblemScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Handle back press to go back to ProfileScreen
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        navigation.goBack(); // Go back to ProfileScreen
        return true; // Prevent default behavior
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const categories = [
    { label: 'App Performance', value: 'performance' },
    { label: 'Reward Issues', value: 'rewards' },
    { label: 'Account Problems', value: 'account' },
    { label: 'Points/Bottles Not Credited', value: 'points' },
    { label: 'Other', value: 'other' }
  ];

  const handleSubmit = async () => {
    if (!category || !description.trim()) {
      ToastAndroid.show('Please fill in all fields', ToastAndroid.SHORT);
      return;
    }

    try {
      setLoading(true);

      const reportData = {
        userId: user.id,
        userName: user.name,
        studentNumber: user.studentNumber,
        category,
        description: description.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addReport(reportData);
      
      ToastAndroid.show('Report submitted successfully', ToastAndroid.LONG);
      navigation.goBack();
    } catch (error) {
      console.error('Error submitting report:', error);
      ToastAndroid.show('Failed to submit report. Please try again.', ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={wp('6%')} color="#455e14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report a Problem</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.myReportsButton}
          onPress={() => navigation.navigate('MyReports')}
        >
          <MaterialCommunityIcons name="clipboard-text-clock-outline" size={wp('6%')} color="#455e14" />
          <Text style={styles.myReportsText}>View My Reports</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Category</Text>
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={[
            styles.categoryText,
            !category && styles.placeholderText
          ]}>
            {category ? categories.find(c => c.value === category)?.label : 'Select a category'}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={wp('6%')} color="#83951c" />
        </TouchableOpacity>

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={6}
          placeholder="Please describe the problem in detail..."
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={[styles.submitButton, (!category || !description.trim()) && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={!category || !description.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>Submit Report</Text>
          )}
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCategoryModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Category</Text>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.value}
                style={[
                  styles.categoryOption,
                  category === cat.value && styles.selectedCategory
                ]}
                onPress={() => {
                  setCategory(cat.value);
                  setShowCategoryModal(false);
                }}
              >
                <Text style={[
                  styles.categoryOptionText,
                  category === cat.value && styles.selectedCategoryText
                ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowCategoryModal(false)}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: wp('2%'),
  },
  headerTitle: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginLeft: wp('2%'),
  },
  content: {
    padding: wp('5%'),
  },
  label: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  categorySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#83951c',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    marginBottom: hp('3%'),
  },
  categoryText: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  placeholderText: {
    color: '#999999',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#83951c',
    borderRadius: wp('2%'),
    padding: wp('3%'),
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Regular',
    marginBottom: hp('3%'),
    minHeight: hp('20%'),
  },
  submitButton: {
    backgroundColor: '#83951c',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#83951c80',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: wp('5%'),
    borderTopRightRadius: wp('5%'),
    padding: wp('5%'),
  },
  modalTitle: {
    fontSize: wp('4.5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  categoryOption: {
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedCategory: {
    backgroundColor: '#e5eeda',
  },
  categoryOptionText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  selectedCategoryText: {
    fontFamily: 'Poppins-Medium',
  },
  modalCloseButton: {
    marginTop: hp('2%'),
    padding: wp('4%'),
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
  myReportsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5eeda',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    marginBottom: hp('3%'),
  },
  myReportsText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    marginLeft: wp('2%'),
  },
});

export default ReportProblemScreen; 