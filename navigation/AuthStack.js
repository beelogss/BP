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
import ScannerScreen from '../screens/ScannerScreen'; // Import ScannerScreen
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
        <Stack.Screen name="Leaderboard" component={LeaderboardScreen}/>
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="RewardDetails" component={RewardDetailsScreen} />
        <Stack.Screen name="AllRewards" component={AllRewardsScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}}/> 
        <Stack.Screen name="ClaimedRewards" component={ClaimedRewardsScreen} options={{cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,}}/> 
        <Stack.Screen name="Scanner" component={ScannerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </SnackbarProvider>
    </SafeAreaProvider>
  );
}