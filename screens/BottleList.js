import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, BackHandler, TextInput, RefreshControl, ActivityIndicator } from 'react-native';
import { getAvailableBottles } from './bottleService';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { 
  FadeInUp, 
  withRepeat, 
  withSequence, 
  withTiming, 
  useAnimatedStyle, 
  useSharedValue 
} from 'react-native-reanimated';
import { useBackHandler } from '../hooks/useBackHandler';

// Separate component for the skeleton loader
const SkeletonLoader = () => {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.skeletonLoader, animatedStyle]} />
  );
};

// Separate component for bottle item
const BottleItem = React.memo(({ item, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 100)}
      style={styles.bottleItemContainer}
    >
      <TouchableOpacity 
        style={styles.bottleItem}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          {!imageLoaded && <SkeletonLoader />}
          <Image 
            source={{ uri: item.image_url }} 
            style={[
              styles.bottleImage,
              !imageLoaded && styles.hiddenImage
            ]}
            onLoad={() => setImageLoaded(true)}
          />
        </View>
        <View style={styles.bottleInfo}>
          <Text style={styles.bottleName} numberOfLines={2}>{item.brand_name}</Text>
          <View style={styles.sizeContainer}>
            <MaterialCommunityIcons name="bottle-soda-outline" size={wp('4%')} color="#83951c" />
            <Text style={styles.bottleDescription}>{item.size} {item.size_unit}</Text>
          </View>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Points</Text>
            <Text style={styles.pointsValue}>{item.points}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
});

const BottleList = ({ navigation }) => {
  const [bottles, setBottles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBottles, setFilteredBottles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBottles();
  }, []);

  useEffect(() => {
    filterBottles();
  }, [searchQuery, bottles]);

  const fetchBottles = async () => {
    setIsLoading(true);
    try {
      const availableBottles = await getAvailableBottles();
      setBottles(availableBottles);
      setFilteredBottles(availableBottles);
    } catch (error) {
      console.error('Error fetching bottles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterBottles = () => {
    const filtered = bottles.filter(bottle =>
      bottle.brand_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBottles(filtered);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBottles();
    setRefreshing(false);
  };

  const renderBottleItem = useCallback(({ item, index }) => (
    <BottleItem item={item} index={index} />
  ), []);

  useBackHandler(navigation);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Bottles</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={hp('2.5%')} color="#455e14" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search bottles..."
          placeholderTextColor="#83951c"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#83951c" />
          <Text style={styles.loadingText}>Loading bottles...</Text>
        </View>
      ) : filteredBottles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="bottle-soda-outline" size={hp('8%')} color="#83951c" />
          <Text style={styles.noResultsText}>No bottles found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredBottles}
          renderItem={renderBottleItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: hp('5%'),
  },
  header: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: wp('5%'),
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchBar: {
    flex: 1,
    height: hp('6%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  noResultsText: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: hp('2%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: wp('4%'),
  },
  bottleItemContainer: {
    width: wp('43%'),
    marginBottom: hp('2%'),
  },
  bottleItem: {
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  imageContainer: {
    backgroundColor: '#f8f9fa',
    padding: wp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('18%'),
  },
  bottleImage: {
    width: wp('30%'),
    height: hp('15%'),
    resizeMode: 'contain',
  },
  bottleInfo: {
    padding: wp('3%'),
  },
  bottleName: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('1%'),
  },
  sizeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('1%'),
  },
  bottleDescription: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    marginLeft: wp('1%'),
  },
  pointsContainer: {
    backgroundColor: '#f0f4e8',
    borderRadius: wp('2%'),
    padding: wp('2%'),
    alignItems: 'center',
  },
  pointsLabel: {
    fontSize: hp('1.4%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
  pointsValue: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  columnWrapper: {
    justifyContent: 'space-evenly',
  },
  skeletonLoader: {
    position: 'absolute',
    width: wp('30%'),
    height: hp('15%'),
    backgroundColor: '#e1e9d1',
    borderRadius: wp('2%'),
  },
  hiddenImage: {
    opacity: 0,
  },
});

export default BottleList;