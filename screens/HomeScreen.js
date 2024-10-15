import React, {useEffect, useState, useCallback, useRef} from 'react';
import { View, Text, TouchableOpacity, StyleSheet, BackHandler, Alert,Platform, Dimensions, ToastAndroid, AppState, RefreshControl, ScrollView} from 'react-native';
import { useSnackbar } from '../components/SnackbarContext'
import { useNavigationState, useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Carousel from 'react-native-reanimated-carousel';
export default function HomeScreen({ navigation }) {
  const userName = 'John Doe'; // Replace with actual user's name
  const points = 120;
  const co2Reduction = 18;
  const bottleGoal = 100;
  const recycledBottles = 60;
  const { showSnackbar } = useSnackbar();
  const width = Dimensions.get('window').width;

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // const navigations = useNavigation();
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
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {userName}</Text>
        <TouchableOpacity style={styles.rewardsButton} onPress={() => navigation.navigate('Rewards')}>
          <Text style={styles.rewardsButtonText}>Redeem Rewards</Text>
        </TouchableOpacity>
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

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecyclingInfo')}>
        <Text style={styles.buttonText}>Learn More About Recycling</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Track')}>
        <Text style={styles.buttonText}>Track Your Recycling</Text>
      </TouchableOpacity>
    </View>
    <View style={{ flex: 1 }}>
            <Carousel
                loop
                width={width}
                height={width / 2}
                autoPlay={true}
                mode= "parallax"
                autoPlayInterval={5000}
                data={[...new Array(2).keys()]}
                scrollAnimationDuration={1000}
                modeConfig={{
                  parallaxScrollingScale: 0.89,
                  parallaxScrollingOffset: 55,
                }}
                // onSnapToItem={(index) => console.log('current index:', index)}
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
        </ScrollView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
  rewardsButton: {
    backgroundColor: '#7a9b57',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  rewardsButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#bdd299',
    padding: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
  },
  infoTitle: {
    fontSize: 16,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    fontSize: 20,
    color: '#455e14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#83951c',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
