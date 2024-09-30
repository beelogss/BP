import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ResetPassScreen({ navigation }) {
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
    const countdown = setInterval(() => {
      if (timer > 0) {
        setTimer((prevTimer) => prevTimer - 1);
      } else {
        setIsResendDisabled(false);
        clearInterval(countdown);
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer]);

  const handleVerifyCode = () => {
    if (code === '123456') { // Sample validation
      setIsCodeVerified(true);
      alert('Code verified successfully');
    } else {
      alert('Invalid verification code');
    }
  };

  const handleResendCode = () => {
    setIsResendDisabled(true);
    setTimer(60);
    alert('Verification code resent');
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

  const handleResetPassword = () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords don't match");
      return;
    }
    if (!isPasswordValid) {
      alert('Password does not meet the requirements.');
      return;
    }
    alert('Password has been reset successfully');
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Reset Password</Text>

        {/* Instructions Label */}
        <Text style={styles.instructions}>
          Please enter the verification code sent to your email, and then set your new password.
        </Text>

        {/* Verification Code Input */}
        <View style={styles.codeContainer}>
          <TextInput
            style={[styles.codeInput, isCodeVerified && styles.disabledInput]}
            value={code}
            onChangeText={setCode}
            maxLength={6}
            keyboardType="numeric"
            placeholder="Enter verification code"
            editable={!isCodeVerified}
          />
          <TouchableOpacity
            style={[styles.verifyButton, { backgroundColor: !isCodeVerified && code.length == 6 ? '#83951c' : '#83951c80' }]}
            onPress={handleVerifyCode}
            disabled={code.length < 6 || isCodeVerified}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        </View>

        {/* Resend Code and Timer */}
        <View style={[styles.resendContainer, isCodeVerified && styles.verifiedContainer]}>
          {isCodeVerified ? (
            <Text style={styles.verifiedText}>Code Verified</Text>
          ) : (
            <>
              <Text style={styles.timerText}>
                Resend in:  <Text style={styles.highlightedTimer}>{timer}s</Text>
              </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResendDisabled || isCodeVerified}
              >
                <Text style={[styles.resendText, (isResendDisabled || isCodeVerified) && styles.disabledText]}>
                Resend Code
                </Text>
              </TouchableOpacity>
              </>
          )}
        </View>

        {/* Password Input */}
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

        {/* Password Validation Hints */}
        <View style={[styles.passwordHintContainer, !isCodeVerified && styles.disabledInput]}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: wp('3.5%'), color: '#455e14' }}>Password must contain:</Text>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.length ? 'check' : 'close'}
              size={wp('5%')} 
              color={passwordValidation.length ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>At least 8 characters</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.uppercase ? 'check' : 'close'}
              size={wp('5%')} 
              color={passwordValidation.uppercase ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains uppercase letter</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.lowercase ? 'check' : 'close'}
              size={wp('5%')} 
              color={passwordValidation.lowercase ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains lowercase letter</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.number ? 'check' : 'close'}
              size={wp('5%')} 
              color={passwordValidation.number ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains number</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.specialChar ? 'check' : 'close'}
              size={wp('5%')} 
              color={passwordValidation.specialChar ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains special character</Text>
          </View>
        </View>

        {/* Confirm Password Input */}
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

        {/* Reset Password Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isCodeVerified && isPasswordValid ? '#83951c' : '#83951c80' }]}
          onPress={handleResetPassword}
          disabled={!isCodeVerified || !newPassword || !confirmNewPassword || !isPasswordValid}
        >
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('7%'),
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingBottom: 20,
  },
  title: {
    color: '#455e14',
    fontSize: wp('7%'),
    textAlign: 'center',
    marginBottom: wp('2.5%'),
    marginTop:  wp('2.5%'),
    fontFamily: 'Poppins-Bold',
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    textAlign: 'center',
    marginBottom: wp('2.5%'),
    fontSize: wp('3.5%'),
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('5%'),
  },
  codeInput: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#455e14',
    padding: wp('2%'),
    borderRadius: 5,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('4%'),
  },
  verifyButton: {
    backgroundColor: '#83951c',
    padding: wp('2.5%'),
    borderRadius: 5,
    marginLeft: wp('2%'),
    width: wp('25%'),
  },
  verifiedContainer: {
    backgroundColor: '#e5eeda',
    paddingVertical: wp('0.5%'),
    paddingHorizontal: wp('2%'),
    borderRadius: 5,
    height: wp('10%'),
    justifyContent: 'center',
  },
  verifiedText: {
    fontFamily: 'Poppins-SemiBold',
    color: '#7a9b57',
    fontSize: wp('4%'),
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp('3%'),
    height: wp('10%'),
  },
  timerText: {
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  highlightedTimer: {
    color: '#83951c',
    fontFamily: 'Poppins-Bold',
  },
  resendText: {
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginLeft: wp('2%'),
    
  },
  disabledText: {
    color: '#83951c80',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#455e14',
    padding: wp('2%'),
    marginVertical: wp('2%'),
    borderRadius: 5,
    height: wp('12%'),
  },
  input: {
    flex: 1,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  eyeIcon: {
    marginLeft: wp('1.5%'),
  },
  icon: {
    marginRight: wp('2%'),
  },
  button: {
    padding: wp('3%'),
    borderRadius: 5,
    marginTop: wp('2%'),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  disabledInput: {
    opacity: 0.5,
  },
  passwordHintContainer: {
    marginTop: wp('1%'),
    marginBottom: wp('1%'),
  },
  passwordHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('1%'),
  },
  passwordHintText: {
    marginLeft: wp('1.5%'),
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
  },
});
