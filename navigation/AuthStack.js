import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import EmailInputScreen from '../screens/EmailInputScreen';
import VerificationScreen from '../screens/VerificationScreen';
import ForgotPassScreen from '../screens/ForgotPassScreen';
import ResetPassScreen from '../screens/ResetPassScreen';
import SignupDetailsScreen from '../screens/SignupDetailsScreen';
import RewardsScreen from '../screens/RewardsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Home: <Feather name="home" size={size} color={color} />,
            Rewards: <Ionicons name="gift-outline" size={size} color={color} />,
            Profile: <Feather name="user" size={size} color={color} />,
          };
          return icons[route.name];
        },
        tabBarActiveTintColor: '#455e14',
        tabBarInactiveTintColor: '#bdd299',
        tabBarStyle: {
          backgroundColor: '#e5eeda',
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Poppins-Bold',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Rewards" component={RewardsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function AuthStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EmailInput" component={EmailInputScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="ForgotPass" component={ForgotPassScreen} />
        <Stack.Screen name="ResetPass" component={ResetPassScreen} />
        <Stack.Screen name="Signup" component={SignupDetailsScreen} />
        <Stack.Screen name="MHome" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}