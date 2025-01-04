import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, ToastAndroid, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios'; // Import axios for API calls
import { UserContext } from '../context/UserContext'; // Import UserContext
import { useBackHandler } from '../hooks/useBackHandler';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'; // Add this import
import { FadeInUp } from 'react-native-reanimated';

const NotificationCard = ({ notif, onDelete }) => (
  <Animated.View 
    entering={FadeInUp}
    style={styles.notificationCard}
  >
    <View style={styles.cardHeader}>
      <View style={styles.headerLeft}>
        <MaterialCommunityIcons name="bottle-soda-outline" size={hp('4%')} color="#83951c" />
        <View style={styles.headerTextContainer}>
          <Text style={styles.transactionText}>Bottle Deposit</Text>
          <Text style={styles.dateText}>{notif.timestamp}</Text>
        </View>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Completed</Text>
      </View>
    </View>
    
    <View style={styles.cardDivider} />
    
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Bottles Deposited</Text>
        <Text style={styles.statValue}>{notif.bottleCount}</Text>
      </View>
      
      <View style={styles.verticalDivider} />
      
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Points Earned</Text>
        <Text style={styles.statValue}>+{notif.totalPoints}</Text>
      </View>
    </View>

    <View style={styles.cardFooter}>
      <TouchableOpacity 
        onPress={() => onDelete(notif.id)} 
        style={styles.deleteButton}
      >
        <Ionicons name="trash-outline" size={hp('2%')} color="#ff4d4d" />
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  </Animated.View>
);

const NotifScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.post('https://079d4493-7284-45e2-8f07-032acf84a6e7-00-okeb4h5jwg8d.pike.replit.dev/notifications', { studentNumber: user.studentNumber });
      if (response.data.success) {
        // Filter out deleted notifications
        const activeNotifications = response.data.notifications.filter(notif => !notif.deleted);
        setNotifications(activeNotifications);
      } else {
        ToastAndroid.show('Failed to fetch notifications', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
      ToastAndroid.show('Error fetching notifications', ToastAndroid.SHORT);
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };
  const deleteNotification = async (id) => {
    try {
      const response = await axios.delete(`https://079d4493-7284-45e2-8f07-032acf84a6e7-00-okeb4h5jwg8d.pike.replit.dev/notifications/${id}`);
      if (response.data.success) {
        // Remove the deleted notification from the state
        setNotifications(notifications.filter(notif => notif.id !== id));
        ToastAndroid.show('Notification deleted successfully', ToastAndroid.SHORT);
      } else {
        ToastAndroid.show('Failed to delete notification', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      ToastAndroid.show('Error deleting notification', ToastAndroid.SHORT);
    }
  };
  
  useBackHandler(navigation);

  return (
    <SafeAreaProvider style={styles.container}>
      <Text style={styles.title}>History</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#83951c" style={styles.loadingIndicator} />
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons 
            name="bottle-soda-classic-outline" 
            size={hp('15%')} 
            color="#bdd299"
          />
          <Text style={styles.emptyTitle}>No Bottle Deposits Yet</Text>
          <Text style={styles.emptyText}>
            Start recycling bottles to earn points{'\n'}
            and see your history here!
          </Text>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons 
              name="arrow-down-circle" 
              size={hp('4%')} 
              color="#83951c"
            />
          </View>
          <TouchableOpacity 
            style={styles.startButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.startButtonText}>Start Recycling</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.map((notif) => (
            <NotificationCard key={notif.id} notif={notif} onDelete={deleteNotification} />
          ))}
        </ScrollView>
      )}
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp('5%'),
    backgroundColor: '#f8f9fa', // Light background color
    paddingTop: hp('5%'),
  },
  title: {
    fontSize: hp('3.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('3%'),
  },
  notificationCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    marginBottom: hp('2%'),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('3%'),
  },
  headerTextContainer: {
    marginLeft: wp('2%'),
  },
  transactionText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
  },
  dateText: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
  },
  statusBadge: {
    backgroundColor: '#e8f0d9',
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('4%'),
  },
  statusText: {
    color: '#83951c',
    fontSize: hp('1.4%'),
    fontFamily: 'Poppins-Medium',
  },
  iconBackground: {
    backgroundColor: '#f8f9fa',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
  },
  statsContainer: {
    flexDirection: 'row',
    padding: wp('4%'),
    backgroundColor: '#ffffff',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Medium',
    color: '#666666',
    marginTop: hp('1%'),
  },
  statValue: {
    fontSize: hp('2.2%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginTop: hp('0.5%'),
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: wp('4%'),
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp('1%'),
    paddingHorizontal: wp('3%'),
    paddingVertical: hp('1%'),
    borderRadius: wp('2%'),
    backgroundColor: '#fff0f0',
  },
  deleteButtonText: {
    color: '#ff4d4d',
    fontFamily: 'Poppins-Medium',
    fontSize: hp('1.6%'),
  },
  header: {
    padding: wp('5%'),
    paddingTop: hp('5%'),
    backgroundColor: '#fff',
    borderBottomLeftRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loadingIndicator: {
    marginTop: hp('5%'), // Add some margin to position the loading indicator
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('20%'),
  },
  emptyTitle: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginTop: hp('3%'),
    marginBottom: hp('1%'),
  },
  emptyText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    textAlign: 'center',
    lineHeight: hp('3%'),
  },
  emptyIconContainer: {
    marginTop: hp('3%'),
    marginBottom: hp('2%'),
  },
  startButton: {
    backgroundColor: '#83951c',
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('5%'),
    marginTop: hp('2%'),
    elevation: 2,
  },
  startButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
});

export default NotifScreen;