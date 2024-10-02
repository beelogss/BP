import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function EmailInputScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendCodeToEmail = () => {
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setEmailError('');
    setLoading(true);

    // Simulate sending email code
    fetch('http://192.168.1.5:3000/sendVerificationCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          navigation.navigate('Verification', { email });
        } else {
          setEmailError(data.message); // Show error if email is already used
        }
      })
      .catch((error) => {
        setLoading(false);
        setEmailError('Failed to send code. Please try again.');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} onPress={() => navigation.navigate('Login')} />
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>
      <Text style={styles.instructions}>Enter your email to get started</Text>

      {/* Error Message Between Instructions and Email */}
      <View style={styles.errorContainer}>
      {emailError ? <AntDesign name="exclamationcircleo" size={wp('3%')} color="#f66" style={{alignSelf: "center"}}/>: null}
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <Text style={styles.label}>Email</Text>
      <View style={[styles.inputContainer, emailError && styles.errorInput, emailFocused && styles.focusedInput]}>
        <MaterialCommunityIcons name="email-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Enter Email"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setEmailError('');
          }}
          keyboardType="email-address"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
          selectionColor={"#bdd299"}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, validateEmail(email) ? styles.activeButton : styles.disabledButton]}
          onPress={sendCodeToEmail}
          disabled={!validateEmail(email) || loading}
        >
          <Text style={styles.buttonText}>Send Code</Text>
        </TouchableOpacity>

        {/* Loading Indicator (when loading) */}
        {loading && <ActivityIndicator style={styles.loadingIndicator} size="small" color="#83951c" />}
      </View>

      <Text style={styles.switchText}>
        Already have an account?{' '}
        <Text style={{ fontFamily: 'Poppins-Black', fontSize: wp('3.5%'), color: '#455e14' }} onPress={() => navigation.navigate('Login')}>
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
    marginTop: wp('2.5%'),
    fontFamily: 'Poppins-Bold',
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    textAlign: 'left',
    fontSize: wp('3.5%'),
    letterSpacing: -0.6,
  },
  errorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: hp('2.3%'),
  },
  errorText: {
    color: '#f66',
    alignSelf: 'center',
    fontSize: wp('3%'),
    fontFamily: 'Poppins-Regular',
    paddingTop: wp('.7%'),
    marginLeft: wp('1%'),
  },
  label: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('3.5%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    padding: wp('2%'),
    borderRadius: 10,
    marginBottom: wp('1%'),
    height: hp('6%'),
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingLeft: wp('1%'),
  },
  icon: {
    marginRight: wp('2%'),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp('4%'),
  },
  button: {
    flex: 1,
    padding: wp('3%'),
    borderRadius: 10,
  },
  activeButton: {
    backgroundColor: '#83951c',
  },
  disabledButton: {
    backgroundColor: '#83951c80',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    letterSpacing: 0.1,
  },
  loadingIndicator: {
    marginLeft: wp('3%'),
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: wp('4%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%'),
  },
  errorInput: {
    borderColor: '#f66',
  },
  focusedInput: {
    borderWidth: 1.5,
  },
});
