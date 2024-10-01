import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import {AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function VerificationCodeScreen({ route, navigation }) {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [inputErrors, setInputErrors] = useState(false);
  const [timer, setTimer] = useState(30); 
  const [isResendClickable, setIsResendClickable] = useState(false); 
  const [focusedIndex, setFocusedIndex] = useState(null); 
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsResendClickable(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const triggerShake = () => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleInputChange = (text, index) => {
    const newCode = [...verificationCode];

    if (index > 0 && !verificationCode[index - 1]) {
      setInputErrors(true);
      triggerShake();
      return;
    }

    setInputErrors(false);

    if (text.length > 1) {
      const pastedCode = text.split('').slice(0, 6);
      setVerificationCode(pastedCode);
      setInputErrors(false);
      pastedCode.forEach((_, i) => {
        if (inputRefs.current[i]) {
          inputRefs.current[i].focus();
        }
      });
      return;
    }

    newCode[index] = text;
    setVerificationCode(newCode);

    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    } else if (!text && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleBackspace = (index) => {
    if (!verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSendVerification = async () => {
    const code = verificationCode.join('');
    Alert.alert('Verification Code', `Your code is: ${code}`);
    navigation.navigate('Signup', { email });
  };

  const resendVerificationCode = () => {
    Alert.alert('Code Resent', `A new code has been sent to ${email}`);
    setTimer(30); 
    setIsResendClickable(false); 
  };

  const isCodeFilled = verificationCode.every((digit) => digit !== '');

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} 
          onPress={() => navigation.navigate('EmailInput')}
        />
       </TouchableOpacity>
      <Text style={styles.title}>Verification</Text>
      <Text style={styles.emailText}>{`Enter 6-digit code sent by email to:`}</Text>
      <Text style={styles.highlightedText}>{email}</Text>
      <Animated.View
        style={[
          styles.codeContainer,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        {verificationCode.map((code, index) => (
          <TextInput
            key={index}
            style={[
              styles.codeInput,
              (focusedIndex === index || verificationCode[index]) && styles.highlightedInput, // Keep highlighted if focused or has a value
              inputErrors && styles.errorInput,
            ]}
            value={code}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            onKeyPress={({ nativeEvent }) => {
              if (nativeEvent.key === 'Backspace') {
                handleBackspace(index);
              }
            }}
          />
        ))}
      </Animated.View>
      <TouchableOpacity
        style={[styles.button, !isCodeFilled && styles.disabledButton]}
        onPress={handleSendVerification}
        disabled={!isCodeFilled}
      >
        <Text style={styles.buttonText}>Confirm Code</Text>
      </TouchableOpacity>
      {timer > 0 ? (
        <Text style={styles.timerText}>
          Please wait <Text style={styles.highlightedTimer}>{timer}</Text> seconds to resend the code
        </Text>
      ) : (
        <Text style={styles.timerText}>
          Did not receive the code?{' '}
          <Text style={styles.resendText} onPress={resendVerificationCode}>
            Resend now
          </Text>
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('8%'),
    backgroundColor: '#fff',
    paddingTop: wp('20%'),
  },
  backIcon: {
    marginBottom: wp('3.5%'),
  },
  title: {
    color: '#455e14',
    fontSize: wp('7%'),
    textAlign: 'left',
    marginBottom: wp('.5%'),
    marginTop:  wp('2.5%'),
    fontFamily: 'Poppins-Bold',
  },
  emailText: { 
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    textAlign: 'left',
    fontSize: wp('3.5%'),
    letterSpacing: -.6,
  },
  highlightedText: {
    fontSize: wp('4%'),
    textAlign: 'left',
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: hp('2.5%'),
  },
  codeContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: hp('3.7%') 
  },
  codeInput: {
    width: wp('12%'),
    height: hp('6%'),
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: wp('6%'),
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
  },
  highlightedInput: {
    borderColor: '#83951c',
    borderWidth: 2,
  },
  errorInput: {
    borderColor: '#f66',
  },
  button: {
    backgroundColor: '#83951c',
    padding: wp('3%'),
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#83951c80',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    letterSpacing: .1,
  },
  timerText: {
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    fontSize: wp('3%'),
    marginTop: hp('2%'),
  },
  highlightedTimer: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
  resendText: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
});
