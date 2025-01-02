import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function ResetPassScreen({ route, navigation }) {
  const { email } = route.params;
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });

  useEffect(() => {
    let countdown;
    if (!isCodeVerified) {
      countdown = setInterval(() => {
        if (timer > 0) {
          setTimer((prevTimer) => prevTimer - 1);
        } else {
          setIsResendDisabled(false);
          clearInterval(countdown);
        }
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [timer, isCodeVerified]);

  const handleVerifyCode = async () => {
    try {
      const response = await fetch('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/verifyCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();

      if (data.success) {
        setIsCodeVerified(true);
        Alert.alert('Success', 'Code verified successfully');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while verifying the code');
    }
  };

  const handleResendCode = async () => {
    try {
      setIsResendDisabled(true);
      setTimer(60);
      const response = await fetch('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose: 'reset' }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Verification code resent');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resending the code');
    }
  };

  const handlePasswordInput = (password) => {
    setNewPassword(password);

    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    setPasswordValidation({
      length,
      uppercase,
      lowercase,
      number,
      specialChar,
    });
  };

  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleResetPassword = async () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }
    if (!isPasswordValid) {
      Alert.alert('Error', 'Password does not meet the requirements.');
      return;
    }

    try {
      const response = await fetch('https://4d18bffc-5559-4534-b92c-8106440742d3-00-3g1frlvror77n.riker.replit.dev/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, newPassword }),
      });
      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Password has been reset successfully');
        navigation.navigate('Login');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting the password');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.ScrollView 
        entering={FadeIn}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('ForgotPass')}
          >
            <AntDesign name="arrowleft" size={wp('7%')} color="#455e14" />
          </TouchableOpacity>

          <Animated.Text 
            entering={FadeInDown.delay(200)}
            style={styles.title}
          >
            Reset Password
          </Animated.Text>

          <Animated.Text 
            entering={FadeInDown.delay(300)}
            style={styles.instructions}
          >
            Enter the verification code sent to:
          </Animated.Text>
          <Text style={styles.highlightedText}>{email}</Text>

          <Animated.View 
            entering={FadeInDown.delay(400)}
            style={styles.codeContainer}
          >
            <View style={[
              styles.codeInputWrapper,
              isCodeVerified && styles.verifiedInput
            ]}>
              <TextInput
                style={styles.codeInput}
                value={code}
                onChangeText={setCode}
                maxLength={6}
                keyboardType="numeric"
                placeholder="Enter 6-digit code"
                placeholderTextColor="#7a9b57"
                editable={!isCodeVerified}
              />
            </View>
            <TouchableOpacity
              style={[
                styles.verifyButton,
                code.length === 6 && styles.activeVerifyButton,
                isCodeVerified && styles.verifiedButton
              ]}
              onPress={handleVerifyCode}
              disabled={code.length < 6 || isCodeVerified}
            >
              <Text style={styles.buttonText}>
                {isCodeVerified ? 'Verified ✓' : 'Verify Code'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View 
            entering={FadeInDown.delay(500)}
            style={styles.resendWrapper}
          >
            <Animated.View style={styles.resendContainer}>
              <Text style={[
                styles.timerText,
                isCodeVerified && styles.disabledText
              ]}>
                {isCodeVerified ? 'Code verified' : `Resend code in ${timer}s`}
              </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResendDisabled || isCodeVerified}
                style={styles.resendButton}
              >
                <Text style={[
                  styles.resendText,
                  (isResendDisabled || isCodeVerified) && styles.disabledText
                ]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>

          {isCodeVerified && <View style={styles.verifiedSpacing} />}

          <View style={[styles.inputContainer, !isCodeVerified && styles.disabledInput]}>
            <MaterialCommunityIcons name="lock-outline" size={wp('5%')} color={isCodeVerified ? "#455e14" : "#ccc"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={handlePasswordInput}
              secureTextEntry={!showPassword}
              editable={isCodeVerified}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={!isCodeVerified}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={wp('5%')}
                color={isCodeVerified ? "#455e14" : "#ccc"}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={[styles.passwordHintContainer, !isCodeVerified && styles.disabledInput]}>
            <Text style={styles.passwordHintTitle}>Password Requirements:</Text>
            {Object.entries(passwordValidation).map(([key, isValid]) => (
              <View key={key} style={styles.passwordHintItem}>
                <MaterialCommunityIcons 
                  name={isValid ? 'check-circle' : 'close-circle'}
                  size={wp('4%')} 
                  color={isValid ? '#7a9b57' : '#ed3e3e'} 
                />
                <Text style={[
                  styles.passwordHintText,
                  isValid && styles.validHintText
                ]}>
                  {key === 'length' && 'At least 8 characters'}
                  {key === 'uppercase' && 'One uppercase letter'}
                  {key === 'lowercase' && 'One lowercase letter'}
                  {key === 'number' && 'One number'}
                  {key === 'specialChar' && 'One special character'}
                </Text>
              </View>
            ))}
          </View>

          <View style={[styles.inputContainer, !isCodeVerified && styles.disabledInput]}>
            <MaterialCommunityIcons name="lock-check-outline" size={wp('5%')} color={isCodeVerified ? "#455e14" : "#ccc"} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChangeText={setConfirmNewPassword}
              secureTextEntry={!showConfirmPassword}
              editable={isCodeVerified}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={!isCodeVerified}
            >
              <MaterialCommunityIcons
                name={showConfirmPassword ? 'eye-off' : 'eye'}
                size={wp('5%')}
                color={isCodeVerified ? "#455e14" : "#ccc"}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: isCodeVerified && isPasswordValid ? '#83951c' : '#83951c80' }]}
            onPress={handleResetPassword}
            disabled={!isCodeVerified || !newPassword || !confirmNewPassword || !isPasswordValid}
          >
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>

        </View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  scrollContainer: {
    flex: 1,
  },
  formContainer: {
    padding: wp('8%'),
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
    marginBottom: hp('1%'),
    letterSpacing: -0.5,
  },
  highlightedText: {
    fontSize: wp('3.8%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('3%'),
  },
  codeContainer: {
    marginBottom: hp('3%'),
  },
  codeInputWrapper: {
    borderWidth: 1.5,
    borderColor: '#455e14',
    borderRadius: wp('3%'),
    backgroundColor: '#fff',
    marginBottom: hp('2%'),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  codeInput: {
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    fontSize: wp('4.5%'),
    height: hp('7%'),
    textAlign: 'center',
    letterSpacing: wp('1%'),
  },
  verifiedInput: {
    borderColor: '#7a9b57',
    backgroundColor: '#f9fbf6',
  },
  verifyButton: {
    backgroundColor: '#83951c80',
    padding: hp('2%'),
    borderRadius: wp('3%'),
    alignItems: 'center',
  },
  activeVerifyButton: {
    backgroundColor: '#83951c',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  verifiedButton: {
    backgroundColor: '#7a9b57',
  },
  passwordHintContainer: {
    marginTop: wp('1%'),
    marginBottom: wp('1%'),
  },
  passwordHintTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  passwordHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
  },
  passwordHintText: {
    marginLeft: wp('2%'),
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.2%'),
  },
  validHintText: {
    color: '#7a9b57',
  },
  resendWrapper: {
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resendButton: {
    marginLeft: wp('2%'),
  },
  timerText: {
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.2%'),
  },
  highlightedTimer: {
    fontFamily: 'Poppins-Bold',
    color: '#83951c',
  },
  resendText: {
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginLeft: wp('2%'),
  },
  disabledText: {
    color: '#83951c80',
    opacity: 0.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 10,
    paddingVertical: hp('0.9%'),
    paddingHorizontal: wp('2%'),
    height: hp('6%'),
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingLeft: wp('1%') 
  },
  eyeIcon: {
    marginLeft: wp('1.5%'),
  },
  icon: {
    marginRight: wp('2%'),
  },
  button: {
    padding: wp('3%'),
    borderRadius: 10,
    marginTop: wp('3.7%'),
  },
  buttonText: {
    color: '#fff', 
    textAlign: 'center', 
    fontFamily: 'Poppins-Bold', 
    fontSize: wp('4.5%'),
  },
  disabledInput: {
    opacity: 0.5,
  },
  hideContainer: {
    display: 'none',
  },
  verifiedSpacing: {
    height: hp('2%'),
  },
});