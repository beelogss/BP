// import React, { useEffect, useState, useCallback, useRef } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, Platform, Dimensions, ToastAndroid, AppState, RefreshControl, ScrollView, Pressable, Image } from 'react-native';
// import { useSnackbar } from '../components/SnackbarContext';
// import { useNavigationState, useNavigation, useFocusEffect } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Carousel from 'react-native-reanimated-carousel';
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
// export default function HomeScreen({ navigation }) {
//   const userName = 'Juan Dela Cruz'; // Replace with actual user's name
//   const points = 120;
//   const co2Reduction = 18;
//   const bottleGoal = 100;
//   const recycledBottles = 60;
//   const { showSnackbar } = useSnackbar();
//   const width = Dimensions.get('window').width;

//   const [refreshing, setRefreshing] = useState(false);

//   const onRefresh = useCallback(() => {
//     setRefreshing(true);
//     setTimeout(() => {
//       setRefreshing(false);
//     }, 2000);
//   }, []);

//   const navIndex = useNavigationState(s => s.index);
//   const [backPressCount, setBackPressCount] = useState(0);
//   const timeoutRef = useRef(null); // Ref to store the timeout ID

//   const handleBackPress = useCallback(() => {
//     if (backPressCount === 0) {
//       setBackPressCount(prevCount => prevCount + 1);
//       timeoutRef.current = setTimeout(() => setBackPressCount(0), 3000);
//       ToastAndroid.show('Press again to exit the app', ToastAndroid.SHORT);
//     } else if (backPressCount === 1) {
//       BackHandler.exitApp();
//     }
//     return true;
//   }, [backPressCount]);

//   useEffect(() => {
//     if (Platform.OS === 'android' && navIndex === 0) {
//       const backListener = BackHandler.addEventListener(
//         'hardwareBackPress',
//         handleBackPress
//       );

//       return () => {
//         backListener.remove();
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current); // Clear the timeout on unmount
//         }
//       };
//     }
//   }, [handleBackPress, navIndex]);

//   useEffect(() => {
//     const subscription = AppState.addEventListener('change', (nextAppState) => {
//       if (nextAppState === 'active') {
//         setBackPressCount(0); // Reset backPressCount when app comes to foreground
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current); // Clear any existing timeout
//         }
//       }
//     });

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       // Reset backPressCount when the screen gains focus
//       setBackPressCount(0);
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current); // Clear any existing timeout
//       }

//       return () => {
//         // Reset backPressCount when the screen loses focus
//         setBackPressCount(0);
//         if (timeoutRef.current) {
//           clearTimeout(timeoutRef.current); // Clear any existing timeout
//         }
//       };
//     }, [])
//   );

//   const carouselData = [
//     {
//       id: 1,
//       image: require('../assets/images/collect.png'),
//       title: 'COLLECT',
//       description: 'Collect standardized bottles and insert them into the designated bin. Let\'s start now, Cdmians!',
//     },
//     {
//       id: 2,
//       image: require('../assets/images/reward.png'),
//       title: 'REWARD',
//       description: 'Accumulate enough points to redeem exclusive rewards.',
//     },
//     {
//       id: 3,
//       image: require('../assets/images/repeat.png'),
//       title: 'REPEAT',
//       description: 'Let\'s repeat the process altogether, Cdmians! Get your rewards, Go for the Green!',
//     },
//   ];

//   const leaderboardData = [
//     { id: 1, name: 'John Doe', points: 150 },
//     { id: 2, name: 'Jane Smith', points: 120 },
//     { id: 3, name: 'Alice Johnson', points: 100 },
//   ];

//   return (
//     <SafeAreaProvider>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.greeting}>Hi, {userName}!</Text>
//           <Pressable onPress={() => navigation.navigate('Rewards')}>
//             <Ionicons name="notifications" size={wp('6%')} color="#83951c" />
//           </Pressable>
//         </View>
//         <ScrollView showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollView}
//           refreshControl={
//             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//           }>



