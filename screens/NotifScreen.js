import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, ToastAndroid } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axios from 'axios'; // Import axios for API calls
import { UserContext } from '../context/UserContext'; // Import UserContext
import { useFocusEffect } from '@react-navigation/native';

const NotifScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.post('http://192.168.1.12:3000/notifications', { studentNumber: user.studentNumber });
      if (response.data.success) {
        setNotifications(response.data.notifications);
      } else {
        ToastAndroid.show('Failed to fetch notifications', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error.response ? error.response.data : error.message);
      ToastAndroid.show('Error fetching notifications', ToastAndroid.SHORT);
    }
  };

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
    <SafeAreaProvider style={styles.container}>
      
        <Text style={styles.title}>Notifications</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
        {notifications.map((notif) => (
          <View key={notif.id} style={styles.notificationItem}>
             <Text style={styles.notificationText}>Bottles: <Text style={{ color: '#83951c' }}>{notif.bottleCount}</Text></Text>
            <Text style={styles.notificationText}>Date and Time: <Text style={{ color: '#83951c' }}>{notif.timestamp}</Text></Text>
            {/* <Text style={styles.notificationText}>Points: {notif.totalPoints}</Text> */}
           
          </View>
        ))}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: wp('5%'),
    backgroundColor: 'whitesmoke',
    paddingTop: hp('5%'),
  },
  title: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  notificationItem: {
    padding: hp('2%'),
    backgroundColor: '#e5eeda',
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
  },
  notificationText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
  },
  notificationDate: {
    fontSize: hp('1.5%'),
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    marginTop: hp('0.5%'),
  },
});

export default NotifScreen;