import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, TextInput, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const HelpCenterScreen = ({ navigation }) => {
    const faqs = [
        {
            question: 'How do I view my QR code?',
            answer: 'To view your QR code, press the "My QR" button on the Home screen. This will open a modal displaying your QR code.',
          },
          {
            question: 'How do I view the list of bottles?',
            answer: 'To view the list of bottles, press the "Bottles List" button on the Home screen. This will navigate you to the Bottles screen.',
          },
          {
            question: 'How do I refresh my data?',
            answer: 'To refresh your data, pull down on the Home screen to trigger the refresh control. This will fetch the latest user and leaderboard data.',
          },
          {
            question: 'How do I view notifications?',
            answer: 'To view notifications, press the notification icon (bell) on the top right corner of the Home screen. This will navigate you to the Notifications screen.',
          },
          {
            question: 'How do I view the leaderboard?',
            answer: 'To view the leaderboard, scroll down to the Leaderboard section on the Home screen. You can also press "See All" to view the full leaderboard.',
          },
          {
            question: 'How do I earn points?',
            answer: 'You can earn points by collecting recyclable bottles and scanning them. Each bottle has a redeemable point value.',
          },
          {
            question: 'How do I redeem rewards?',
            answer: 'You can redeem rewards based on the reward\'s specific points requirement. Check the Rewards section in the app for available rewards.',
          },
          {
            question: 'How do I view available rewards?',
            answer: 'To view available rewards, navigate to the Rewards screen. You will see a list of rewards that you can claim based on your points.',
          },
          {
            question: 'How do I claim a reward?',
            answer: 'To claim a reward, select the reward you want from the Rewards screen and press the "Claim" button. Confirm your claim in the confirmation modal that appears.',
          },
          {
            question: 'What happens after I claim a reward?',
            answer: 'After you claim a reward, a barcode will be generated for the reward. You can use this barcode to redeem your reward.',
          },
          {
            question: 'What should I do if I encounter an error while claiming a reward?',
            answer: 'If you encounter an error while claiming a reward, please contact our support team at bottlepoints@gmail.com for assistance.',
          },
          {
            question: 'How do I know if a reward is out of stock?',
            answer: 'The available stock for each reward is displayed on the Rewards screen. If a reward is out of stock, you will not be able to claim it.',
          },
          {
            question: 'How are my points updated after claiming a reward?',
            answer: 'Your points are automatically updated after you successfully claim a reward. The new points balance will be reflected in your account.',
          },
          {
            question: 'How do I refresh the rewards list?',
            answer: 'To refresh the rewards list, pull down on the Rewards screen to trigger the refresh control. This will fetch the latest available rewards.',
          },
          {
            question: 'What is the purpose of the barcode generated after claiming a reward?',
            answer: 'The barcode generated after claiming a reward is used to redeem the reward. You can present this barcode at the designated redemption point.',
          },
          {
            question: 'How do I contact support if I have issues with rewards?',
            answer: 'If you have any issues with rewards, please contact our support team at bottlepoints@gmail.com for assistance.',
          },
          {
            question: 'How do I view my claimed rewards?',
            answer: 'To view your claimed rewards, press the "View Rewards" button on the Rewards screen. This will navigate you to the Claimed Rewards screen.',
          },
          {
            question: 'How do I filter my claimed rewards?',
            answer: 'On the Claimed Rewards screen, you can filter your rewards by "To Be Claimed" or "Claimed" using the filter buttons at the top of the screen.',
          },
          {
            question: 'How do I sort my claimed rewards?',
            answer: 'On the Claimed Rewards screen, you can sort your rewards by "Date" or "Name" using the sort buttons below the filter buttons.',
          },
          {
            question: 'How do I mark a reward as claimed?',
            answer: 'To mark a reward as claimed, select the reward from the Claimed Rewards screen and press the "Mark as Claimed" button in the reward details modal.',
          },
          {
            question: 'How do I delete a claimed reward?',
            answer: 'To delete a claimed reward, press the delete icon next to the reward on the Claimed Rewards screen. Confirm the deletion in the alert that appears.',
          },
          {
            question: 'What should I do if I encounter an error while updating a reward status?',
            answer: 'If you encounter an error while updating a reward status, please contact our support team at bottlepoints@gmail.com for assistance.',
          },
          {
            question: 'How do I refresh the claimed rewards list?',
            answer: 'To refresh the claimed rewards list, pull down on the Claimed Rewards screen to trigger the refresh control. This will fetch the latest claimed rewards.',
          },
          {
            question: 'How do I view the details of a claimed reward?',
            answer: 'To view the details of a claimed reward, select the reward from the Claimed Rewards screen. A modal will appear displaying the reward details, including the barcode for redemption.',
          },
          {
            question: 'How do I contact support if I have issues with claimed rewards?',
            answer: 'If you have any issues with claimed rewards, please contact our support team at bottlepoints@gmail.com for assistance.',
          },
          {
            question: 'How do I contact support?',
            answer: 'If you need further assistance, please contact our support team at bottlepoints@gmail.com.',
          },
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState(faqs);

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

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query) {
            const filtered = faqs.filter(faq =>
                faq.question.toLowerCase().includes(query.toLowerCase()) ||
                faq.answer.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredQuestions(filtered);
        } else {
            setFilteredQuestions(faqs);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Pressable>
                    <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon}
                        onPress={() => navigation.goBack()}
                    />
                </Pressable>
                <Text style={styles.header}>Help Center</Text>
            </View>
            <TextInput
                style={styles.searchBar}
                placeholder="Search FAQs..."
                value={searchQuery}
                onChangeText={handleSearch}
            />
            <ScrollView showsVerticalScrollIndicator={false} >
                <Text style={styles.text}>
                    Welcome to the Help Center. Here you can find answers to frequently asked questions and get support for any issues you may encounter.
                </Text>



                <Text style={styles.subHeader}>Frequently Asked Questions</Text>

                {filteredQuestions.map((faq, index) => (
                    <View key={index}>
                        <Text style={styles.boldText}>Q: {faq.question}</Text>
                        <Text style={styles.text}>A: {faq.answer}</Text>
                    </View>
                ))}

                <Text style={styles.subHeader}>Contact Support</Text>
                <Text style={styles.text}>
                    If you need further assistance, please contact our support team at bottlepoints@gmail.com.
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
        paddingBottom: hp('5%'),
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
        left: wp('15%'),
    },
    backIcon: {
        marginBottom: wp('3.5%'),
        paddingTop: hp('5%'),
    },
    subHeader: {
        fontSize: hp('2.5%'),
        fontFamily: 'Poppins-SemiBold',
        color: '#455e14',
    },

    text: {
        fontSize: hp('1.7%'),
        fontFamily: 'Poppins-Regular',
        color: '#455e14',
        marginBottom: hp('1%'),
    },
    boldText: {
        fontFamily: 'Poppins-Bold',
        fontSize: hp('2%'),
        color: '#455e14',
        marginBottom: hp('1%'),
    },
    searchBar: {
        height: hp('5%'),
        borderColor: '#7a9b57',
        borderWidth: 1,
        borderRadius: wp('2%'),
        paddingHorizontal: wp('3%'),
        fontFamily: 'Poppins-Regular',
        marginBottom: hp('1%'),
    },
});

export default HelpCenterScreen;