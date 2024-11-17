import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

const ContactUsScreen = ({ navigation }) => {
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
        <View style={styles.headerContainer}>
                <Pressable>
                    <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon}
                        onPress={() => navigation.goBack()}
                    />
                </Pressable>
                <Text style={styles.header}>Contact Us</Text>
            </View>
      <Text style={styles.text}>
        If you have any questions or need assistance, please feel free to contact us.
      </Text>
      <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('mailto:support@example.com')}>
        <MaterialCommunityIcons name="email-outline" size={wp('6%')} color="#455e14" style={styles.icon} />
        <Text style={styles.contactText}>bottlepoints@gmail.com</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('tel:09486871365')}>
        <MaterialCommunityIcons name="phone-outline" size={wp('6%')} color="#455e14" style={styles.icon} />
        <Text style={styles.contactText}>+63 948 687 1365</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('https://www.google.com/maps/place/Colegio+de+Montalban/@14.7505067,121.1367763,17z/data=!3m1!4b1!4m6!3m5!1s0x3397bbe8733338e5:0xc845d7b6001522e1!8m2!3d14.7505016!4d121.1416472!16s%2Fm%2F080f_k2?entry=ttu&g_ep=EgoyMDI0MTExMy4xIKXMDSoASAFQAw%3D%3D')}>
        <MaterialCommunityIcons name="map-marker-outline" size={wp('6%')} color="#455e14" style={styles.icon} />
        <Text style={styles.contactText}>Colegio de Montalban, Philippines, Montalban, Rizal</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('5%'),
    backgroundColor: 'white',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
},
header: {
    fontSize: hp('3%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    top: hp('2%'),
    left: wp('12%'),
},
backIcon: {
    marginBottom: wp('3.5%'),
    paddingTop: hp('5%'),
},
text: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    marginBottom: hp('1%'),
},
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp('2%'),
  },
  icon: {
    marginRight: wp('3%'),
  },
  contactText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
});

export default ContactUsScreen;