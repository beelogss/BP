import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { headerStyles } from './shared/HeaderStyle';
import { contentStyles } from './shared/ContentStyle';
import { useBackHandler } from '../hooks/useBackHandler';

const TermsAndConditionsScreen = ({ navigation }) => {
  useBackHandler(navigation);

  return (
    <View style={contentStyles.container}>
      <View style={headerStyles.headerContainer}>
        <Pressable style={headerStyles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={wp('7%')} color="#83951c" />
        </Pressable>
        <Text style={headerStyles.header}>Terms and Conditions</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentStyles.scrollContent}
      >
        <View style={contentStyles.section}>
          <Text style={contentStyles.text}>
            Welcome to our application. If you continue to browse and use this application, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern BottlePoints' relationship with you in relation to this application. If you disagree with any part of these terms and conditions, please do not use our application.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>1. Acceptance of Terms</Text>
          <Text style={contentStyles.text}>
            By accessing and using the BottlePoints System, you acknowledge that you have read, understood, and agree to abide by these terms and conditions. Please review them thoroughly. If you do not agree with any part of these terms, you are advised to refrain from using the system.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>2. Eligibility</Text>
          <Text style={contentStyles.text}>
            Only registered students of Colegio de Montalban are eligible to participate in the BottlePoints System. Accounts are personal and should not be shared or transferred.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>3. Collecting and Earning Points</Text>
          <Text style={contentStyles.text}>
            You can earn points by collecting recyclable bottles. Bottles must still have their barcode intact before being placed in the bin. Points are awarded only for bottles that meet the system's specified types and attributes.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>4. Redeeming Points</Text>
          <Text style={contentStyles.text}>
            You may redeem your points for rewards, such as school supplies, that are presented in the BottlePoints System. Rewards and their availability are subject to change based on stock and partnerships with supporting organizations.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>5. Account Security</Text>
          <Text style={contentStyles.text}>
            It is your responsibility to keep your account details secure. If you suspect any unauthorized use, contact the system administrators immediately.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>6. Changes to Terms</Text>
          <Text style={contentStyles.text}>
            The BottlePoints System reserves the right to update or change these terms at any time. We will notify you of any major updates through the application or via email.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>7. Responsibility for Points and Rewards</Text>
          <Text style={contentStyles.text}>
            The BottlePoints System and its administrators strive to maintain accurate tracking of points and rewards. In the event of system errors, downtime, or other issues directly impacting points or rewards, the administrators will work to address and resolve the situation promptly. While every effort is made to ensure reliability, users are encouraged to report discrepancies to facilitate corrections.
          </Text>
        </View>

        <View style={contentStyles.section}>
          <Text style={[contentStyles.title, styles.sectionTitle]}>8. Contact Information</Text>
          <Text style={contentStyles.text}>
            If you have questions about these terms, contact us through the app contact information section.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    backgroundColor: '#f5f8f2',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginTop: hp('2%'),
  }
});

export default TermsAndConditionsScreen;