//           <View style={styles.scanContainer}>
//             <View style={styles.scanText}>
//               <View style={styles.scanButton}>
//                 <Pressable onPress={() => navigation.navigate('Scanner')}>
//                   <MaterialCommunityIcons name="line-scan" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
//                 </Pressable>
//               </View>
//               <Text style={styles.scanButtonText}>Scan Bottle</Text>
//             </View>
//             <View style={styles.scanText}>
//               <View style={styles.scanButton}>
//                 <Pressable onPress={() => navigation.navigate('Scanner')}>
//                   <Ionicons name="search" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
//                 </Pressable>
//               </View>
//               <Text style={styles.scanButtonText}>Manual Search</Text>
//             </View>
//             <View style={styles.scanText}>
//               <View style={styles.scanButton}>
//                 <Pressable onPress={() => navigation.navigate('Scanner')}>
//                   <MaterialCommunityIcons name="bottle-soda-classic-outline" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
//                 </Pressable>
//               </View>
//               <Text style={styles.scanButtonText}>My Bottles</Text>
//             </View>
//           </View>
//           <View >
//             <Text style={{ fontFamily: 'Poppins-Bold', fontSize: hp('2.5%'), color: '#455e14', marginLeft: hp('2%') }}>Activity</Text>
//           </View>

//           <View style={{ marginBottom: hp('4%') }}>
//             <View style={styles.infoContainer}>
//               <View style={styles.infoBox}>
//                 <Text style={styles.infoTitle}>Points</Text>
//                 <Text style={styles.infoValue}>{points}</Text>
//               </View>
//               <View style={styles.infoBox}>
//                 <Text style={styles.infoTitle}>CO2 Reduced</Text>
//                 <Text style={styles.infoValue}>{co2Reduction} kg</Text>
//               </View>
//             </View>
//             <View style={styles.infoContainer}>
//               <View style={styles.infoBox}>
//                 <Text style={styles.infoTitle}>Points</Text>
//                 <Text style={styles.infoValue}>{points}</Text>
//               </View>
//               <View style={styles.infoBox}>
//                 <Text style={styles.infoTitle}>CO2 Reduced</Text>
//                 <Text style={styles.infoValue}>{co2Reduction} kg</Text>
//               </View>
//             </View>
//           </View>

//           <View style={{ bottom: hp('3%') }}>
//             <View style={styles.carouselContainer}>
//               <Carousel
//                 loop
//                 width={wp('92%')}
//                 height={hp('20%')}
//                 autoPlay={true}
//                 mode="parallax"
//                 autoPlayInterval={4000}
//                 data={carouselData}
//                 scrollAnimationDuration={1000}
//                 modeConfig={{
//                   parallaxScrollingScale: 0.95,
//                   parallaxScrollingOffset: wp('5%'),
//                 }}
//                 renderItem={({ item }) => (
//                   <View style={styles.carouselItem}>
//                     <View style={styles.carouselImageContainer}>
//                       <Image source={item.image} style={styles.carouselImage} />
//                       <Text style={styles.carouselTitle}>{item.title}</Text>
//                     </View>
//                     <Text style={styles.carouselDescription}>{item.description}</Text>
//                   </View>
//                 )}
//               />
//             </View>

//             {/* Leaderboard Container */}
//             <View style={styles.leaderboardContainer} >
//               <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//                 <Text style={styles.leaderboardTitle}>Leaderboard</Text>
//                 <Pressable onPress={() => navigation.navigate('Leaderboard')}>
//                   <Text style={styles.seeAllText}>See All</Text>
//                 </Pressable>
//               </View>
//               <ScrollView vertical style={styles.leaderboardScrollView} showsVerticalScrollIndicator={true}>
//               {leaderboardData.map((user) => (
//                 <View key={user.id} style={styles.leaderboardItem}>
//                   <Text style={styles.leaderboardName}>{user.name}</Text>
//                   <Text style={styles.leaderboardPoints}>{user.points} points</Text>
//                 </View>
//               ))}
//             </ScrollView>
//             </View>

