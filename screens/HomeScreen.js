import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, Platform, Dimensions, ToastAndroid, AppState, RefreshControl, ScrollView, Pressable, Image, Modal, Button } from 'react-native';
import { useNavigationState, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp, heightPercentageToDP } from 'react-native-responsive-screen';
import { Ionicons, MaterialCommunityIcons, Entypo, Octicons } from '@expo/vector-icons';
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
  const [hasNotifications, setHasNotifications] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  const fetchUserData = async () => {
    try {
      const storedEmail = await AsyncStorage.getItem('email');
      const storedPassword = await AsyncStorage.getItem('password');

      if (!storedEmail || !storedPassword) {
        throw new Error('Stored credentials are missing');
      }

      const response = await axios.post('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/login', { email: storedEmail, password: storedPassword });
      const userData = response.data.user;

      // Fetch total points and bottle count from userPoints collection
      const pointsSnapshot = await axios.get(`https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/userPoints?studentNumber=${userData.studentNumber}`);
      
      console.log("Points Snapshot:", pointsSnapshot.data); // Log the response

      const totalPoints = pointsSnapshot.data.totalPoints || 0;
      const totalBottleCount = pointsSnapshot.data.totalBottleCount || 0;

      setUser({
        ...userData,
        points: totalPoints,
        bottleCount: totalBottleCount,
      });
    } catch (error) {
      console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      ToastAndroid.show('Error fetching user data', ToastAndroid.SHORT);
    }
  };

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/leaderboard');
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
      image: require('../assets/images/bote.png'),
      title: 'COLLECT',
      description: 'Collect recyclable bottles that are only included in the system\'s approved list.',
    },
    {
      id: 2,
      image: require('../assets/images/scan.png'),
      title: 'SCAN',
      description: 'Scan your bottles and earn points. Each bottle has a redeemable point value.',
    },
    {
      id: 3,
      image: require('../assets/images/rewards.png'),
      title: 'REWARD',
      description: 'Redeem rewards based on reward\'s specific points requirement.',
    },
  ];

  const recyclingTips = [
    {
      icon: 'recycle',
      title: 'Clean Before Recycling',
      text: 'Make sure bottles are empty and clean before depositing.',
    },
    {
      icon: 'clipboard-list-outline',
      title: 'Check Bottle List',
      text: 'Verify if your bottle is accepted by checking the Bottles List first.',
    },
    {
      icon: 'barcode-scan',
      title: 'Keep Labels Intact',
      text: 'Do not remove bottle labels as they contain barcodes needed for scanning.',
    },
  ];

  const checkNotifications = async () => {
    try {
      // You can implement your notification checking logic here
      // For now, let's just set it to false
      setHasNotifications(false);
    } catch (error) {
      console.error('Error checking notifications:', error);
      setHasNotifications(false);
    }
  };

  useEffect(() => {
    checkNotifications();
  }, []);

  // Add an effect to redirect if no user
  useEffect(() => {
    if (!user) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [user]);

  // Add early return if no user
  if (!user) {
    return null; // or return a loading screen
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Fixed Welcome Section */}
        <View style={styles.welcomeHeader}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.greeting}>{userName}</Text>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.mainContent}>
            {/* Quick Actions */}
            <View style={styles.quickActionsContainer}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <View style={styles.scanContainer}>
                <Pressable 
                  style={styles.scanButton}
                  onPress={() => setQrModalVisible(true)}
                  onLongPress={() => setActiveTooltip('qr')}
                  onPressOut={() => setActiveTooltip(null)}
                >
                  <View style={styles.iconContainer}>
                    <Ionicons name="qr-code-outline" size={wp('8%')} color="#83951c" />
                  </View>
                  <Text style={styles.scanButtonText}>My QR</Text>
                  {activeTooltip === 'qr' && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>Scan to deposit</Text>
                    </View>
                  )}
                </Pressable>

                <View style={styles.divider} />

                <Pressable 
                  style={styles.scanButton}
                  onPress={() => navigation.navigate('Bottles')}
                  onLongPress={() => setActiveTooltip('bottles')}
                  onPressOut={() => setActiveTooltip(null)}
                >
                  <View style={styles.iconContainer}>
                    <MaterialCommunityIcons name="format-list-text" size={wp('8%')} color="#83951c" />
                  </View>
                  <Text style={styles.scanButtonText}>Bottles List</Text>
                  {activeTooltip === 'bottles' && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>View available bottles</Text>
                    </View>
                  )}
                </Pressable>

                <View style={styles.divider} />

                <Pressable 
                  style={styles.scanButton}
                  onPress={() => navigation.navigate('Notif')}
                  onLongPress={() => setActiveTooltip('history')}
                  onPressOut={() => setActiveTooltip(null)}
                >
                  <View style={styles.iconContainer}>
                    <Octicons name="history" size={wp('8%')} color="#83951c" />
                    {hasNotifications && <View style={styles.notificationDot} />}
                  </View>
                  <Text style={styles.scanButtonText}>History</Text>
                  {activeTooltip === 'history' && (
                    <View style={styles.tooltip}>
                      <Text style={styles.tooltipText}>View transactions</Text>
                    </View>
                  )}
                </Pressable>
              </View>
            </View>

            {/* Activity Section */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>Activity</Text>
              <View style={styles.infoContainer}>
                <View style={styles.infoBox}>
                  <View style={styles.statsIconContainer}>
                    <Image
                      source={require('../assets/images/points.png')}
                      style={styles.statsIcon}
                    />
                  </View>
                  <View style={styles.statsTextContainer}>
                    <Text style={styles.infoValue}>{points}</Text>
                    <Text style={styles.infoTitle}>Total Points</Text>
                  </View>
                </View>

                <View style={styles.infoBox}>
                  <View style={styles.statsIconContainer}>
                    <MaterialCommunityIcons 
                      name="bottle-soda-outline" 
                      size={wp('9%')} 
                      color="#83951c" 
                    />
                  </View>
                  <View style={styles.statsTextContainer}>
                    <Text style={styles.infoValue}>{bottleCount}</Text>
                    <Text style={styles.infoTitle}>Total Bottles</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Carousel Section */}
            <View style={styles.carouselSection}>
            <Text style={styles.sectionTitle}>How It Works</Text>
              <Carousel
                loop
                width={wp('90%')}
                height={hp('23%')}
                autoPlay={true}
                mode="parallax"
                autoPlayInterval={4000}
                data={carouselData}
                scrollAnimationDuration={1000}
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: wp('12%'),
                }}
                renderItem={({ item }) => (
                  <View style={styles.carouselItem}>
                    <View style={styles.carouselContent}>
                      <View style={styles.carouselImageContainer}>
                        <Image source={item.image} style={styles.carouselImage} />
                      </View>
                      <View style={styles.carouselTextContainer}>
                        <Text style={styles.carouselTitle}>{item.title}</Text>
                        <Text style={styles.carouselDescription} numberOfLines={4} adjustsFontSizeToFit>
                          {item.description}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.carouselIndicator}>
                      <MaterialCommunityIcons 
                        name={
                          item.id === 1 ? "recycle" : 
                          item.id === 2 ? "qrcode-scan" : 
                          "gift-outline"
                        } 
                        size={wp('5%')} 
                        color="#455e14" 
                      />
                    </View>
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.leaderboardContainer}>
            <View style={styles.leaderboardHeader}>
              <Text style={styles.sectionTitle}>Top Contributors</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Leaderboard')}>
                <Text style={styles.viewAllButton}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* Table Headers */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { flex: 0.4 }]}>Rank</Text>
              <Text style={[styles.tableHeaderText, { flex: 2, textAlign: 'left', paddingLeft: wp('3%') }]}>Name</Text>
            </View>

            {/* Scrollable Leaderboard Content */}
            <ScrollView 
              style={styles.leaderboardScroll}
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              {leaderboardData.slice(0, 5).map((item, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.leaderboardRow,
                    index === 0 && styles.firstPlace,
                    index === 1 && styles.secondPlace,
                    index === 2 && styles.thirdPlace,
                  ]}
                >
                  {/* Rank */}
                  <View style={[styles.rankContainer, { flex: 0.4 }]}>
                    {index < 3 ? (
                      <MaterialCommunityIcons
                        name="medal"
                        size={wp('5%')}
                        color={index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'}
                      />
                    ) : (
                      <Text style={styles.rankText}>{index + 1}</Text>
                    )}
                  </View>

                  {/* Student Info */}
                  <View style={[styles.studentContainer, { flex: 2 }]}>
                    <Image 
                      source={{ uri: item.avatar }}
                      defaultSource={require('../assets/images/default-profile.png')}
                      style={styles.profilePic}
                    />
                    <View style={styles.studentInfo}>
                      <Text style={styles.studentName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <View style={styles.bottleRow}>
                        <MaterialCommunityIcons 
                          name="bottle-soda-outline" 
                          size={wp('3.5%')} 
                          color="#83951c" 
                          style={styles.bottleIcon}
                        />
                        <Text style={styles.bottleText}>{item.bottleCount} bottles</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* <View style={{ marginBottom: hp('5%') }}>
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
          </View> */}

          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Recycling Tips</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.tipsScroll}
            >
              {recyclingTips.map((tip, index) => (
                <View key={index} style={styles.tipCard}>
                  <MaterialCommunityIcons 
                    name={tip.icon} 
                    size={wp('8%')} 
                    color="#83951c" 
                  />
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipText}>{tip.text}</Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Add bottom padding to prevent tab overlap */}
          <View style={styles.bottomSpacing} />
        </ScrollView>

        <Modal
          visible={qrModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setQrModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>My QR Code</Text>
                <Pressable 
                  style={styles.closeIconButton} 
                  onPress={() => setQrModalVisible(false)}
                >
                  <Ionicons name="close" size={wp('6%')} color="#455e14" />
                </Pressable>
              </View>

              <View style={styles.instructionContainer}>
                <MaterialCommunityIcons 
                  name="information-outline" 
                  size={wp('5%')} 
                  color="#83951c" 
                />
                <Text style={styles.instructionText}>
                  Present this QR code when depositing bottles
                </Text>
              </View>

              <View style={styles.qrContainer}>
                <QRCode
                  value={`${id}`}
                  size={wp('60%')}
                  logo={require('../assets/images/qr-logo.png')}
                  logoSize={wp('12%')}
                  logoBackgroundColor='white'
                  logoBorderRadius={wp('2%')}
                  color='#455e14'
                  backgroundColor='white'
                  enableLinearGradient={true}
                  linearGradient={['#83951c', '#455e14']}
                  ecl="Q"
                />
              </View>

              <View style={styles.idContainer}>
                <Text style={styles.idLabel}>Student ID:</Text>
                <Text style={styles.idValue}>{user.studentNumber}</Text>
              </View>

              <Pressable 
                style={styles.closeButton} 
                onPress={() => setQrModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
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
    backgroundColor: 'whitesmoke',
    paddingTop: hp('4%'),
  },
  welcomeHeader: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
  },
  welcomeText: {
    fontSize: hp('1.8%'),
    color: '#83951c',
    fontFamily: 'Poppins-Medium',
  },
  greeting: {
    fontSize: hp('2.5%'),
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
  scrollContent: {
    flexGrow: 1,
  },
  mainContent: {
    paddingHorizontal: wp('5%'),
  },
  quickActionsContainer: {
    marginBottom: hp('1%'),
  },
  sectionTitle: {
    fontSize: hp('2.2%'),
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
  scanContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    elevation: 2,
    alignItems: 'center',
  },
  scanButton: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e5eeda',
    marginHorizontal: wp('3%'),
  },
  iconContainer: {
    backgroundColor: '#e5eeda',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('1%'),
  },
  scanButtonText: {
    color: '#455e14',
    fontFamily: 'Poppins-SemiBold',
    fontSize: hp('1.8%'),
  },
  tooltip: {
    position: 'absolute',
    bottom: -hp('4%'),
    backgroundColor: 'rgba(69, 94, 20, 0.9)',
    padding: wp('2%'),
    borderRadius: wp('2%'),
    zIndex: 1000,
  },
  tooltipText: {
    color: 'white',
    fontFamily: 'Poppins-Medium',
    fontSize: hp('1.4%'),
    textAlign: 'center',
  },
  statsSection: {
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: wp('4%'),
    borderRadius: wp('4%'),
    width: wp('42.5%'),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  statsIconContainer: {
    backgroundColor: '#e5eeda',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    marginRight: wp('3%'),
  },
  statsIcon: {
    width: wp('9%'),
    height: wp('9%'),
    resizeMode: 'contain',
  },
  statsTextContainer: {
    flex: 1,
  },
  infoValue: {
    fontSize: hp('2.8%'),
    color: '#83951c',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('0.2%'),
  },
  infoTitle: {
    fontSize: hp('1.4%'),
    color: '#455e14',
    fontFamily: 'Poppins-Medium',
  },
  carouselSection: {
    marginVertical: hp('2%'),
    alignItems: 'center',
  },
  carouselItem: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    elevation: 3,
    overflow: 'hidden',
    borderColor: '#e5eeda',
    borderWidth: 1,
  },
  carouselContent: {
    flex: 1,
    flexDirection: 'row',
    padding: wp('4%'),
  },
  carouselImageContainer: {
    width: wp('28%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4e8',
    borderRadius: wp('4%'),
    padding: wp('2%'),
  },
  carouselImage: {
    width: wp('22%'),
    height: hp('10%'),
    resizeMode: 'contain',
  },
  carouselTextContainer: {
    flex: 1,
    marginLeft: wp('3%'),
    justifyContent: 'center',
  },
  carouselTitle: {
    fontSize: hp('2.2%'),
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('0.5%'),
  },
  carouselDescription: {
    fontSize: hp('1.5%'),
    color: '#83951c',
    fontFamily: 'Poppins-Medium',
    lineHeight: hp('2%'),
  },
  carouselIndicator: {
    position: 'absolute',
    top: hp('2%'),
    right: wp('4%'),
    backgroundColor: '#e5eeda',
    padding: wp('2%'),
    borderRadius: wp('3%'),
  },
  leaderboardContainer: {
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    marginHorizontal: wp('5%'),
    marginBottom: hp('3%'),
    padding: wp('4%'),
    elevation: 2,
    height: hp('38%'),
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('1%'),
  },
  viewAllButton: {
    fontSize: hp('2%'),
    color: '#83951c',
    fontFamily: 'Poppins-Bold',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    justifyContent: 'space-between',
  },
  tableHeaderText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    textAlign: 'center',
  },
  leaderboardScroll: {
    flex: 1,
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.2%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  firstPlace: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  secondPlace: {
    backgroundColor: 'rgba(192, 192, 192, 0.1)',
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  thirdPlace: {
    backgroundColor: 'rgba(205, 127, 50, 0.1)',
    borderRadius: wp('2%'),
    marginBottom: hp('0.5%'),
  },
  rankContainer: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
  },
  studentContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: wp('5%'),
    marginRight: wp('2%'),
    backgroundColor: '#f0f0f0',
  },
  studentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  studentName: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginBottom: hp('0.3%'),
  },
  bottleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('0.2%'),
  },
  bottleIcon: {
    marginRight: wp('1%'),
  },
  bottleText: {
    fontSize: hp('1.4%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: wp('5%'),
  },
  modalContent: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('5%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  modalTitle: {
    fontSize: hp('2.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  closeIconButton: {
    padding: wp('2%'),
    backgroundColor: '#e5eeda',
    borderRadius: wp('2%'),
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f8f2',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    marginBottom: hp('3%'),
  },
  instructionText: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: hp('1.8%'),
    color: '#455e14',
    marginLeft: wp('2%'),
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: wp('5%'),
    borderRadius: wp('4%'),
    borderWidth: 1,
    borderColor: '#e5eeda',
    marginBottom: hp('3%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('3%'),
    backgroundColor: '#f5f8f2',
    padding: wp('3%'),
    borderRadius: wp('2%'),
  },
  idLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: hp('1.8%'),
    color: '#455e14',
    marginRight: wp('2%'),
  },
  idValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: hp('1.8%'),
    color: '#83951c',
  },
  closeButton: {
    backgroundColor: '#83951c',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.5%'),
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  closeButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Bold',
    fontSize: hp('2%'),
    textAlign: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: hp('4%'),
  },
  emptyStateText: {
    fontSize: hp('1.8%'),
    color: '#83951c',
    fontFamily: 'Poppins-Medium',
    marginTop: hp('1%'),
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff4444',
    borderRadius: wp('2%'),
    paddingHorizontal: wp('1.5%'),
    paddingVertical: hp('0.3%'),
  },
  badgeText: {
    color: 'white',
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins-Bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  sectionAction: {
    fontSize: hp('1.6%'),
    color: '#83951c',
    fontFamily: 'Poppins-SemiBold',
  },
  tipsContainer: {
    marginHorizontal: wp('5%'),
    marginBottom: hp('2%'),
  },
  tipsScroll: {
    marginTop: hp('1%'),
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    padding: wp('4%'),
    marginRight: wp('3%'),
    width: wp('70%'),
    elevation: 2,
  },
  tipTitle: {
    fontSize: hp('1.8%'),
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    marginVertical: hp('1%'),
  },
  tipText: {
    fontSize: hp('1.4%'),
    color: '#83951c',
    fontFamily: 'Poppins-Medium',
    lineHeight: hp('2%'),
  },
  bottomSpacing: {
    height: hp('10%'),
  },
});
