import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler, Pressable, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Avatar, Divider } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AlertPro from "react-native-alert-pro";
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../context/UserContext'; // Import UserContext
const { width, height } = Dimensions.get('window');

export default function ProfileScreen({ navigation }) {
  const { user } = useContext(UserContext); // Use user data from context
  const userName = user ? user.name : 'Guest'; // Replace with actual user's name
  const userStudentNumber = user ? user.studentNumber : ''; // Replace with actual user's email
  const avatar = user ? user.avatar : null; // Replace with actual user's avatar
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility state
  const points = user ? user.points : 0;
  const bottleCount = user ? user.bottleCount : 0;

  const activityData = [
    { name: 'Energy Consumption', icon: 'energy-savings-leaf', value: '0.00', iconType: 'MaterialIcons' },
    { name: 'Tree/s Planted', icon: 'tree', value: '0.00', iconType: 'Entypo' },
    { name: 'Transportation', icon: 'car-side', value: '0.00', iconType: 'FontAwesome5' },
  ];

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

  return (
    <View style={[styles.container, {}]}>
      {/* Header */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalBackground} />
          <View style={styles.modalContent}>
            <Image
              source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')}  // Replace with actual avatar image
              style={styles.largeAvatar}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerContainer}>


          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
            <View style={styles.avatarContainer}>
              <Pressable onPress={() => setModalVisible(true)}>
                <Avatar.Image size={wp('27%')} source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')} style={styles.avatar} />
              </Pressable>
              <Pressable style={styles.editIconContainer} onPress={() => navigation.navigate('EditProfile')}>
                <MaterialCommunityIcons name="pencil-outline" size={wp('6%')} color="#455e14" />
              </Pressable>
            </View>
            <View style={styles.verticalLine} />
            <View style={styles.headerItem}>

              <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{userName}</Text>
              <Text style={styles.userStudentNumber}>{userStudentNumber}</Text>
              <View style={styles.pointsContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', bottom: hp('0.5%') }}>
                  <Image
                    style={{ height: hp('2.5%'), width: wp('5%'), }}
                    source={require('../assets/images/points.png')}
                  />
                  <Text style={styles.pointsValue}>: {points}</Text>
                </View>

              </View>
            </View>

          </View>
          {/* <View style={styles.editSContainer}>
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.editSText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton} onPress={() => setModalVisible(true)}>
            <Text style={styles.editSText}>Share Contribution</Text>
          </TouchableOpacity>
        </View> */}
        </View>
        <Divider style={{ backgroundColor: '#7a9b57', height: .5 }} />



        {/* Statistics */}
        <View style={styles.statsBoxContainer}>

          <View style={styles.savedAmountContainer}>
            <Text style={styles.savedAmount}>{bottleCount}</Text>
          </View>
          <View style={styles.tabContainer}>
            <Text style={styles.tabTextActive}>Total Bottle Contribution</Text>
          </View>
        </View>

        {/* Information Section */}
        <View style={styles.infoContainer}>
          <Pressable style={styles.infoItem} onPress={() => navigation.navigate('TermsAndConditions')}>
            <MaterialCommunityIcons name="file-document-outline" size={wp('6%')} color="#455e14" style={styles.infoIcon} />
            <Text style={styles.infoText}>Terms and Conditions</Text>
          </Pressable>
          <Pressable style={styles.infoItem} onPress={() => navigation.navigate('PrivacyPolicy')}>
            <MaterialCommunityIcons name="shield-lock-outline" size={wp('6%')} color="#455e14" style={styles.infoIcon} />
            <Text style={styles.infoText}>Privacy and Policy</Text>
          </Pressable>
          <Pressable style={styles.infoItem} onPress={() => navigation.navigate('HelpCenter')}>
            <MaterialCommunityIcons name="help-circle-outline" size={wp('6%')} color="#455e14" style={styles.infoIcon} />
            <Text style={styles.infoText}>Help Center</Text>
          </Pressable>
          <Pressable style={styles.infoItem} onPress={() => navigation.navigate('About')}>
            <MaterialCommunityIcons name="information-outline" size={wp('6%')} color="#455e14" style={styles.infoIcon} />
            <Text style={styles.infoText}>About</Text>
          </Pressable>
        </View>
        <View style={styles.scanContainer}>
          <View style={styles.scanText}>
            <View style={styles.scanButton}>
              <Pressable style={styles.contactItem} onPress={() => Linking.openURL('https://bp-website-one.vercel.app/#')}>
                <MaterialCommunityIcons name="web" size={wp('9%')} color="#455e14" style={styles.scanButtonIcon} />
              </Pressable>
            </View>
            <Text style={styles.scanButtonText}>View Our Website</Text>
          </View>
          <View style={styles.scanText}>
            <View style={styles.scanButton}>
              <Pressable style={styles.contactItem} onPress={() => navigation.navigate('Contact')}>
                <MaterialCommunityIcons name="email-outline" size={wp('9%')} color="#455e14" style={styles.scanButtonIcon} />
              </Pressable>
            </View>
            <Text style={styles.scanButtonText}>Contact Us</Text>
          </View>
        </View>
        <Pressable style={[styles.button, styles.logoutButton]} onPress={() => this.AlertPro.open()}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>
        <AlertPro
          ref={ref => {
            this.AlertPro = ref;
          }}
          onConfirm={() => {
            this.AlertPro.close();
            navigation.navigate('Login');;
          }}
          onCancel={() => this.AlertPro.close()}
          title="Confirmation"
          message="Are you sure you want to logout?"
          textCancel="Cancel"
          textConfirm="Yes"
          customStyles={{
            mask: {
              backgroundColor: "transparent"
            },
            container: {
              borderWidth: 1,
              borderColor: "#455e14",
              borderRadius: 20
            },
            buttonCancel: {
              backgroundColor: "red"
            },
            buttonConfirm: {
              backgroundColor: "#83951c"
            }
          }}
        />
      </ScrollView>
    </View >
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  contentContainer: {
    paddingBottom: hp('10%'),
  },
  headerContainer: {
    width: '100%',
    paddingVertical: hp('1%'),
    backgroundColor: 'white',
    paddingBottom: hp('2%'),
    paddingTop: hp('5%'),
  },
  headerItem: {
    flexDirection: 'column',
    marginLeft: wp('2%'),
    top: hp('1%'),
    maxWidth: wp('50%'), // Set a maximum width
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#7a9b57',
    right: wp('6%'),
  },
  editIconContainer: {
    position: 'absolute',
    top: hp('7%'),
    right: wp('4%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    padding: wp('2.2%'),
  },
  verticalLine: {
    width: 1,
    height: '100%',
    backgroundColor: '#7a9b57',
    marginHorizontal: wp('3%'),
    position: 'fixed',
  },
  userName: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
  },
  userStudentNumber: {
    fontSize: wp('3.5%'),
    fontFamily: 'Poppins-SemiBold',
    color: '#455e14',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    top: hp('.5%'),
  },
  pointsValue: {
    fontSize: wp('4%'),
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
    marginTop: hp('0.5%'),
    marginLeft: wp('.5%'),
  },
  infoContainer: {
    marginTop: hp('2%'),
    padding: wp('3%'),
    backgroundColor: 'white',
    borderRadius: wp('5%'),
    marginHorizontal: wp('5%'), // Add space outside the container
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('1.5%'),
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  infoIcon: {
    marginRight: wp('3%'),
  },
  infoText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
  }, gnItems: 'center',
  scanContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: hp('2%'),
    padding: wp('3%'),
    width: wp('80%'),
    alignSelf: 'center',
    borderRadius: wp('5%'),
  },
  scanButton: {
    borderRadius: wp('3%'),
    alignItems: 'center',
    width: wp('20%'),
    height: hp('5%'),
    flexDirection: 'column',
    justifyContent: 'center',
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
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',  // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    width: width,
    height: height,
  },
  modalContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeAvatar: {
    width: wp('80%'),  // Enlarged avatar size
    height: wp('80%'),
    borderRadius: wp('40%'),
    borderColor: '#455e14',
  },
  closeButton: {
    marginTop: hp('2%'),
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

});