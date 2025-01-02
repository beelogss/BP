import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function EmailInputScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendCodeToEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setEmailError('');
    setLoading(true);

    try {
      const response = await fetch('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose: 'signup' }),
      });

      const data = await response.json();
      
      if (data.success) {
        navigation.navigate('Verification', { email });
      } else {
        setEmailError(data.message);
      }
    } catch (error) {
      setEmailError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <Pressable 
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.buttonPressed
          ]}
          android_ripple={{ color: '#f9f9f9', borderless: true, radius: 28 }}
        >
          <AntDesign name="arrowleft" size={wp('7%')} color="#455e14" />
        </Pressable>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(400)}
        style={styles.contentContainer}
      >
        <Text style={styles.title}>Sign Up</Text>
        <Text style={styles.instructions}>Enter your email to get started</Text>

        {emailError ? (
          <View style={styles.errorContainer}>
            <AntDesign name="exclamationcircle" size={wp('3.5%')} color="#f66" />
            <Text style={styles.errorText}>{emailError}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Email</Text>
        <View style={[
          styles.inputContainer, 
          emailError && styles.errorInput,
          emailFocused && styles.focusedInput
        ]}>
          <MaterialCommunityIcons 
            name="email-outline" 
            size={wp('5%')} 
            color={emailError ? '#f66' : '#455e14'} 
            style={styles.icon} 
          />
          <TextInput
            style={[styles.input, emailError && styles.errorTextInput]}
            placeholder="Enter Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            selectionColor="#bdd299"
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            !validateEmail(email) && styles.disabledButton,
            loading && styles.loadingButton
          ]}
          onPress={sendCodeToEmail}
          disabled={!validateEmail(email) || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Send Code</Text>
          )}
        </TouchableOpacity>

        <Pressable 
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => [
            styles.loginLink,
            pressed && styles.linkPressed
          ]}
        >
          <Text style={styles.switchText}>
            Already have an account?{' '}
            <Text style={styles.loginText}>Login</Text>
          </Text>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: hp('5%'),
    paddingHorizontal: wp('5%'),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: wp('8%'),
    paddingTop: hp('2%'),
  },
  backButton: {
    padding: wp('2%'),
    borderRadius: wp('10%'),
  },
  buttonPressed: {
    opacity: 0.7,
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
    marginBottom: hp('2%'),
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3f3',
    padding: wp('3%'),
    borderRadius: wp('2%'),
    marginBottom: hp('2%'),
  },
  errorText: {
    color: '#f66',
    fontSize: wp('3.2%'),
    fontFamily: 'Poppins-Medium',
    marginLeft: wp('2%'),
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
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    height: hp('7%'),
    backgroundColor: '#fff',
    marginBottom: hp('3%'),
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingHorizontal: wp('2%'),
  },
  errorTextInput: {
    color: '#f66',
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
  loadingButton: {
    opacity: 0.8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
  },
  loginLink: {
    marginTop: hp('3%'),
    padding: wp('2%'),
  },
  linkPressed: {
    opacity: 0.7,
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
  },
  loginText: {
    fontFamily: 'Poppins-Black',
    color: '#455e14',
  },
});
