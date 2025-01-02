import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { headerStyles } from './shared/HeaderStyle';
import { contentStyles } from './shared/ContentStyle';
import { useBackHandler } from '../hooks/useBackHandler';

const ContactUsScreen = ({ navigation }) => {
  useBackHandler(navigation);

  return (
    <View style={contentStyles.container}>
      <View style={headerStyles.headerContainer}>
        <Pressable style={headerStyles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={wp('7%')} color="#83951c" />
        </Pressable>
        <Text style={headerStyles.header}>Contact Us</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.introCard}>
          <Text style={styles.introText}>
            If you have any questions or need assistance, please feel free to contact us.
          </Text>
        </View>

        <View style={styles.contactsContainer}>
          {[
            {
              icon: 'email-outline',
              text: 'bottlepoints@gmail.com',
              action: () => Linking.openURL('mailto:bottlepoints@gmail.com')
            },
            {
              icon: 'phone-outline',
              text: '+63 948 687 1365',
              action: () => Linking.openURL('tel:09486871365')
            },
            {
              icon: 'map-marker-outline',
              text: 'Colegio de Montalban, Philippines',
              action: () => Linking.openURL('https://goo.gl/maps/...')
            }
          ].map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.contactCard}
              onPress={item.action}
            >
              <MaterialCommunityIcons 
                name={item.icon} 
                size={wp('8%')} 
                color="#83951c" 
              />
              <Text style={styles.contactText}>{item.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: wp('5%'),
  },
  introCard: {
    backgroundColor: '#f5f8f2',
    padding: wp('5%'),
    borderRadius: wp('4%'),
    marginBottom: hp('3%'),
  },
  introText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    textAlign: 'center',
    lineHeight: hp('2.8%'),
  },
  contactsContainer: {
    gap: hp('2%'),
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contactText: {
    flex: 1,
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    marginLeft: wp('4%'),
  }
});

export default ContactUsScreen;