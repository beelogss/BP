import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function EmailInputScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendCodeToEmail = () => {
    if (!email) {
      setEmailError(true);
      return;
    }
    // Add your logic to send a code to the user's email
    Alert.alert('Code Sent', `Verification code sent to ${email}`);
    // Navigate to Verification Code screen after sending the code
    navigation.navigate('Verification', { email });
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your Email</Text>
      <View style={[styles.inputContainer, emailError && styles.errorInput, emailFocused && styles.focusedInput]}>
        <MaterialCommunityIcons name="email-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError(!validateEmail(text));
          }}
          keyboardType="email-address"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          caretColor="#455e14"
        />
      </View>
      <TouchableOpacity
        style={[styles.button, (!email || emailError) && styles.disabledButton]}
        onPress={sendCodeToEmail}
        disabled={!email || emailError}
      >
        <Text style={styles.buttonText}>Send Code to Email</Text>
      </TouchableOpacity>
      <Text style={styles.switchText}>
        Already have an account?{' '}
        <Text
          style={{ fontFamily: 'Poppins-Black', fontSize: wp('3.5%'), color: '#455e14' }}
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingTop: hp('2.5%'), 
    flex: 1, 
    paddingHorizontal: wp('8%'), 
    backgroundColor: 'white' 
  },
  title: { 
    fontSize: wp('8%'), 
    marginBottom: hp('2.5%'), 
    textAlign: 'center', 
    fontFamily: 'Poppins-Bold', 
    color: '#455e14' 
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#455e14',
    borderRadius: 5,
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('3%'),
    marginBottom: hp('2%'),
    height: hp('6%'),
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
  button: { 
    padding: wp('3%'),
    borderRadius: 5,
    marginTop: hp('1%'),
  },
  disabledButton: {
    backgroundColor: '#83951c80',
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontFamily: 'Poppins-Bold', 
    fontSize: wp('4.5%'),
  },
  errorInput: { 
    borderColor: '#f66',
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: hp('3%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.3%'),
  },
  focusedInput: {
    borderWidth: 1.5,
  },
});
