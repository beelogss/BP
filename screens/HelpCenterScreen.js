import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, BackHandler, TextInput, Pressable } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { contentStyles } from './shared/ContentStyle';
import { headerStyles } from './shared/HeaderStyle';
import { useBackHandler } from '../hooks/useBackHandler';

const HelpCenterScreen = ({ navigation }) => {
    useBackHandler(navigation);

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
          {
            question: 'How do I edit my profile?',
            answer: 'To edit your profile, go to the Profile screen and tap the pencil icon next to your profile picture. You can update your name, avatar, and other information.',
          },
          {
            question: 'How do I view my profile statistics?',
            answer: 'Your profile statistics are displayed on the Profile screen, showing your total points and bottles collected.',
          },
          {
            question: 'How do I change my profile picture?',
            answer: 'Tap your profile picture on the Profile screen to open the avatar selection modal. You can choose a new avatar from the available options.',
          },
          {
            question: 'How does the leaderboard work?',
            answer: 'The leaderboard ranks users based on their total bottle contributions earned from depositing bottles. The more bottles you recycle, the higher your ranking.',
          },
          {
            question: 'How often is the leaderboard updated?',
            answer: 'The leaderboard is updated in real-time as users collect and recycle bottles.',
          },
          {
            question: 'What do the different colors on the leaderboard mean?',
            answer: 'Gold indicates 1st place, silver for 2nd place, and bronze for 3rd place. Other positions are shown in standard colors.',
          },
          {
            question: 'What do the different impact metrics mean?',
            answer: 'Energy Consumption shows energy saved, Trees Planted represents environmental benefit, and Transportation shows reduced carbon emissions.',
          },
          {
            question: 'Where can I find the Terms and Conditions?',
            answer: 'Go to Profile > Settings > Terms and Conditions to view the full terms of service.',
          },
          {
            question: 'How can I view the Privacy Policy?',
            answer: 'Access the Privacy Policy through Profile > Settings > Privacy Policy.',
          },
          {
            question: 'How do I contact support?',
            answer: 'You can reach support through Profile > Settings > Contact Us, or email directly at bottlepoints@gmail.com.',
          },
          {
            question: 'How do I log out of my account?',
            answer: 'Go to your Profile screen and scroll to the bottom. Tap the Logout button and confirm your action.',
          },
          {
            question: 'What happens to my points if I log out?',
            answer: 'Your points and achievements are safely stored in your account and will be available when you log back in.',
          },
          {
            question: 'What is BottlePoints?',
            answer: 'BottlePoints is an eco-friendly application that encourages recycling by rewarding users with points for recycling bottles.',
          },
          {
            question: 'How can I learn more about BottlePoints?',
            answer: 'Visit Profile > Settings > About Us to learn more about our mission and impact.',
          }
    ];

    const [searchQuery, setSearchQuery] = useState('');
    const [filteredQuestions, setFilteredQuestions] = useState(faqs);

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
        <View style={contentStyles.container}>
            <View style={headerStyles.headerContainer}>
                <Pressable style={headerStyles.backButton} onPress={() => navigation.goBack()}>
                    <AntDesign name="arrowleft" size={wp('7%')} color="#83951c" />
                </Pressable>
                <Text style={headerStyles.header}>Help Center</Text>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchWrapper}>
                    <AntDesign name="search1" size={wp('5%')} color="#83951c" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>
            </View>

            <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={contentStyles.scrollContent}
            >
                <View style={styles.faqContainer}>
                    {filteredQuestions.map((faq, index) => (
                        <View key={index} style={styles.faqCard}>
                            <Text style={styles.question}>
                                <Text style={styles.questionMark}>Q: </Text>
                                {faq.question}
                            </Text>
                            <Text style={styles.answer}>
                                <Text style={styles.answerMark}>A: </Text>
                                {faq.answer}
                            </Text>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        padding: wp('5%'),
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5eeda',
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f8f2',
        borderRadius: wp('3%'),
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1%'),
        borderWidth: 1,
        borderColor: '#e5eeda',
    },
    searchInput: {
        flex: 1,
        marginLeft: wp('2%'),
        fontFamily: 'Poppins-Regular',
        fontSize: hp('1.8%'),
        color: '#455e14',
    },
    faqContainer: {
        paddingHorizontal: wp('4%'),
    },
    faqCard: {
        backgroundColor: '#ffffff',
        padding: wp('4%'),
        borderRadius: wp('3%'),
        marginBottom: hp('2%'),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderLeftWidth: 3,
        borderLeftColor: '#83951c',
    },
    question: {
        fontSize: hp('1.8%'),
        fontFamily: 'Poppins-SemiBold',
        color: '#455e14',
        marginBottom: hp('1%'),
        paddingRight: wp('4%'),
    },
    questionMark: {
        color: '#83951c',
        fontFamily: 'Poppins-Bold',
    },
    answer: {
        fontSize: hp('1.7%'),
        fontFamily: 'Poppins-Regular',
        color: '#455e14',
        lineHeight: hp('2.5%'),
        paddingLeft: wp('4%'),
        borderLeftWidth: 1,
        borderLeftColor: '#e5eeda',
    },
    answerMark: {
        color: '#83951c',
        fontFamily: 'Poppins-Bold',
    }
});

export default HelpCenterScreen;