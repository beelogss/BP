import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Importing MaterialCommunityIcons

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email || !isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      // Placeholder for future backend implementation
      Alert.alert('Success', 'A password reset link has been sent to your email');
      navigation.navigate('ResetPass');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'An error occurred while requesting password reset');
    } finally {
      setIsLoading(false);
    }
  };

  // Disable button if email is invalid or empty
  const isFormValid = email && isValidEmail(email);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Forgot Password</Text>

        {/* Email Input with Icon */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? '#83951c' : '#83951c80' }]}
          onPress={handleForgotPassword}
          disabled={!isFormValid || isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send Code'}</Text>
        </TouchableOpacity>

        {/* Back to Login */}
        <Text style={styles.switchText}>
          Remember your password?{' '}
          <Text
            style={{ fontFamily: 'Poppins-Bold', fontSize: 16, color: '#455e14' }}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 35,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingBottom: 20,
  },
  title: {
    color: '#455e14',
    fontSize: 32,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#455e14',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    letterSpacing: 1,
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: 20,
    fontFamily: 'Poppins-Regular',
  },
});
