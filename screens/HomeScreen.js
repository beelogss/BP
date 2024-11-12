import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, Platform, Dimensions, ToastAndroid, AppState, RefreshControl, ScrollView, Pressable, Image, Modal, Button } from 'react-native';
import { useNavigationState, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP } from 'react-native-responsive-screen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext'; // Import UserContext
import QRCode from 'react-native-qrcode-svg';
import axios from 'axios'; // Import axios for API calls
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
const { width, height } = Dimensions.get('window');
export default function HomeScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext); // Use user data from context and setUser to update it
  const userName = user ? user.name : 'Guest'; // Replace with actual user's name
  const studentNumber = user ? user.studentNumber : '000000';
  const id = user ? user.id : 0;
  const points = user ? user.points : 0;
  const bottleCount = user ? user.bottleCount : 0; // Add bottleCount
  const width = Dimensions.get('window').width;

  const [refreshing, setRefreshing] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState([]);

  const fetchUserData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');

      if (!storedEmail || !storedPassword) {
        throw new Error('Stored credentials are missing');
      }

      const response = await axios.post('http://192.168.1.9:3000/login', { email: storedEmail, password: storedPassword });
      setUser(response.data.user);
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      ToastAndroid.show('Error fetching user data', ToastAndroid.SHORT);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get('http://192.168.1.9:3000/leaderboard');
      if (response.data.success) {
        setLeaderboardData(response.data.leaderboard);
      } else {
        ToastAndroid.show('Failed to fetch leaderboard', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error.response ? error.response.data : error.message);
      ToastAndroid.show('Error fetching leaderboard', ToastAndroid.SHORT);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchUserData();
    await fetchLeaderboardData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const navIndex = useNavigationState(s => s.index);
  const [backPressCount, setBackPressCount] = useState(0);
  const timeoutRef = useRef(null); // Ref to store the timeout ID

  const handleBackPress = useCallback(() => {
    if (backPressCount === 0) {
      setBackPressCount(prevCount => prevCount + 1);
      timeoutRef.current = setTimeout(() => setBackPressCount(0), 3000);
      ToastAndroid.show('Press again to exit the app', ToastAndroid.SHORT);
    } else if (backPressCount === 1) {
      BackHandler.exitApp();
    }
    return true;
  }, [backPressCount]);

  useEffect(() => {
    if (Platform.OS === 'android' && navIndex === 0) {
      const backListener = BackHandler.addEventListener(
        'hardwareBackPress',
        handleBackPress
      );

      return () => {
        backListener.remove();
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // Clear the timeout on unmount
        }
      };
    }
  }, [handleBackPress, navIndex]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        setBackPressCount(0); // Reset backPressCount when app comes to foreground
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // Clear any existing timeout
        }
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      // Reset backPressCount when the screen gains focus
      setBackPressCount(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear any existing timeout
      }

      return () => {
        // Reset backPressCount when the screen loses focus
        setBackPressCount(0);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current); // Clear any existing timeout
        }
      };
    }, [])
  );

  const carouselData = [
    {
      id: 1,
      image: require('../assets/images/collect.png'),
      title: 'COLLECT',
      description: 'Collect standardized bottles and insert them into the designated bin. Let\'s start now, Cdmians!',
    },
    {
      id: 2,
      image: require('../assets/images/reward.png'),
      title: 'REWARD',
      description: 'Accumulate enough points to redeem exclusive rewards.',
    },
    {
      id: 3,
      image: require('../assets/images/repeat.png'),
      title: 'REPEAT',
      description: 'Let\'s repeat the process altogether, Cdmians! Get your rewards, Go for the Green!',
    },
  ];

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hi, {userName}!</Text>
          <Pressable onPress={() => navigation.navigate('Rewards')}>
            <Ionicons name="notifications" size={wp('6%')} color="#83951c" />
          </Pressable>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.scanContainer}>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => setQrModalVisible(true)}>
                  <Ionicons name="qr-code-outline" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>My QR</Text>
            </View>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => navigation.navigate('Bottles')}>
                  <MaterialCommunityIcons name="format-list-text" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>Bottles List</Text>
            </View>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => navigation.navigate('Scanner')}>
                  <MaterialCommunityIcons name="bottle-soda-classic-outline" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>My Bottles</Text>
            </View>
          </View>
          <View >
            <Text style={{ fontFamily: 'Poppins-Bold', fontSize: hp('2.5%'), color: '#455e14', marginLeft: hp('2%') }}>Activity</Text>
          </View>

          <View style={{ marginBottom: hp('4%') }}>
            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Earned Points</Text>
                <Text style={styles.infoValue}>{points}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Bottle Contribution</Text>
                <Text style={styles.infoValue}>{bottleCount}</Text>
              </View>
            </View>
          </View>

          <View style={{ bottom: hp('3%') }}>
            <View style={styles.carouselContainer}>
              <Carousel
                loop
                width={wp('92%')}
                height={hp('20%')}
                autoPlay={true}
                mode="parallax"
                autoPlayInterval={4000}
                data={carouselData}
                scrollAnimationDuration={1000}
                modeConfig={{
                  parallaxScrollingScale: 0.95,
                  parallaxScrollingOffset: wp('5%'),
                }}
                renderItem={({ item }) => (
                  <View style={styles.carouselItem}>
                    <View style={styles.carouselImageContainer}>
                      <Image source={item.image} style={styles.carouselImage} />
                      <Text style={styles.carouselTitle}>{item.title}</Text>
                    </View>
                    <Text style={styles.carouselDescription}>{item.description}</Text>
                  </View>
                )}
              />
            </View>

            {/* Leaderboard Container */}
            <View style={styles.leaderboardContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                <Pressable onPress={() => navigation.navigate('Leaderboard')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>Rank</Text>
                <Text style={styles.tableHeaderText}>Name</Text>
                <Text style={styles.tableHeaderText}>Bottles</Text>
              </View>
              <ScrollView vertical style={styles.leaderboardScrollView} showsVerticalScrollIndicator={true}>
                {leaderboardData.map((user, index) => (
                  <View key={index} style={styles.leaderboardItem}>
                    <Text style={styles.leaderboardPosition}>{index + 1}</Text>
                    <Image source={{ uri: user.avatar }} style={styles.leaderboardImage} />
                    <Text style={styles.leaderboardName}>{user.name}</Text>
                    <Text style={styles.leaderboardPoints}>{user.bottleCount}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <View style={{ marginBottom: hp('5%') }}>
              <View >
                <Text style={{ fontFamily: 'Poppins-Bold', fontSize: hp('2.5%'), color: '#455e14', marginLeft: hp('2%') }}>About</Text>
              </View>
              <View style={styles.bottom}>
                <Pressable style={styles.button} onPress={() => navigation.navigate('RecyclingInfo')}>
                  <Text style={styles.buttonText}>Learn More About Recycling</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => navigation.navigate('Track')}>
                  <Text style={styles.buttonText}>Track Your Recycling</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>

        <Modal
          visible={qrModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setQrModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>My QR Code</Text>
              <View style={styles.instructionContainer}>
                <MaterialCommunityIcons name="information-outline" size={wp('5%')} color="#83951c" />
                <Text style={styles.instructionText}>Use this QR code when {'\n'} recycling your bottles</Text>
              </View>
              <View style={styles.horizontalLine1} />
              <QRCode
                value={`${id}`}
                size={200}
                logo={require('../assets/images/qr-logo.png')} // Replace with your logo path
                logoSize={40}
                logoBackgroundColor='rgba(0,0,0,0)'
                logoBorderRadius={10}
                color='#83951c'
                enableLinearGradient={true} // Enable linear gradient
                linearGradient={['#83951c', '#455e14']} // Linear gradient colors
                ecl="Q"
              />
              <View style={styles.horizontalLine} />
              <Pressable style={styles.closeButton} onPress={() => setQrModalVisible(false)}>
                <Text style={{ fontFamily: 'Poppins-Bold', color: '#fff', fontSize: hp('2%') }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('3%'),
    backgroundColor: 'whitesmoke',
    paddingVertical: hp('5%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  greeting: {
    fontSize: height / 40,
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
  rewardsButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  scanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    padding: wp('2%'),
    width: wp('80%'),
    alignSelf: 'center',
  },
  scanButton: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    alignItems: 'center',
    width: wp('20%'),
    height: hp('9%'),
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: hp('1%'),
  },
  scanText: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  scanButtonIcon: {
    alignSelf: 'center',
  },
  scanButtonText: {
    color: '#455e14',
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp('1.3%'),
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
  },
  infoBox: {
    backgroundColor: '#e5eeda',
    padding: hp('1.2%'),
    borderRadius: wp('3%'),
    borderTopLeftRadius: wp('1%'),
    flex: 1,
    marginHorizontal: hp('1%'),
    height: hp('10%'),
  },
  infoTitle: {
    fontSize: hp('1.6%'),
    color: '#455e14',
    fontFamily: 'Poppins-SemiBold',
  },
  infoValue: {
    fontSize: hp('3%'),
    color: '#83951c',
    fontFamily: 'Poppins-Bold',
    alignSelf: 'center',
  },
  carouselContainer: {
    flex: 1,
    alignSelf: 'center',
  },
  carouselImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  carouselTitle: {
    fontSize: hp('2.5%'),
    color: '#83951c',
    fontFamily: 'Poppins-Black',
    textAlign: 'center',
  },
  carouselItem: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('5%'),
    borderColor: '#83951c',
    padding: hp('2%'),
    backgroundColor: 'white',
  },
  carouselImage: {
    width: wp('25%'),
    height: hp('11%'),
    resizeMode: 'contain',
  },
  carouselDescription: {
    flex: 1,
    textAlign: 'center',
    fontSize: hp('1.8%'),
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    backgroundColor: '#83951c',
    borderTopLeftRadius: wp('20%'),
    borderTopRightRadius: wp('5%'),
    borderBottomRightRadius: wp('5%'),
    left: wp('5%'),
    height: hp('20%'),
    textAlignVertical: 'center',
    borderColor: '#83951c',
    borderWidth: 1,
    padding: hp('3%'),
  },
  leaderboardContainer: {
    marginVertical: hp('3%'),
    padding: hp('2%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    marginBottom: hp('3%'),
    height: hp('35%'),
  },
  leaderboardTitle: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  seeAllText: {
    fontSize: hp('2%'),
    color: '#83951c',
    fontFamily: 'Poppins-Bold',
    textAlign: 'right',
    marginRight: hp('1.5%'),
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#bdd299',
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    textAlign: 'center',
  },
  leaderboardScrollView: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#bdd299',
  },
  leaderboardPosition: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    textAlignVertical: 'center',
    flex: 1,
    textAlign: 'center',
  },
  leaderboardImage: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
  },
  leaderboardName: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    textAlignVertical: 'center',
    flex: 2,
    textAlign: 'center',
  },
  leaderboardPoints: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#7a9b57',
    textAlignVertical: 'center',
    flex: 1,
    textAlign: 'center',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp('2%'),
    alignSelf: 'center',
  },
  button: {
    padding: hp('2%'),
    borderRadius: wp('3%'),
    flex: 1,
    marginHorizontal: hp('1%'),
    borderColor: '#bdd299',
    borderWidth: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    height: hp('12%'),
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: hp('1%'),
  },
  buttonText: {
    color: '#455e14',
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp('1.6%'),
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
    color: '#455e14',
  },
  horizontalLine: {
    height: hp('.1%'),
    backgroundColor: '#7a9b57',
    marginVertical: wp('2%'),
    top: hp('1.6%'),
    width: '100%',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('1%'),
    marginBottom: hp('2%'),
  },
  instructionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp('1.7%'),
    color: '#455e14',
    marginLeft: wp('2%'),
  },
  horizontalLine1: {
    height: hp('.1%'),
    backgroundColor: '#7a9b57',
    marginVertical: wp('2%'),
    bottom: hp('1.6%'),
    width: '100%',
  },
  closeButton: {
    marginTop: hp('3%'),
    backgroundColor: '#83951c',
    padding: hp('1%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
    justifyContent: 'center',
    width: wp('30%'),
  }
});
