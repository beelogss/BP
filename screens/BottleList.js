import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, BackHandler, TextInput, RefreshControl } from 'react-native';
import { getAvailableBottles } from './bottleService'; // Adjust the path to your bottleService
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BottleList = ({ navigation }) => {
  const [bottles, setBottles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBottles, setFilteredBottles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchBottles();
  }, []);

  useEffect(() => {
    filterBottles();
  }, [searchQuery, bottles]);

  const fetchBottles = async () => {
    const availableBottles = await getAvailableBottles();
    setBottles(availableBottles);
    setFilteredBottles(availableBottles);
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

  const renderBottleItem = ({ item }) => (
    <TouchableOpacity style={styles.bottleItem}>
      <Image source={{ uri: item.image_url }} style={styles.bottleImage} />
      <View style={styles.bottleInfo}>
        <Text style={styles.bottleName}>{item.brand_name}</Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.bottleDescription}>{item.size} </Text>
          <Text style={styles.bottleDescription}>{item.size_unit}</Text>
          
        </View>
        <Text style={styles.bottlePoints}>Points: <Text style={{ fontFamily: 'Poppins-Bold' }}>{item.points}</Text></Text>
      </View>
    </TouchableOpacity>
  );

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
    <View style={styles.container}>
      <Text style={styles.header}>Available Bottles</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={hp('3%')} color="#455e14" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search bottles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {filteredBottles.length === 0 ? (
        <Text style={styles.noResultsText}>-- No results found --</Text>
      ) : (
        <FlatList
          data={filteredBottles}
          renderItem={renderBottleItem}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          numColumns={2} // Set the number of columns to 2
          columnWrapperStyle={styles.columnWrapper} // Add this line to style the columns
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
    padding: 20,
    backgroundColor: 'whitesmoke',
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: wp('2%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
  },
  searchIcon: {
    marginRight: wp('2%'),
  },
  searchBar: {
    flex: 1,
    height: hp('5%'),
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
  },
  noResultsText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    textAlign: 'center',
    marginTop: hp('2%'),
  },
  bottleItem: {
    flexDirection: 'column',
    padding: wp('3%'),
    borderColor: '#ddd',
    backgroundColor: 'white',
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
    width: wp('42%'), // Adjust the width to fit two columns
  },
  bottleImage: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: 10,
    resizeMode: 'contain',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  bottleInfo: {
    marginTop: hp('1%'),
    alignItems: 'center',
  },
  bottleName: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
  },
  bottleDescription: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    marginTop: hp('0.5%'),
  },
  bottlePoints: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    marginTop: hp('0.5%'),
  },
  columnWrapper: {
    justifyContent: 'space-between', // Add this line to space out the columns
  },
});

export default BottleList;