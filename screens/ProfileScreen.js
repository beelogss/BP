import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Image, BackHandler } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Octicons, Entypo, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { Avatar } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AlertPro from "react-native-alert-pro";
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');
export default function ProfileScreen ({navigation}) {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);  // Modal visibility state

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
    <View style={[styles.container, {  }]}>
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
              source={require('../assets/images/small-logoss.png')}  // Replace with actual avatar image
              style={styles.largeAvatar}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Avatar.Image size={wp('16%')} label="G" source={require('../assets/images/small-logoss.png')} style={styles.avatar} />
        </TouchableOpacity>

            <Text style={styles.userName}>Gerard Lopez</Text>
          </View>
          <View style={styles.pointsContainer}>
              <FontAwesome5 name="star" size={wp('6%')} color="#83951c" style={styles.pointsIcon} />
              <Text style={styles.pointsValue}>1200</Text>
            </View>
          <View style={styles.headerRight}>
            <Octicons name="history" size={wp('6%')} color="black" style={styles.headerIcon} />
            <Ionicons name="menu" size={wp('6%')} color="black" style={styles.headerIcon} />
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.contentContainer}>

        {/* Statistics */}
        <View style={styles.statsBoxContainer}>
          <View style={styles.tabContainer}>
            <Text style={styles.tabTextActive}>Your Impactful Contribution Reduced</Text>
          </View>
          <View style={styles.savedAmountContainer}>
            <Text style={styles.savedAmount}>0.00</Text>
            <Text style={styles.savedUnit}>kg of <Text style={{fontFamily: 'Poppins-SemiBold', color: '#83951c', fontSize: wp('4%')}}>CO₂</Text></Text> 
          </View>
        </View>

        {/* Activity Overview */}
        <View style={styles.activityContainer}>
          <Text style={styles.activityHeader}>Your environmental awareness made an impact and have saved CO₂ equivalent of the following:</Text>
          <View style={styles.activityGrid}>
            {activityData.map((item, index) => (
              <View key={index} style={styles.activityItem}>
                {item.iconType === 'Entypo' && <Entypo name={item.icon} size={wp('10%')} color="#7a9b57" />}
                {item.iconType === 'MaterialIcons' && <MaterialIcons name={item.icon} size={wp('10%')} color="#7a9b57" />}
                {item.iconType === 'FontAwesome5' && <FontAwesome5 name={item.icon} size={wp('10%')} color="#7a9b57" />}
                <Text style={styles.activityValue}>{item.value}</Text>
                <Text style={styles.activityLabel}>{item.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* My Inventory */}
        <View style={styles.inventoryContainer}>
          <Text style={styles.inventoryHeader}>Lorem ipsum</Text>
          <Text style={styles.inventorySubheader}>Lorem ipsum</Text>
          <View style={styles.inventoryItem}>
            <MaterialCommunityIcons name="leaf" size={wp('10%')} color="#83951c" />
            <Text style={styles.inventoryText}>Lorem ipsum</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => this.AlertPro.open()}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
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
              backgroundColor: "#f66"
            },
            buttonConfirm: {
            backgroundColor: "#83951c"
            }
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    paddingBottom: hp('10%'),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('3%'),
    backgroundColor: '#f1f8e9',
    borderBottomLeftRadius: wp('8%'),
    borderBottomRightRadius: wp('8%'),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#7a9b57',
    margin: wp('4%'),
  },
  userName: {
    fontSize: wp('5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    bottom: hp('1.3%'),
    marginLeft: wp('2%'),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: wp('2%'),
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsIcon: {
    marginRight: wp('1.5%'),
  },
  pointsValue: {
    fontSize: wp('4%'),
    fontWeight: 'bold',
    color: '#455e14',
  },

   // Modal styles
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
    marginVertical: hp('1.5%'),
  },
  tabTextActive: {
    color: '#455e14',
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp('4%'),
  },
  statsBoxContainer: {
    alignItems: 'center',
    marginVertical: hp('3%'),
    marginHorizontal: wp('6%'),
    padding: wp('2%'),
    borderRadius: wp('2%'),
    backgroundColor: 'white',
    borderBottomRightRadius: wp('8%'),
    borderTopLeftRadius: wp('8%'),
    borderWidth: 1,
    borderColor: '#83951c',
    shadowColor: '#000',
  },
  savedAmountContainer: {
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  savedAmount: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('10%'),
    color: '#83951c',
  },
  savedUnit: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  activityContainer: {
    paddingHorizontal: wp('4%'),
  },
  activityHeader: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    color: '#455e14',
    textAlign: 'center',
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  activityItem: {
    alignItems: 'center',
    width: '30%',
    marginVertical: hp('1.5%'),
    backgroundColor: '#f9f9f9',
    borderRadius: wp('3%'),
    padding: wp('2%'),
    borderColor: '#f3f3f3',
    borderWidth: 1,
  },
  activityValue: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp('4%'),
    color: '#455e14',
    marginTop: hp('1%'),
  },
  activityLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('2.9%'),
    color: '#455e14',
    textAlign: 'center',
  },
  inventoryContainer: {
    backgroundColor: '#e5eeda',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2.5%'),
    borderRadius: wp('2.5%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
  },
  inventoryHeader: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    color: '#455e14',
  },
  inventorySubheader: {
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    color: '#83951c',
    marginTop: hp('1%'),
  },
  inventoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  inventoryText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp('3.5%'),
    color: '#455e14',
    marginLeft: wp('2.5%'),
  },
  button: {
    backgroundColor: '#83951c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },

});


