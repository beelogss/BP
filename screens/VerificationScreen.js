import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';
import {AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { FadeIn, FadeInDown } from 'react-native-reanimated';

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

  const animateInput = (index) => {
    setFocusedIndex(index);
  };

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
    if (text.length > 1) {
      const pastedCode = text.split('').slice(0, 6);
      const newCode = [...verificationCode];
      let validDigits = true;

      pastedCode.forEach((digit, i) => {
        if (/^\d+$/.test(digit)) {
          newCode[i] = digit;
        } else {
          validDigits = false;
        }
      });

      if (validDigits) {
        setVerificationCode(newCode);
        setInputErrors(false);
        if (pastedCode.length === 6) {
          inputRefs.current[5].focus();
        }
      }
      return;
    }

    if (/^\d*$/.test(text)) {
      const newCode = [...verificationCode];
      newCode[index] = text;
      setVerificationCode(newCode);
      setInputErrors(false);

      if (text && index < 5) {
        setTimeout(() => {
          inputRefs.current[index + 1].focus();
        }, 10);
      }
    }
  };

  const handleBackspace = (index, event) => {
    if (event.nativeEvent.key === 'Backspace') {
      const newCode = [...verificationCode];
      
      if (!newCode[index] && index > 0) {
        newCode[index - 1] = '';
        setVerificationCode(newCode);
        inputRefs.current[index - 1].focus();
      } else {
        newCode[index] = '';
        setVerificationCode(newCode);
      }
    }
  };

  const handleSendVerification = () => {
    const code = verificationCode.join('');
  
    fetch('https://bp-opal.vercel.app/verifyCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Success', 'Email verified');
          // Navigate to Signup Screen with the verified email
          navigation.navigate('Signup', { email });
        } else {
          Alert.alert('Error', 'Invalid verification code');
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to verify code');
      });
  };
  
  
  

  const resendVerificationCode = () => {
    fetch('https://bp-opal.vercel.app/sendVerificationCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          Alert.alert('Success', 'New verification code sent');
          setTimer(30);  // Reset the timer for resend
          setIsResendClickable(false);  // Disable resend button again
        } else {
          Alert.alert('Error', data.message);
        }
      })
      .catch((error) => {
        Alert.alert('Error', 'Failed to resend code');
      });
  };
  
  
  

  const isCodeFilled = verificationCode.every((digit) => digit !== '');

  return (
    <Animated.View 
      entering={FadeIn}
      style={styles.container}
    >
      <TouchableOpacity>
        <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} 
          onPress={() => navigation.navigate('EmailInput')}
        />
       </TouchableOpacity>
      <Animated.View 
        entering={FadeInDown.delay(200)}
        style={styles.header}
      >
        <Text style={styles.title}>Verification</Text>
        <Text style={styles.emailText}>Enter 6-digit code sent by email to:</Text>
        <Text style={styles.highlightedText}>{email}</Text>
      </Animated.View>

      <Animated.View 
        entering={FadeInDown.delay(400)}
        style={styles.content}
      >
        <Animated.View
          style={[
            styles.codeContainer,
            { transform: [{ translateX: shakeAnimation }] }
          ]}
        >
          {verificationCode.map((code, index) => (
            <View
              key={index}
              style={styles.inputWrapper}
            >
              <TextInput
                style={[
                  styles.codeInput,
                  focusedIndex === index && styles.highlightedInput,
                  inputErrors && styles.errorInput
                ]}
                value={code}
                onChangeText={(text) => handleInputChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                ref={(ref) => (inputRefs.current[index] = ref)}
                onFocus={() => setFocusedIndex(index)}
                onBlur={() => setFocusedIndex(null)}
                onKeyPress={(event) => handleBackspace(index, event)}
                selectionColor="#83951c"
              />
            </View>
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
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp('8%'),
    backgroundColor: 'whitesmoke',
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
    width: wp('13%'),
    height: wp('13%'),
    borderWidth: 1.5,
    borderColor: '#455e14',
    borderRadius: wp('3%'),
    textAlign: 'center',
    fontSize: wp('6%'),
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    backgroundColor: '#fff',
    padding: 0,
  },
  highlightedInput: {
    borderColor: '#83951c',
    borderWidth: 2,
    backgroundColor: '#f9fbf6',
  },
  errorInput: {
    borderColor: '#f66',
    backgroundColor: '#fff3f3',
    transform: [{ scale: 1 }],
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
  inputWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: wp('3%'),
  },
});