//             <View style={{ marginBottom: hp('5%') }}>
//               <View >
//                 <Text style={{ fontFamily: 'Poppins-Bold', fontSize: hp('2.5%'), color: '#455e14', marginLeft: hp('2%') }}>About</Text>
//               </View>
//               <View style={styles.bottom}>
//                 <Pressable style={styles.button} onPress={() => navigation.navigate('RecyclingInfo')}>
//                   <Text style={styles.buttonText}>Learn More About Recycling</Text>
//                 </Pressable>
//                 <Pressable style={styles.button} onPress={() => navigation.navigate('Track')}>
//                   <Text style={styles.buttonText}>Track Your Recycling</Text>
//                 </Pressable>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: wp('3%'),
//     backgroundColor: '#f5f3f8',
//     paddingVertical: hp('5%'),
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: hp('2%'),
//   },
//   greeting: {
//     fontSize: hp('2.5%'),
//     color: '#455e14',
//     fontFamily: 'Poppins-Bold',
//   },
//   rewardsButtonText: {
//     color: '#fff',
//     fontFamily: 'Poppins-Bold',
//   },
//   scanContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: hp('2%'),
//     padding: wp('2%'),
//     width: wp('80%'),
//     alignSelf: 'center',
//   },
//   scanButton: {
//     backgroundColor: 'white',
//     borderRadius: wp('3%'),
//     alignItems: 'center',
//     width: wp('20%'),
//     height: hp('9%'),
//     flexDirection: 'column',
//     justifyContent: 'center',
//     marginBottom: hp('1%'),
//   },
//   scanText: {
//     flexDirection: 'column',
//     alignItems: 'center',
//   },
//   scanButtonIcon: {
//     alignSelf: 'center',
//   },
//   scanButtonText: {
//     color: '#455e14',
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: hp('1.3%'),
//   },
//   infoContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: hp('2%'),
//   },
//   infoBox: {
//     backgroundColor: '#e5eeda',
//     padding: hp('2%'),
//     borderRadius: wp('3%'),
//     flex: 1,
//     marginHorizontal: hp('1%'),
//     height: hp('10%'),
//   },
//   infoTitle: {
//     fontSize: hp('1.6%'),
//     color: '#455e14',
//     fontFamily: 'Poppins-Regular',
//   },
//   infoValue: {
//     fontSize: hp('1.7%'),
//     color: '#455e14',
//     fontWeight: 'bold',
//     fontFamily: 'Poppins-Bold',
//   },
//   carouselContainer: {
//     flex: 1,
//     alignSelf: 'center',
//   },
//   carouselImageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   carouselTitle: {
//     fontSize: hp('2.5%'),
//     color: '#83951c',
//     fontFamily: 'Poppins-Black',
//     textAlign: 'center',
//   },
//   carouselItem: {
//     flex: 1,
//     flexDirection: 'row',
//     borderWidth: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: wp('5%'),
//     borderColor: '#83951c',
//     padding: hp('2%'),
//     backgroundColor: 'white',
//   },
//   carouselImage: {
//     width: wp('25%'),
//     height: hp('11%'),
//     resizeMode: 'contain',
//   },
//   carouselDescription: {
//     flex: 1,
//     textAlign: 'center',
//     fontSize: hp('1.8%'),
//     color: 'white',
//     fontFamily: 'Poppins-SemiBold',
//     backgroundColor: '#83951c',
//     borderTopLeftRadius: wp('20%'),
//     borderTopRightRadius: wp('5%'),
//     borderBottomRightRadius: wp('5%'),
//     left: wp('5%'),
//     height: hp('20%'),
//     textAlignVertical: 'center',
//     borderColor: '#83951c',
//     borderWidth: 1,
//     padding: hp('3%'),
//   },
//   leaderboardContainer: {
//     marginVertical: hp('3%'),
//     padding: hp('2%'),
//     backgroundColor: 'white',
//     borderRadius: wp('5%'),
//     marginBottom: hp('3%'),
//     height: hp('30%'),
//   },
//   leaderboardTitle: {
//     fontSize: hp('2.5%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#455e14',
//     marginBottom: hp('1%'),
//   },
//   seeAllText: {
//     fontSize: hp('2%'),
//     color: '#83951c',
//     fontFamily: 'Poppins-Bold',
//     textAlign: 'right',
//     marginRight: hp('1.5%'),
//   },
//   leaderboardScrollView: {
//     flex: 1,
//   },
//   leaderboardItem: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: hp('1%'),
//     borderBottomWidth: 1,
//     borderBottomColor: '#bdd299',
//   },
//   leaderboardName: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Regular',
//     color: '#455e14',
//   },
//   leaderboardPoints: {
//     fontSize: hp('2%'),
//     fontFamily: 'Poppins-Bold',
//     color: '#7a9b57',
//   },
//   bottom: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: hp('2%'),
//     alignSelf: 'center',
//   },
//   button: {
//     padding: hp('2%'),
//     borderRadius: wp('3%'),
//     flex: 1,
//     marginHorizontal: hp('1%'),
//     borderColor: '#bdd299',
//     borderWidth: 1,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     height: hp('12%'),
//     flexDirection: 'column',
//     justifyContent: 'center',
//     marginBottom: hp('1%'),
//   },
//   buttonText: {
//     color: '#455e14',
//     fontFamily: 'Poppins-SemiBold',
//     fontSize: hp('1.6%'),
//   },
// });

