import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert, Platform, Dimensions, ToastAndroid, AppState, RefreshControl, ScrollView, Pressable } from 'react-native';
import { useSnackbar } from '../components/SnackbarContext';
import { useNavigationState, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
export default function HomeScreen({ navigation }) {
  const userName = 'Juan Dela Cruz'; // Replace with actual user's name
  const points = 120;
  const co2Reduction = 18;
  const bottleGoal = 100;
  const recycledBottles = 60;
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
                  <MaterialCommunityIcons name="line-scan" size={wp('8%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>Scan Bottle</Text>
            </View>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => navigation.navigate('Scanner')}>
                  <Ionicons name="search" size={wp('8%')} color="#83951c" style={styles.scanButtonIcon} />
                </Pressable>
              </View>
              <Text style={styles.scanButtonText}>Manual Entry</Text>
            </View>
            <View style={styles.scanText}>
              <View style={styles.scanButton}>
                <Pressable onPress={() => navigation.navigate('Scanner')}>
                  <MaterialCommunityIcons name="bottle-soda-classic-outline" size={wp('8%')} color="#83951c" style={styles.scanButtonIcon} />
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

          <View style={{ flex: 1, bottom: hp('5%'), alignSelf: 'center' }}>
            <Carousel
              loop
              width={width}
              height={width / 2.3}
              autoPlay={true}
              mode="parallax"
              autoPlayInterval={5000}
              data={[...new Array(2).keys()]}
              scrollAnimationDuration={1000}
              modeConfig={{
                parallaxScrollingScale: 0.91,
                parallaxScrollingOffset: 53,
              }}
              renderItem={({ index }) => (
                <View
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: 'center',
                    borderRadius: 20,
                    borderColor: '#455e14',
                  }}
                >
                  <Text style={{ textAlign: 'center', fontSize: 30 }}>
                    {index}
                  </Text>
                </View>
              )}
            />
          </View>
          <View style={{ bottom: hp('5%') }}>
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