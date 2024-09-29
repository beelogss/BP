import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Animated } from 'react-native';

export default function VerificationCodeScreen({ route, navigation }) {
  const { email } = route.params;
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(''));
  const [inputErrors, setInputErrors] = useState(false);
  const [timer, setTimer] = useState(30); // Set the initial timer (e.g., 30 seconds)
  const [isResendClickable, setIsResendClickable] = useState(false); // Disable resend initially
  const inputRefs = useRef([]);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Countdown timer for resending the code
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      setIsResendClickable(true); // Enable the resend button when the timer reaches 0
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
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
    // Here you can add logic to verify the code
    navigation.navigate('Signup', { email });
  };

  const resendVerificationCode = () => {
    // Logic to resend the verification code to the user's email
    Alert.alert('Code Resent', `A new code has been sent to ${email}`);
    setTimer(30); // Reset the timer to 30 seconds (or whatever duration you prefer)
    setIsResendClickable(false); // Disable the resend button again
  };

  const isCodeFilled = verificationCode.every((digit) => digit !== '');

  return (
    <View style={styles.container}>
      <Text style={styles.emailText}>{`Your code is sent by email to: `}</Text>
      <Text style={styles.highlightedText}>{email}</Text>
      <Text style={styles.title}>Enter Verification Code</Text>
      <Animated.View
        style={[
          styles.codeContainer,
          { transform: [{ translateX: shakeAnimation }] },
        ]}
      >
        {verificationCode.map((code, index) => (
          <TextInput
            key={index}
            style={[styles.codeInput, inputErrors && styles.errorInput]}
            value={code}
            onChangeText={(text) => handleInputChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            ref={(ref) => (inputRefs.current[index] = ref)}
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
        disabled={!isCodeFilled} // Disable if code is incomplete
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
  container: { paddingTop: 35, flex: 1, paddingHorizontal: 35, backgroundColor: 'white' },
  title: {
    fontSize: 24,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    color: '#83951c'
  },
  emailText: { fontSize: 16, textAlign: 'center', fontFamily: 'Poppins-Regular', color: '#83951c' },
  highlightedText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    color: '#455e14',
    marginBottom: 20, // Extra space after email
  },
  codeContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  codeInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    width: 40,
  },
  errorInput: {
    borderColor: 'red',
  },
  button: {
    backgroundColor: '#83951c',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#83951c80', // Slightly faded background when disabled
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  timerText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#83951c',
    marginTop: 15,
  },
  highlightedTimer: {
    color: '#455e14', // Highlighted timer color
    fontFamily: 'Poppins-Bold',
  },
  resendText: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
});
