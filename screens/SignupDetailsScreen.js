import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Using MaterialCommunityIcons for icons

const { width, height } = Dimensions.get('window');

export default function SignupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  // Input focus states
  const [nameFocused, setNameFocused] = useState(false);
  const [studentNumberFocused, setStudentNumberFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    specialChar: false,
  });


  const handleSignup = async () => {
    if (!name || !studentNumber || !password || !confirmPassword) {
      setError('Please fill out all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    else if (!isPasswordValid) {
      alert('Password does not meet the requirements.');
      return;
    }

    setError('');  // Clear error if validations pass

    try {
      const response = await fetch('http://192.168.1.2:3000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          studentNumber: studentNumber,
          password: password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // If the signup was successful, navigate to the EmailInput screen
        navigation.navigate('EmailInput');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error(error);
      setError('Error connecting to server');
    }
  };

  const handleStudentNumberChange = (text) => {
    let formattedText = text.replace(/[^0-9]/g, '');
    if (formattedText.length > 2) {
      formattedText = formattedText.slice(0, 2) + '-' + formattedText.slice(2);
    }
    setStudentNumber(formattedText);
  };

  // Determine if button should be enabled
  const isFormValid = name && studentNumber && password && confirmPassword;

  const handlePassword = (password) => {
    setPassword(password);
    
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* Name Input with Icon */}
        <View style={[styles.inputContainer, nameFocused && styles.focusedInput]}>
          <MaterialCommunityIcons name="account-outline" size={20} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
          />
        </View>

        {/* Student Number Input with Icon */}
        <View style={[styles.inputContainer, studentNumberFocused && styles.focusedInput]}>
          <MaterialCommunityIcons name="school-outline" size={20} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Student Number (00-00000)"
            value={studentNumber}
            onChangeText={handleStudentNumberChange}
            keyboardType="numeric"
            maxLength={8}
            onFocus={() => setStudentNumberFocused(true)}
            onBlur={() => setStudentNumberFocused(false)}
          />
        </View>

        {/* Password Input with Icon */}
        <View style={[styles.passwordContainer, passwordFocused && styles.focusedInput]}>
          <MaterialCommunityIcons name="lock-outline" size={20} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={handlePassword}
            secureTextEntry={!showPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#455e14"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.passwordHintContainer}>
        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, color: '#455e14' }}>Password must contain:</Text>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.length ? 'check' : 'close'}
              size={20} 
              color={passwordValidation.length ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>At least 8 characters</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.uppercase ? 'check' : 'close'}
              size={20} 
              color={passwordValidation.uppercase ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains uppercase letter</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.lowercase ? 'check' : 'close'}
              size={20} 
              color={passwordValidation.lowercase ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains lowercase letter</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.number ? 'check' : 'close'}
              size={20} 
              color={passwordValidation.number ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains number</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons 
              name={passwordValidation.specialChar ? 'check' : 'close'}
              size={20} 
              color={passwordValidation.specialChar ? '#7a9b57' : '#ed3e3e'} 
            />
            <Text style={styles.passwordHintText}>Contains special character</Text>
          </View>
        </View>

        {/* Confirm Password Input with Icon */}
        <View style={[styles.passwordContainer, confirmPasswordFocused && styles.focusedInput]}>
          <MaterialCommunityIcons name="lock-check-outline" size={20} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialCommunityIcons
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#455e14"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? '#83951c' : '#83951c80' }]}
          onPress={handleSignup}
          disabled={!isFormValid} // Disable button if form is invalid
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.switchText}>
          Already have an account?{" "}
          <Text 
            style={{ fontFamily: 'Poppins-Bold', fontSize: 14, color: '#455e14' }}
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
    paddingHorizontal: width * 0.08,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingBottom: 20,
  },
  title: {
    color: '#455e14',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    padding: 8,
    marginVertical: 8,
    borderRadius: 5,
    height: 48,
  },
  input: {
    flex: 1,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  icon: {
    marginRight: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    padding: 8,
    borderRadius: 5,
    marginVertical: 8,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  button: {
    padding: 12,
    borderRadius: 5,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    letterSpacing: 1.5,
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
  },
  focusedInput: {
    borderWidth: 1.5, // Thicker border when focused
  },
  passwordHintContainer: {
    marginTop: 5,
    marginBottom:5,
  },
  passwordHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  passwordHintText: {
    marginLeft: 6,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
});