import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, Platform, Dimensions, ToastAndroid, AppState, RefreshControl, ScrollView, Pressable, Image } from 'react-native';
import { useSnackbar } from '../components/SnackbarContext';
import { useNavigationState, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserContext } from '../context/UserContext'; // Import UserContext

export default function HomeScreen({ navigation }) {
  const { user } = useContext(UserContext); // Use user data from context
  const userName = user ? user.name : 'Guest'; // Replace with actual user's name
  const points = user ? user.points : 0;
  const co2Reduction = user ? user.co2Reduction : 0;
  const bottleGoal = user ? user.bottleGoal : 0;
  const recycledBottles = user ? user.recycledBottles : 0;
  const { showSnackbar } = useSnackbar();
  const width = Dimensions.get('window').width;

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
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

  const leaderboardData = [
    { id: 1, name: 'John Doe', points: 150 },
    { id: 2, name: 'Jane Smith', points: 120 },
    { id: 3, name: 'Alice Johnson', points: 100 },
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
        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>



          <View style={styles.scanContainer}>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => navigation.navigate('Scanner')}>
                  <MaterialCommunityIcons name="line-scan" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>Scan Bottle</Text>
            </View>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => navigation.navigate('Scanner')}>
                  <Ionicons name="search" size={wp('9%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>Manual Search</Text>
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
                <Text style={styles.infoTitle}>Points</Text>
                <Text style={styles.infoValue}>{points}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>CO2 Reduced</Text>
                <Text style={styles.infoValue}>{co2Reduction} kg</Text>
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>Points</Text>
                <Text style={styles.infoValue}>{points}</Text>
              </View>
              <View style={styles.infoBox}>
                <Text style={styles.infoTitle}>CO2 Reduced</Text>
                <Text style={styles.infoValue}>{co2Reduction} kg</Text>
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
            <View style={styles.leaderboardContainer} >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.leaderboardTitle}>Leaderboard</Text>
                <Pressable onPress={() => navigation.navigate('Leaderboard')}>
                  <Text style={styles.seeAllText}>See All</Text>
                </Pressable>
              </View>
              <ScrollView vertical style={styles.leaderboardScrollView} showsVerticalScrollIndicator={true}>
              {leaderboardData.map((user) => (
                <View key={user.id} style={styles.leaderboardItem}>
                  <Text style={styles.leaderboardName}>{user.name}</Text>
                  <Text style={styles.leaderboardPoints}>{user.points} points</Text>
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
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('3%'),
    backgroundColor: '#f5f3f8',
    paddingVertical: hp('5%'),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  greeting: {
    fontSize: hp('2.5%'),
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
    padding: hp('2%'),
    borderRadius: wp('3%'),
    flex: 1,
    marginHorizontal: hp('1%'),
    height: hp('10%'),
  },
  infoTitle: {
    fontSize: hp('1.6%'),
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    fontSize: hp('1.7%'),
    color: '#455e14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
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
    height: hp('30%'),
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
  leaderboardName: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  leaderboardPoints: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#7a9b57',
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
});