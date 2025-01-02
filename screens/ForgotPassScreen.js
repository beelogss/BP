import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose: 'reset' }), // Include purpose field
      });
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        Alert.alert('Success', 'A verification code has been sent to your email');
        navigation.navigate('ResetPass', { email });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'An error occurred while requesting password reset');
    }
  };

  const isFormValid = email && validateEmail(email);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeIn}
        style={styles.formContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
          android_ripple={{ color: '#f9f9f9', borderless: true, radius: 28 }}
        >
          <AntDesign name="arrowleft" size={wp('7%')} color="#455e14" />
        </TouchableOpacity>

        <Animated.Text 
          entering={FadeInDown.delay(200)}
          style={styles.title}
        >
          Forgot Password
        </Animated.Text>
        
        <Animated.Text 
          entering={FadeInDown.delay(300)}
          style={styles.instructions}
        >
          Please enter your email to reset the password
        </Animated.Text>

        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={styles.inputWrapper}
        >
          <Text style={styles.label}>Email</Text>
          <View style={[
            styles.inputContainer,
            emailError && styles.errorInput,
            emailFocused && styles.focusedInput
          ]}>
            <MaterialCommunityIcons 
              name="email-outline" 
              size={wp('5%')} 
              color="#455e14" 
              style={styles.icon} 
            />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#7a9b57"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(!validateEmail(text));
              }}
              keyboardType="email-address"
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(500)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.button,
              !isFormValid && styles.disabledButton
            ]}
            onPress={handleForgotPassword}
            disabled={!isFormValid || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Sending...' : 'Send Code'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text 
          entering={FadeInDown.delay(600)}
          style={styles.switchText}
        >
          Remember your password?{' '}
          <Text
            style={styles.loginText}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Animated.Text>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: wp('8%'),
    paddingTop: wp('15%'),
  },
  backButton: {
    marginBottom: hp('2%'),
    padding: wp('2%'),
    alignSelf: 'flex-start',
  },
  title: {
    color: '#455e14',
    fontSize: wp('8%'),
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('1%'),
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    fontSize: wp('3.8%'),
    marginBottom: hp('3%'),
    letterSpacing: -0.5,
  },
  inputWrapper: {
    marginBottom: hp('3%'),
  },
  label: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('3.5%'),
    marginBottom: hp('1%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#455e14',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    height: hp('7%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingLeft: wp('2%'),
  },
  icon: {
    marginRight: wp('2%'),
  },
  buttonContainer: {
    marginTop: hp('2%'),
  },
  button: {
    backgroundColor: '#83951c',
    padding: hp('2%'),
    borderRadius: wp('3%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#83951c80',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    letterSpacing: 0.5,
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: hp('3%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
  },
  loginText: {
    fontFamily: 'Poppins-Black',
    fontSize: wp('3.5%'),
    color: '#455e14',
  },
  errorInput: {
    borderColor: '#f66',
    backgroundColor: '#fff3f3',
  },
  focusedInput: {
    borderColor: '#83951c',
    borderWidth: 2,
    backgroundColor: '#f9fbf6',
  },
});