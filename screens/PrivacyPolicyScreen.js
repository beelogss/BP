import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { headerStyles } from './shared/HeaderStyle';
import { contentStyles } from './shared/ContentStyle';
import { useBackHandler } from '../hooks/useBackHandler';

const PrivacyPolicyScreen = ({ navigation }) => {
    useBackHandler(navigation);

    // Define sections data
    const sections = [
        {
            title: "Information We Collect",
            content: "We collect information that you provide directly to us, including your name, student number, and other relevant details necessary for the operation of the BottlePoints system."
        },
        {
            title: "How We Use Your Information",
            content: "Your information is used to maintain your account, track your recycling activities, award points, and improve our services."
        },
        {
            title: "Data Security",
            content: "We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure."
        },
        {
            title: "Information Sharing",
            content: "We do not share your personal information with third parties except as required for the operation of the BottlePoints system or as required by law."
        },
        {
            title: "User Rights",
            content: "You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights."
        },
        {
            title: "Updates to Privacy Policy",
            content: "We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page."
        }
    ];

    return (
        <View style={contentStyles.container}>
            <View style={headerStyles.headerContainer}>
                <Pressable style={headerStyles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={wp('7%')} color="#83951c" />
                </Pressable>
                <Text style={headerStyles.header}>Privacy Policy</Text>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={contentStyles.scrollContent}
            >
                <View style={styles.card}>
                    <Text style={contentStyles.text}>
                        This privacy policy sets out how BottlePoints uses and protects any information that you give BottlePoints when you use this application.
                    </Text>
                </View>
                
                {sections.map((section, index) => (
                    <View key={index} style={[styles.card, styles.sectionCard]}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={contentStyles.text}>{section.content}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
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
    sectionCard: {
        borderLeftWidth: 4,
        borderLeftColor: '#83951c',
    },
    sectionTitle: {
        fontSize: hp('2%'),
        fontFamily: 'Poppins-Bold',
        color: '#455e14',
        marginBottom: hp('1%'),
    }
});

export default PrivacyPolicyScreen;