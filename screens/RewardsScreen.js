import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { getAvailableRewards } from './rewardsServices'; // Fetch from Firestore
import RewardActionSheet from '../components/RewardActionSheet'; // Import the centralized ActionSheet
import { FontAwesome6, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SheetManager } from 'react-native-actions-sheet';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { Menu, Provider } from 'react-native-paper'; // Add this import

const RewardsScreen = ({ navigation }) => {
  const { user } = useContext(UserContext); // Use user data from context
  const [rewards, setRewards] = useState([]);
  const [filteredRewards, setFilteredRewards] = useState([]);
  const [selectedReward, setSelectedReward] = useState(null);
  const points = user ? user.points : 0;
  const [loading, setLoading] = useState(true);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  
  useEffect(() => {
    fetchRewards();
  }, []);

  // Add this effect to handle filtering
  useEffect(() => {
    applyFilter(activeFilter);
  }, [rewards, activeFilter, points]);

  const fetchRewards = async () => {
    setLoading(true);
    const availableRewards = await getAvailableRewards();
    setRewards(availableRewards);
    setFilteredRewards(availableRewards);
    setLoading(false);
  };

  // Add filter function
  const applyFilter = (filterType) => {
    let filtered = [...rewards];
    
    switch (filterType) {
      case 'canClaim':
        filtered = rewards.filter(reward => reward.points <= points && reward.stock > 0);
        break;
      case 'lowToHigh':
        filtered = [...rewards].sort((a, b) => a.points - b.points);
        break;
      case 'highToLow':
        filtered = [...rewards].sort((a, b) => b.points - a.points);
        break;
      default: // 'all'
        filtered = rewards;
    }
    
    setFilteredRewards(filtered);
    setActiveFilter(filterType);
  };

  const handleRewardPress = (reward) => {
    setSelectedReward(reward);
    SheetManager.show('reward-details-rewards-screen');
  };

  const renderRewardItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.rewardItem,
        item.points > points && styles.insufficientPointsItem
      ]} 
      onPress={() => handleRewardPress(item)}
    >
      {/* Stock Badge */}
      {item.stock <= 5 && item.stock > 0 && (
        <View style={styles.stockBadge}>
          <Text style={styles.stockBadgeText}>Only {item.stock} left!</Text>
        </View>
      )}
      {item.stock === 0 && (
        <View style={[styles.stockBadge, styles.outOfStockBadge]}>
          <Text style={styles.stockBadgeText}>Out of Stock</Text>
        </View>
      )}

      <Image source={item.image} style={styles.rewardImage} />
      
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName} numberOfLines={2}>{item.name}</Text>
        
        <View style={styles.pointsRow}>
          <Image
            style={styles.pointsIcon}
            source={require('../assets/images/points.png')}
          />
          <Text style={styles.rewardPoints}>{item.points}</Text>
          
          {/* Points Indicator */}
          <View style={styles.pointsIndicator}>
            {item.points > points ? (
              <View style={styles.insufficientPoints}>
                <Text style={styles.insufficientPointsText}>Need {item.points - points} more</Text>
              </View>
            ) : (
              <View style={styles.canClaimBadge}>
                <FontAwesome5 name="check-circle" size={wp('3%')} color="#4CAF50" />
                <Text style={styles.canClaimText}>Can Claim</Text>
              </View>
            )}
          </View>
        </View>
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

  const renderEmptyState = () => {
    let content = {
      icon: 'gift-off',
      title: 'No Rewards Found',
      subtitle: 'Try adjusting your filter',
      buttonText: 'View All Rewards'
    };

    // Customize content based on active filter
    switch (activeFilter) {
      case 'canClaim':
        content = {
          icon: 'gift-off',
          title: 'No Rewards You Can Claim Yet',
          subtitle: 'Keep earning points to claim rewards!',
          buttonText: 'View All Rewards'
        };
        break;
      case 'available':
        content = {
          icon: 'package-variant-off',
          title: 'No Available Rewards',
          subtitle: 'Check back later for new rewards',
          buttonText: 'View All Rewards'
        };
        break;
      case 'lowStock':
        content = {
          icon: 'package-variant-closed',
          title: 'No Low Stock Items',
          subtitle: 'All rewards are well stocked',
          buttonText: 'View Available Rewards'
        };
        break;
      case 'lowToHigh':
      case 'highToLow':
        content = {
          icon: 'sort-variant-remove',
          title: 'No Rewards to Sort',
          subtitle: 'Try a different filter option',
          buttonText: 'Reset Filters'
        };
        break;
    }

    return (
      <View style={styles.noResultsContainer}>
        <MaterialCommunityIcons 
          name={content.icon} 
          size={hp('15%')} 
          color="#bdd299" 
        />
        <Text style={styles.noResultsText}>{content.title}</Text>
        <Text style={styles.noResultsSubText}>{content.subtitle}</Text>
        <TouchableOpacity 
          style={styles.resetFilterButton}
          onPress={() => applyFilter('all')}
        >
          <Text style={styles.resetFilterButtonText}>{content.buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.topContainer}>
          <Text style={styles.header}>Rewards</Text>
          <View style={styles.headerRow}>
            <View style={styles.headerContainer}>
              <View style={styles.pointsIconContainer}>
                <Image
                  style={styles.pointsImage}
                  source={require('../assets/images/points.png')}
                />
              </View>
              <View style={styles.pointsContainer}>
                <Text style={styles.points}>
                  {points} 
                  <Text style={styles.pointsLabel}>points</Text>
                </Text>
                <Text style={styles.pointsSubtext}>Total Points Earned</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.claimedRewardsButton}
              onPress={() => navigation.navigate('ClaimedRewards')}
            >
              <View style={styles.claimedRewardsContent}>
                <MaterialCommunityIcons 
                  name="gift-open-outline" 
                  size={wp('8%')} 
                  color="#7a9b57" 
                />
                <Text style={styles.claimedRewardsButtonText}>View Rewards</Text>
                <Text style={styles.claimedRewardsSubtext}>Check claimed items</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.RewardContainer}>
          <View style={styles.catalogHeader}>
            <Text style={styles.popularRewards}>Rewards Catalog</Text>
            
            <Menu
              visible={showFilterMenu}
              onDismiss={() => setShowFilterMenu(false)}
              contentStyle={styles.menuContent}
              anchor={
                <TouchableOpacity 
                  style={styles.filterButton}
                  onPress={() => setShowFilterMenu(true)}
                >
                  <View style={styles.filterButtonContent}>
                    <MaterialCommunityIcons 
                      name="filter-variant" 
                      size={wp('6%')} 
                      color="#455e14" 
                    />
                    {activeFilter !== 'all' && (
                      <View style={styles.filterActiveDot} />
                    )}
                  </View>
                </TouchableOpacity>
              }
            >
              <Menu.Item 
                onPress={() => {
                  applyFilter('all');
                  setShowFilterMenu(false);
                }} 
                title="All Rewards"
                titleStyle={[styles.menuItemText, activeFilter === 'all' && styles.activeMenuItemText]}
              />
              <Menu.Item 
                onPress={() => {
                  applyFilter('canClaim');
                  setShowFilterMenu(false);
                }} 
                title="Can Claim"
                titleStyle={[styles.menuItemText, activeFilter === 'canClaim' && styles.activeMenuItemText]}
              />
              <Menu.Item 
                onPress={() => {
                  applyFilter('lowToHigh');
                  setShowFilterMenu(false);
                }} 
                title="Points: Low to High"
                titleStyle={[styles.menuItemText, activeFilter === 'lowToHigh' && styles.activeMenuItemText]}
              />
              <Menu.Item 
                onPress={() => {
                  applyFilter('highToLow');
                  setShowFilterMenu(false);
                }} 
                title="Points: High to Low"
                titleStyle={[styles.menuItemText, activeFilter === 'highToLow' && styles.activeMenuItemText]}
              />
            </Menu>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#7a9b57" style={styles.loader} />
          ) : filteredRewards.length === 0 ? (
            renderEmptyState()
          ) : (
            <FlatList
              data={filteredRewards}
              renderItem={renderRewardItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              columnWrapperStyle={styles.columnWrapper}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
        <RewardActionSheet selectedReward={selectedReward} points={points} sheetId="reward-details-rewards-screen" user={user} />
      </View>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  topContainer: {
    backgroundColor: '#bdd299',
    borderBottomLeftRadius: wp('6%'),
    borderBottomRightRadius: wp('6%'),
    paddingTop: hp('4%'),
    paddingBottom: hp('2%'),
    paddingHorizontal: wp('4%'),
    elevation: 4,
  },
  header: {
    fontSize: hp('2.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('1.5%'),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContainer: {
    flex: 1,
    backgroundColor: 'white',
    height: hp('9%'),
    padding: wp('2.5%'),
    borderRadius: wp('4%'),
    marginRight: wp('2%'),
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  pointsIconContainer: {
    backgroundColor: '#f0f4e8',
    padding: wp('2.5%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsImage: {
    height: hp('3.5%'),
    width: wp('7%'),
    resizeMode: 'contain',
  },
  pointsContainer: {
    flexDirection: 'column',
    marginLeft: wp('2.5%'),
    flex: 1,
  },
  points: {
    fontSize: hp('2.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    lineHeight: hp('3.8%'),
  },
  pointsLabel: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
  },
  pointsSubtext: {
    fontSize: hp('1.3%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    opacity: 0.8,
  },
  claimedRewardsButton: {
    backgroundColor: 'white',
    borderRadius: wp('4%'),
    width: wp('42%'),
    height: hp('9%'),
    elevation: 2,
  },
  claimedRewardsContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('2%'),
  },
  claimedRewardsButtonText: {
    color: '#455e14',
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-SemiBold',
    marginTop: hp('0.5%'),
  },
  claimedRewardsSubtext: {
    color: '#83951c',
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins-Regular',
  },
  RewardContainer: {
    flex: 1,
    paddingHorizontal: wp('4%'),
    marginTop: hp('1%'),
  },
  rewardItem: {
    flexDirection: 'column',
    padding: wp('3%'),
    backgroundColor: 'white',
    borderRadius: wp('8%'),
    width: wp('42%'),
    height: hp('28%'), // Slightly increased height
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#7a9b57',
    margin: wp('2%'),
    elevation: 3, // Add shadow
    position: 'relative', // For badge positioning
  },
  rewardImage: {
    width: wp('35%'),
    height: hp('15%'),
    borderRadius: 10,
    resizeMode: 'contain',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  rewardInfo: {
    marginLeft: hp('1%'),
  },
  rewardName: {
    fontSize: hp('1.7%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  rewardPoints: {
    fontSize: hp('1.7%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    marginTop: hp('0.5%'),
    marginLeft: wp('.5%'),
    marginRight: wp('1%'),
  },
  columnWrapper: {
    justifyContent: 'space-between', // Add this line to space out the columns
  },
  catalogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('1.5%'),
  },
  popularRewards: {
    fontSize: hp('2.2%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  filterButton: {
    padding: wp('2%'),
  },
  insufficientPointsItem: {
    borderColor: '#ddd',
    opacity: 0.8,
  },
  stockBadge: {
    position: 'absolute',
    top: hp('1%'),
    right: wp('2%'),
    backgroundColor: '#FFA000',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: wp('2%'),
    zIndex: 1,
  },
  outOfStockBadge: {
    backgroundColor: '#FF5252',
  },
  stockBadgeText: {
    color: 'white',
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  pointsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  pointsIcon: {
    height: hp('2%'),
    width: wp('4%'),
    marginRight: wp('1%'),
  },
  insufficientPoints: {
    marginLeft: 'auto',
    backgroundColor: '#FFE0B2',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('2%'),
  },
  insufficientPointsText: {
    color: '#F57C00',
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  canClaimBadge: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    borderRadius: wp('2%'),
  },
  canClaimText: {
    color: '#4CAF50',
    fontSize: hp('1.2%'),
    fontFamily: 'Poppins-SemiBold',
    marginLeft: wp('1%'),
  },
  listContainer: {
    paddingBottom: hp('20%'), // Add padding at the bottom for better scrolling
  },
  filterButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterActiveDot: {
    width: wp('2%'),
    height: wp('2%'),
    backgroundColor: '#83951c',
    borderRadius: wp('1%'),
    position: 'absolute',
    top: 0,
    right: 0,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
  },
  noResultsText: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginTop: hp('2%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  noResultsSubText: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    marginTop: hp('1%'),
    textAlign: 'center',
    paddingHorizontal: wp('5%'),
  },
  resetFilterButton: {
    backgroundColor: '#83951c',
    paddingHorizontal: wp('6%'),
    paddingVertical: hp('1.5%'),
    borderRadius: wp('5%'),
    marginTop: hp('3%'),
    elevation: 2,
  },
  resetFilterButtonText: {
    color: 'white',
    fontSize: hp('2%'),
    fontFamily: 'Poppins-SemiBold',
  },
  menuContent: {
    backgroundColor: 'white',
    borderRadius: wp('3%'),
    marginTop: hp('1%'),
    elevation: 3,
  },
  menuItemText: {
    fontFamily: 'Poppins-Regular',
    fontSize: hp('1.8%'),
    color: '#455e14',
  },
  activeMenuItemText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#83951c',
  },
  loader: {
    marginTop: hp('25%'),
  },
  pointsIndicator: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

export default RewardsScreen;