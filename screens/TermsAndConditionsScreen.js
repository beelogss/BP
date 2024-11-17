import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const TermsAndConditionsScreen = ({ navigation }) => {
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
                <Text style={styles.header}>Terms and Conditions</Text>
            </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.text}>
        Welcome to our application. If you continue to browse and use this application, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern BottlePoints' relationship with you in relation to this application. If you disagree with any part of these terms and conditions, please do not use our application.
      </Text>
      <Text style={styles.text}>
        The term 'BottlePoints' or 'us' or 'we' refers to the owner of the application. The term 'you' refers to the user or viewer of our application.
      </Text>

      <Text style={styles.subHeader}>1. Acceptance of Terms</Text>
      <Text style={styles.text}>
        By accessing and using the BottlePoints System, you acknowledge that you have read, understood, and agree to abide by these terms and conditions. Please review them thoroughly. If you do not agree with any part of these terms, you are advised to refrain from using the system.
      </Text>

      <Text style={styles.subHeader}>2. Eligibility</Text>
      <Text style={styles.text}>
        Only registered students of Colegio de Montalban are eligible to participate in the BottlePoints System. Accounts are personal and should not be shared or transferred.
      </Text>

      <Text style={styles.subHeader}>3. Collecting and Earning Points</Text>
      <Text style={styles.text}>
        You can earn points by collecting recyclable bottles. Bottles must still have their barcode intact before being placed in the bin. Points are awarded only for bottles that meet the system's specified types and attributes.
      </Text>

      <Text style={styles.subHeader}>4. Redeeming Points</Text>
      <Text style={styles.text}>
        You may redeem your points for rewards, such as school supplies, that are presented in the BottlePoints System. Rewards and their availability are subject to change based on stock and partnerships with supporting organizations.
      </Text>

      <Text style={styles.subHeader}>5. Account Security</Text>
      <Text style={styles.text}>
        It is your responsibility to keep your account details secure. If you suspect any unauthorized use, contact the system administrators immediately.
      </Text>

      <Text style={styles.subHeader}>6. Changes to Terms</Text>
      <Text style={styles.text}>
        The BottlePoints System reserves the right to update or change these terms at any time. We will notify you of any major updates through the application or via email.
      </Text>

      <Text style={styles.subHeader}>7. Responsibility for Points and Rewards</Text>
      <Text style={styles.text}>
        The BottlePoints System and its administrators strive to maintain accurate tracking of points and rewards. In the event of system errors, downtime, or other issues directly impacting points or rewards, the administrators will work to address and resolve the situation promptly. While every effort is made to ensure reliability, users are encouraged to report discrepancies to facilitate corrections.
      </Text>

      <Text style={styles.subHeader}>8. Contact Information</Text>
      <Text style={styles.text}>
        If you have questions about these terms, contact us through the app contact information section.
      </Text>

    </ScrollView>
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
        left: wp('5%'),
  },
  backIcon: {
    marginBottom: wp('3.5%'),
    paddingTop: hp('5%'),
},
  subHeader: {
    fontFamily: 'Poppins-Bold',
        fontSize: hp('2%'),
        color: '#455e14',
        marginBottom: hp('1%'),
  },
  text: {
    fontSize: hp('1.7%'),
        fontFamily: 'Poppins-Regular',
        color: '#455e14',
        marginBottom: hp('1%'),
  },
});

export default TermsAndConditionsScreen;