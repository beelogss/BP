import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { SnackbarProvider } from '../components/SnackbarContext'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from '../screens/LoginScreen';
import EmailInputScreen from '../screens/EmailInputScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ForgotPassScreen from '../screens/ForgotPassScreen';
import ResetPassScreen from '../screens/ResetPassScreen';
import SignupDetailsScreen from '../screens/SignupDetailsScreen';
import HomeTabs from './_layout';
import LeaderboardScreen from '../screens/LeaderboardScreen'
import RewardDetailsScreen from '../screens/RewardDetailsScreen'
import RewardsScreen from '../screens/RewardsScreen'
import AllRewardsScreen from '../screens/AllRewardsScreen'
import ClaimedRewardsScreen from '../screens/ClaimedRewardsScreen'
import BottleList from '../screens/BottleList';
import EditProfileScreen from '../screens/EditProfileScreen';
import NotifScreen from '../screens/NotifScreen';
import TermsAndConditionsScreen from '@/screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from '@/screens/PrivacyPolicyScreen';
import HelpCenterScreen from '@/screens/HelpCenterScreen';
import AboutScreen from '@/screens/AboutScreen';
import ContactUsScreen from '@/screens/ContactUsScreen';
import ReportProblemScreen from '@/screens/ReportProblemScreen';
import MyReportsScreen from '../screens/MyReportsScreen';
import ReportDetailsScreen from '../screens/ReportDetailsScreen';
const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <SafeAreaProvider>
    <SnackbarProvider>
    <NavigationContainer >
      <Stack.Navigator screenOptions={{
        headerShown: false,
      }} initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="EmailInput" component={EmailInputScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen}/>
        <Stack.Screen name="ForgotPass" component={ForgotPassScreen}/>
        <Stack.Screen name="ResetPass" component={ResetPassScreen}/>
        <Stack.Screen name="Signup" component={SignupDetailsScreen} />
        <Stack.Screen name="Hometabs" component={HomeTabs}/>
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}}/>
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="RewardDetails" component={RewardDetailsScreen} />
        <Stack.Screen name="AllRewards" component={AllRewardsScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}}/> 
        <Stack.Screen name="ClaimedRewards" component={ClaimedRewardsScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}}/>
        <Stack.Screen name="Bottles" component={BottleList} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="Notif" component={NotifScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="TermsAndConditions" component={TermsAndConditionsScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="HelpCenter" component={HelpCenterScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="About" component={AboutScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="Contact" component={ContactUsScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen name="ReportProblem" component={ReportProblemScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,}}/>
        <Stack.Screen 
          name="MyReports" 
          component={MyReportsScreen} 
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
        <Stack.Screen 
          name="ReportDetails" 
          component={ReportDetailsScreen} 
          options={{
            cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </SnackbarProvider>
    </SafeAreaProvider>
  );
}