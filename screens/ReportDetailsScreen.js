import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBackHandler } from '../hooks/useBackHandler';

const ReportDetailsScreen = ({ navigation, route }) => {
  useBackHandler(navigation);

  const { report } = route.params;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'in-progress': return '#2196f3';
      case 'resolved': return '#4caf50';
      default: return '#999999';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'clock-outline';
      case 'in-progress': return 'progress-clock';
      case 'resolved': return 'check-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'performance': return 'speedometer';
      case 'rewards': return 'gift-outline';
      case 'account': return 'account-circle-outline';
      case 'points': return 'star-outline';
      default: return 'help-circle-outline';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={wp('6%')} color="#455e14" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report Details</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <MaterialCommunityIcons 
            name={getStatusIcon(report.status)} 
            size={wp('12%')} 
            color={getStatusColor(report.status)} 
          />
          <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Text>
        </View>

        {/* Category Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons 
              name={getCategoryIcon(report.category)} 
              size={wp('6%')} 
              color="#455e14" 
            />
            <Text style={styles.cardTitle}>Category</Text>
          </View>
          <Text style={styles.cardContent}>{report.category}</Text>
        </View>

        {/* Description Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="text" size={wp('6%')} color="#455e14" />
            <Text style={styles.cardTitle}>Description</Text>
          </View>
          <Text style={styles.cardContent}>{report.description}</Text>
        </View>

        {/* Admin Response Section */}
        {report.adminResponse && (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="reply" size={wp('6%')} color="#455e14" />
              <Text style={styles.cardTitle}>Admin Response</Text>
            </View>
            <View style={styles.responseContainer}>
              <Text style={styles.response}>{report.adminResponse}</Text>
            </View>
          </View>
        )}

        {/* Timestamps Section */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="clock-outline" size={wp('6%')} color="#455e14" />
            <Text style={styles.cardTitle}>Timeline</Text>
          </View>
          <View style={styles.timelineItem}>
            <Text style={styles.timelineLabel}>Submitted</Text>
            <Text style={styles.timelineDate}>
              {new Date(report.createdAt).toLocaleDateString()} at{' '}
              {new Date(report.createdAt).toLocaleTimeString()}
            </Text>
          </View>
          {report.updatedAt !== report.createdAt && (
            <View style={styles.timelineItem}>
              <Text style={styles.timelineLabel}>Last Updated</Text>
              <Text style={styles.timelineDate}>
                {new Date(report.updatedAt).toLocaleDateString()} at{' '}
                {new Date(report.updatedAt).toLocaleTimeString()}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
    padding: wp('4%'),
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    padding: wp('6%'),
    alignItems: 'center',
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statusText: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-SemiBold',
    marginTop: hp('1%'),
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  cardTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginLeft: wp('2%'),
  },
  cardContent: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    lineHeight: wp('6%'),
    marginLeft: wp('8%'),
  },
  responseContainer: {
    backgroundColor: '#f8f9fa',
    padding: wp('4%'),
    borderRadius: wp('2%'),
    marginLeft: wp('8%'),
  },
  response: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    lineHeight: wp('6%'),
  },
  timelineItem: {
    marginLeft: wp('8%'),
    marginBottom: hp('1%'),
  },
  timelineLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
  },
  timelineDate: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Regular',
    color: '#666666',
  },
});

export default ReportDetailsScreen; 