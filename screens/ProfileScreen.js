import React, { useState, useEffect, useContext, useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Avatar, Divider } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AlertPro from "react-native-alert-pro";
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // Import UserContext
import AsyncStorage from '@react-native-async-storage/async-storage'; // Add this if not already imported
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext); // Use user data from context
  const userName = user ? user.name : 'Guest'; // Replace with actual user's name
  const userStudentNumber = user ? user.studentNumber : ''; // Replace with actual user's email
  const avatar = user ? user.avatar : null; // Replace with actual user's avatar
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility state
  const points = user ? user.points : 0;
  const bottleCount = user ? user.bottleCount : 0;
  const alertRef = useRef(null); // Use useRef instead of this

  // const activityData = [
  //   { name: 'Energy Consumption', icon: 'energy-savings-leaf', value: '0.00', iconType: 'MaterialIcons' },
  //   { name: 'Tree/s Planted', icon: 'tree', value: '0.00', iconType: 'Entypo' },
  //   { name: 'Transportation', icon: 'car-side', value: '0.00', iconType: 'FontAwesome5' },
  // ];

  const navigations = useNavigation();

  useEffect(() => {
    const handleBackPress = () => {
      navigations.goBack(); // Navigate to Home screen
      return true; // Prevent default behavior (exit app)
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [navigations]);

  const handleLogout = async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();
      // Close alert first
      alertRef.current.close();
      // Clear user context
      setUser(null);
      // Navigate to Login IMMEDIATELY after clearing data
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Pressable onPress={() => setModalVisible(true)}>
              <Avatar.Image 
                size={wp('25%')} 
                source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')} 
                style={styles.avatar} 
              />
            </Pressable>
            <Pressable style={styles.editIconContainer} onPress={() => navigation.navigate('EditProfile')}>
              <MaterialCommunityIcons name="pencil-outline" size={wp('5%')} color="#455e14" />
            </Pressable>
          </View>
          
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
            <Text style={styles.userStudentNumber}>{userStudentNumber}</Text>
            <View style={styles.pointsContainer}>
              <Image
                style={styles.pointsIcon}
                source={require('../assets/images/points.png')}
              />
              <Text style={styles.pointsValue}>{points} points</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.contentContainer}
        style={styles.scrollView}
      >
        {/* Enhanced Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsCard}>
            <Text style={styles.journeyTitle}>Your Recycling Journey</Text>
            
            <View style={styles.mainStatsContainer}>
              <View style={styles.bottleIconContainer}>
                <MaterialCommunityIcons name="bottle-soda" size={wp('12%')} color="#83951c" />
              </View>
              <View style={styles.statsTextContainer}>
                <Text style={styles.statsValue}>{bottleCount}</Text>
                <Text style={styles.statsLabel}>Plastic Bottles Contributed</Text>
              </View>
            </View>

            <View style={styles.achievementBadge}>
              <MaterialCommunityIcons 
                name={bottleCount >= 50 ? "star-circle" : "star-circle-outline"} 
                size={wp('5%')} 
                color="#83951c" 
              />
              <Text style={styles.achievementText}>
                {bottleCount >= 50 
                  ? "Keep it up! Every bottle counts!" 
                  : `Start your recycling journey today!`}
              </Text>
            </View>
            
            <View style={styles.milestoneContainer}>
              <Text style={styles.milestoneText}>
                Thank you for helping create a cleaner environment!
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Settings</Text>
          <View style={styles.menuItems}>
            {[
              { icon: 'file-document-outline', label: 'Terms and Conditions', route: 'TermsAndConditions' },
              { icon: 'shield-lock-outline', label: 'Privacy Policy', route: 'PrivacyPolicy' },
              { icon: 'help-circle-outline', label: 'Help Center', route: 'HelpCenter' },
              { icon: 'alert-circle-outline', label: 'Report Problem', route: 'ReportProblem' },
              { icon: 'information-outline', label: 'About', route: 'About' },
            ].map((item, index) => (
              <Pressable 
                key={index}
                style={styles.menuItem} 
                onPress={() => navigation.navigate(item.route)}
              >
                <MaterialCommunityIcons name={item.icon} size={wp('6%')} color="#455e14" />
                <Text style={styles.menuItemText}>{item.label}</Text>
                <MaterialCommunityIcons name="chevron-right" size={wp('6%')} color="#83951c" />
              </Pressable>
            ))}
          </View>
        </View>

        {/* Contact Section */}
        <View style={styles.contactContainer}>
          <Text style={styles.menuTitle}>Connect With Us</Text>
          <View style={styles.contactButtons}>
            <Pressable 
              style={styles.contactButton} 
              onPress={() => Linking.openURL('https://bp-website-one.vercel.app/#')}
            >
              <MaterialCommunityIcons name="web" size={wp('7%')} color="#455e14" />
              <Text style={styles.contactButtonText}>Website</Text>
            </Pressable>
            <Pressable 
              style={styles.contactButton}
              onPress={() => navigation.navigate('Contact')}
            >
              <MaterialCommunityIcons name="email-outline" size={wp('7%')} color="#455e14" />
              <Text style={styles.contactButtonText}>Contact</Text>
            </Pressable>
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Pressable 
            style={styles.logoutButton} 
            onPress={() => alertRef.current.open()}
          >
            <MaterialCommunityIcons name="logout" size={wp('5%')} color="#ff4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Avatar Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        animationType="fade"
      >
        <Animated.View 
          entering={FadeIn}
          exiting={FadeOut}
          style={styles.modalContainer}
        >
          <Pressable 
            style={styles.modalBackground} 
            onPress={() => setModalVisible(false)} 
          />
          <Animated.View 
            entering={ZoomIn}
            style={styles.modalContent}
          >
            <Image
              source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')}
              style={styles.largeAvatar}
            />
            <Pressable 
              style={styles.modalCloseButton}
              onPress={() => setModalVisible(false)}
            >
              <View style={styles.closeButtonContainer}>
                <Ionicons name="close-circle" size={wp('12%')} color="#455e14" />
              </View>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </Modal>

      {/* Alert Pro Component */}
      <AlertPro
        ref={alertRef}
        onConfirm={handleLogout}
        onCancel={() => alertRef.current.close()}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        textCancel="Cancel"
        textConfirm="Logout"
        customStyles={{
          mask: { 
            backgroundColor: "rgba(0,0,0,0.4)" 
          },
          container: {
            borderWidth: 1,
            borderColor: "#455e14",
            borderRadius: wp('5%'),
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          },
          buttonCancel: { 
            backgroundColor: "#f0f0f0",
            elevation: 2,
          },
          buttonConfirm: { 
            backgroundColor: "#ff4444",
            elevation: 2,
          },
          textCancel: { 
            color: "#455e14",
            fontFamily: 'Poppins-Medium',
          },
          textConfirm: { 
            color: "#ffffff",
            fontFamily: 'Poppins-Medium',
          }
        }}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    backgroundColor: '#ffffff',
    padding: wp('5%'),
    paddingTop: hp('5%'),
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: -wp('5%'),
  },
  contentContainer: {
    paddingTop: wp('8%'),
    paddingBottom: hp('12%'),
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#e5eeda',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    padding: wp('2%'),
    elevation: 2,
  },
  userInfoContainer: {
    marginLeft: wp('5%'),
    flex: 1,
  },
  userName: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  userStudentNumber: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
    marginTop: hp('0.5%'),
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('1%'),
  },
  pointsIcon: {
    height: hp('2.5%'),
    width: wp('5%'),
  },
  pointsValue: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#83951c',
    marginLeft: wp('2%'),
  },
  statsContainer: {
    padding: wp('5%'),
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    padding: wp('4%'),
    elevation: 2,
  },
  journeyTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginBottom: hp('2%'),
  },
  mainStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5eeda',
    paddingBottom: hp('2%'),
    marginBottom: hp('2%'),
  },
  bottleIconContainer: {
    backgroundColor: '#f0f4e8',
    padding: wp('4%'),
    borderRadius: wp('4%'),
    marginRight: wp('4%'),
  },
  statsTextContainer: {
    flex: 1,
  },
  statsValue: {
    fontSize: wp('8%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
  },
  statsLabel: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
  },
  achievementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5eeda',
    padding: wp('3%'),
    borderRadius: wp('3%'),
    justifyContent: 'center',
  },
  achievementText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#83951c',
    marginLeft: wp('2%'),
  },
  menuContainer: {
    padding: wp('5%'),
  },
  menuTitle: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
    marginBottom: hp('2%'),
  },
  menuItems: {
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: wp('4%'),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    marginLeft: wp('3%'),
  },
  contactContainer: {
    padding: wp('5%'),
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: wp('5%'),
    padding: wp('4%'),
    elevation: 2,
  },
  contactButton: {
    alignItems: 'center',
    padding: wp('3%'),
  },
  contactButtonText: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    marginTop: hp('1%'),
  },
  logoutContainer: {
    paddingHorizontal: wp('5%'),
    paddingBottom: hp('2%'),
    marginTop: hp('2%'),
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: wp('4%'),
  },
  logoutText: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    color: 'red',
    marginLeft: wp('2%'),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('5%'),
    borderRadius: wp('5%'),
  },
  largeAvatar: {
    width: wp('90%'),
    height: wp('90%'),
    borderRadius: wp('45%'),
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
    marginBottom: hp('2%'),
  },
  modalCloseButton: {
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  closeButtonContainer: {
    backgroundColor: 'white',
    borderRadius: wp('10%'),
    padding: wp('1%'),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  tabTextActive: {
    color: '#455e14',
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp('3.2%'),
  },
  statsBoxContainer: {
    alignItems: 'center',
    marginVertical: hp('3%'),
    marginHorizontal: wp('20%'),
    padding: wp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: '#e5eeda',
    borderBottomRightRadius: wp('8%'),
    borderTopLeftRadius: wp('8%'),
  },
  savedAmountContainer: {
    alignItems: 'center',
  },
  savedAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('12%'),
    color: '#83951c',
  },
  buttonText: {
    color: 'red',
    fontSize: wp('4%'),
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    marginTop: hp('2%'),

  },
  milestoneContainer: {
    marginTop: hp('2%'),
    padding: wp('3%'),
    backgroundColor: '#f0f4e8',
    borderRadius: wp('3%'),
  },
  milestoneText: {
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    textAlign: 'center',
  },
});