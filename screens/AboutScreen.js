import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { contentStyles } from './shared/ContentStyle';
import { headerStyles } from './shared/HeaderStyle';
import { useBackHandler } from '../hooks/useBackHandler';

const AboutScreen = ({ navigation }) => {
  // Define sections data
  const sections = [
    {
      title: "Our Mission",
      content: "To promote environmental sustainability through innovative recycling solutions and reward systems that encourage responsible waste management among students."
    },
    {
      title: "What We Do",
      content: "BottlePoints is a mobile application that incentivizes recycling by rewarding students with points for each bottle they recycle. These points can be redeemed for various rewards."
    },
    {
      title: "How It Works",
      content: "Simply collect recyclable bottles, scan them using our app, and earn points. The more bottles you recycle, the more points you earn to exchange for exciting rewards."
    },
    {
      title: "Our Impact",
      content: "Through our collective efforts, we've helped reduce plastic waste in our campus while creating a more environmentally conscious student community."
    },
    {
      title: "Join Us",
      content: "Be part of our growing community of environmentally conscious students. Every bottle recycled counts towards a cleaner, greener future."
    }
  ];

  useBackHandler(navigation);

  return (
    <View style={contentStyles.container}>
      <View style={headerStyles.headerContainer}>
        <Pressable style={headerStyles.backButton} onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={wp('7%')} color="#83951c" />
        </Pressable>
        <Text style={headerStyles.header}>About Us</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={contentStyles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.welcomeText}>
            Welcome to BottlePoints
          </Text>
          <Text style={styles.description}>
            We are dedicated to making recycling rewarding and fun while contributing to a sustainable future. Our innovative platform combines environmental responsibility with exciting rewards.
          </Text>
        </View>

        {sections.map((section, index) => (
          <View key={index} style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionText}>{section.content}</Text>
          </View>
        ))}

        <View style={[styles.sectionCard, styles.versionCard]}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.copyrightText}>© 2024 BottlePoints. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f5f8f2',
    padding: wp('5%'),
    borderRadius: wp('4%'),
    marginBottom: hp('3%'),
  },
  welcomeText: {
    fontSize: hp('2.5%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: hp('2%'),
  },
  description: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    textAlign: 'center',
    lineHeight: hp('2.8%'),
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    padding: wp('4%'),
    borderRadius: wp('3%'),
    marginBottom: hp('2%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: hp('2%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  sectionText: {
    fontSize: hp('1.8%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    lineHeight: hp('2.8%'),
  },
  versionCard: {
    alignItems: 'center',
    backgroundColor: '#f5f8f2',
    marginTop: hp('2%'),
  },
  versionText: {
    fontSize: hp('1.6%'),
    fontFamily: 'Poppins-Medium',
    color: '#83951c',
  },
  copyrightText: {
    fontSize: hp('1.4%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    marginTop: hp('0.5%'),
  }
});

export default AboutScreen;