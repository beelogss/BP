import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import EmailInputScreen from '../screens/EmailInputScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ForgotPassScreen from '../screens/ForgotPassScreen';
import ResetPassScreen from '../screens/ResetPassScreen';
import SignupDetailsScreen from '../screens/SignupDetailsScreen';
import { SnackbarProvider } from '../components/SnackbarContext'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeTabs from './_layout';
import RewardDetailsScreen from '../screens/RewardDetailsScreen'
import RewardsScreen from '../screens/RewardsScreen'
import AllRewardsScreen from '../screens/AllRewardsScreen'
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
        <Stack.Screen name="EmailInput" component={EmailInputScreen}/>
        <Stack.Screen name="Verification" component={VerificationScreen}/>
        <Stack.Screen name="ForgotPass" component={ForgotPassScreen}/>
        <Stack.Screen name="ResetPass" component={ResetPassScreen}/>
        <Stack.Screen name="Signup" component={SignupDetailsScreen} />
        <Stack.Screen name="Hometabs" component={HomeTabs}/>
        <Stack.Screen name="Rewards" component={RewardsScreen} />
        <Stack.Screen name="RewardDetails" component={RewardDetailsScreen} />
        <Stack.Screen name="AllRewards" component={AllRewardsScreen} /> 
        {/* <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Products' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Product Detail' }} /> */}
      </Stack.Navigator>
    </NavigationContainer>
    </SnackbarProvider>
    </SafeAreaProvider>
  );
}