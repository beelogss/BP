import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const PrivacyPolicyScreen = ({ navigation }) => {
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
                <Text style={styles.header}>Privacy Policy</Text>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.text}>
                    This privacy policy sets out how BottlePoints uses and protects any information that you give BottlePoints when you use this application.
                </Text>
                <Text style={styles.text}>
                    BottlePoints is committed to ensuring that your privacy is protected. Should we ask you to provide certain information by which you can be identified when using this application, then you can be assured that it will only be used in accordance with this privacy statement.
                </Text>

                <Text style={styles.subHeader}>Information We Collect</Text>
                <Text style={styles.text}>
                    {'\n'}- Personal Information: Your name, student ID, email, and other relevant information for account setup.
                    {'\n'}- Usage Data: Points earned, bottles collected, and rewards redeemed to track your activity within the system.
                </Text>

                <Text style={styles.subHeader}>How We Use Your Information</Text>
                <Text style={styles.text}>
                    {'\n'}- Track and manage your points and reward history.
                    {'\n'}- Provide you with information about available rewards and system updates.
                    {'\n'}- Improve the BottlePoints System's functionality based on user activity.
                </Text>

                <Text style={styles.subHeader}>Data Security</Text>
                <Text style={styles.text}>
                    We take your privacy seriously and implement measures to protect your data from unauthorized access or misuse. However, we cannot guarantee total security and encourage you to use strong passwords and avoid sharing your account details.
                </Text>

                <Text style={styles.subHeader}>Sharing Your Information</Text>
                <Text style={styles.text}>
                    Your information is private and will not be shared with third parties unless required by law or in the case of partnerships that provide rewards. Any third-party access will be limited to necessary information and will comply with this privacy policy.
                </Text>

                <Text style={styles.subHeader}>Your Rights</Text>
                <Text style={styles.text}>
                    You have the right to access, update, or delete your personal information. If you would like to do so, contact us through the contact information section.
                </Text>

                <Text style={styles.subHeader}>Changes to this Privacy Policy</Text>
                <Text style={styles.text}>
                    We may update this Privacy Policy periodically. Major changes will be communicated through the application, and you are encouraged to review it regularly.
                </Text>

                <Text style={styles.subHeader}>Contact Information</Text>
                <Text style={styles.text}>
                    For questions about this policy or your data, reach out via the contact information section or through our official email.
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
    },
    text: {
        fontSize: hp('1.7%'),
        fontFamily: 'Poppins-Regular',
        color: '#455e14',
        marginBottom: hp('1%'),
    },
});

export default PrivacyPolicyScreen;