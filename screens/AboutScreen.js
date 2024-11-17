import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const AboutScreen = ({ navigation }) => {
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
                <Text style={styles.header}>About Us</Text>
            </View>
    <ScrollView showsVerticalScrollIndicator={false}>
      <Text style={styles.text}>
        Welcome to BottlePoints. We are dedicated to providing you with the best service possible. Our mission is to promote environmental sustainability through recycling.
      </Text>
      <Text style={styles.subHeader}>Our Story</Text>
      <Text style={styles.text}>
        BottlePoints was founded in 2024 with the goal of encouraging recycling among students. Since then, we have grown to become a leader in promoting environmental awareness and sustainability.
      </Text>
      <Text style={styles.subHeader}>Our Team</Text>
      <Text style={styles.text}>
        Our team is made up of dedicated professionals who are passionate about what they do. We are committed to providing you with the best experience possible.
      </Text>
      <Text style={styles.subHeader}>Future Goals</Text>
      <Text style={styles.text}>
        Our vision for the future is to expand our reach and impact, encouraging more people to participate in recycling and sustainability efforts..
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
    left: wp('12%'),
},
backIcon: {
    marginBottom: wp('3.5%'),
    paddingTop: hp('5%'),
},
subHeader: {
    fontFamily: 'Poppins-Bold',
        fontSize: hp('2%'),
        color: '#455e14',
        textAlign: 'center',
  },
  text: {
    fontSize: hp('1.7%'),
        fontFamily: 'Poppins-Regular',
        color: '#455e14',
        marginBottom: hp('1%'),
        textAlign: 'center',
  },
});

export default AboutScreen;