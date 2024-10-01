import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
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
      <TouchableOpacity>
        <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} 
          onPress={() => navigation.navigate('Login')}
        />
       </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.instructions}>
          Enter your email to get started
        </Text>
        <Text style={styles.label}>Email</Text>
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
        <Text style={styles.buttonText}>Send Code</Text>
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
  instructions: {
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    textAlign: 'left',
    marginBottom: wp('4%'),
    fontSize: wp('3.5%'),
    letterSpacing: -.6,
  },
  label: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('3.5%')
  },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    padding: wp('2%'),
    borderRadius: 10,
    marginBottom: wp('3.7%'),
    height: hp('6%'),
  },
  input: { 
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingLeft: wp('1%') 
  },
  icon: {
    marginRight: wp('2%'),
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
  errorInput: { 
    borderColor: '#f66',
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: wp('4%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%')
  },
  focusedInput: {
    borderWidth: 1.5,
  },
});
