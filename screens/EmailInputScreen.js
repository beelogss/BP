import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Importing MaterialCommunityIcons

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
        <MaterialCommunityIcons name="email-outline" size={24} color="#455e14" style={styles.icon} />
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
        disabled={!email || emailError} // Disable button if email is invalid
      >
        <Text style={styles.buttonText}>Send Code to Email</Text>
      </TouchableOpacity>
      <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text 
            style={{ fontFamily: 'Poppins-Black', fontSize: 14, color: '#455e14' }}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 50, flex: 1, paddingHorizontal: 35, backgroundColor: 'white' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', fontFamily: 'Poppins-Bold', color: '#455e14' },
  inputContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, // Apply border to the container only
    borderColor: '#455e14',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 48,
  },
  input: { 
    flex: 1, // Take full width minus the icon
    fontFamily: 'Poppins-Regular', 
    color: '#455e14', 
    fontSize: 14,
    paddingLeft: 5, // Add some space between icon and text
  },
  icon: {
    marginRight: 5,
  },
  button: { 
    backgroundColor: '#83951c', 
    padding: 15, 
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#83951c80', // Lighter background when button is disabled
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontFamily: 'Poppins-Bold' 
  },
  errorInput: { 
    borderColor: '#f66',
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  focusedInput: {
    borderWidth: 1.5, // Thicker border when focused
  }
});
