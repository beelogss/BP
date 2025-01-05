import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; // Using MaterialCommunityIcons for icons
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function SignupScreen({ route, navigation }) {
  const { email } = route.params; 
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

    try {
      // Call the backend API to create the user
      const response = await fetch('https://bp-opal.vercel.app/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,  // Include the verified email
          name,
          studentNumber,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', 'Account created successfully');
        navigation.navigate('Login');  // Redirect to login screen
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create account');
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View 
        entering={FadeIn}
        style={styles.formContainer}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Login')}
          android_ripple={{ color: '#f9f9f9', borderless: true, radius: 28 }}
        >
          <AntDesign name="arrowleft" size={wp('7%')} color="#455e14" />
        </TouchableOpacity>

        <Animated.Text 
          entering={FadeInDown.delay(200)}
          style={styles.title}
        >
          Sign up
        </Animated.Text>
        <Animated.Text 
          entering={FadeInDown.delay(300)}
          style={styles.instructions}
        >
          Create account to continue
        </Animated.Text>

        {error ? (
          <Animated.Text 
            entering={FadeInDown.delay(100)}
            style={styles.errorText}
          >
            {error}
          </Animated.Text>
        ) : null}

        {/* Update input containers with animations and better styling */}
        <Animated.View 
          entering={FadeInDown.delay(400)}
          style={[
            styles.inputContainer,
            studentNumberFocused && styles.focusedInput,
            { marginBottom: hp('2%') }
          ]}
        >
          <MaterialCommunityIcons name="school-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Student Number (00-00000)"
            value={studentNumber}
            onChangeText={handleStudentNumberChange}
            keyboardType="numeric"
            maxLength={8}
            onFocus={() => setStudentNumberFocused(true)}
            onBlur={() => setStudentNumberFocused(false)}
            selectionColor={"#bdd299"}
          />
        </Animated.View>

        {/* Name Input with Icon */}
        <Animated.View 
          entering={FadeInDown.delay(500)}
          style={[
            styles.inputContainer,
            nameFocused && styles.focusedInput,
            { marginBottom: hp('2%') }
          ]}
        >
          <MaterialCommunityIcons name="account-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            onFocus={() => setNameFocused(true)}
            onBlur={() => setNameFocused(false)}
            selectionColor={"#bdd299"}
          />
        </Animated.View>

        {/* Password Input with Icon */}
        <Animated.View 
          entering={FadeInDown.delay(600)}
          style={[
            styles.passwordContainer,
            passwordFocused && styles.focusedInput,
            { marginBottom: hp('2%') }
          ]}
        >
          <MaterialCommunityIcons name="lock-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={handlePassword}
            secureTextEntry={!showPassword}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
            selectionColor={"#bdd299"}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye' : 'eye-off'}
              size={wp('5%')}
              color="#455e14"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Password Validation Hints */}
        <Animated.View 
          entering={FadeInDown.delay(700)}
          style={styles.passwordHintContainer}
        >
          <Text style={styles.passwordHintTitle}>Password must contain:</Text>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons
              name={passwordValidation.length ? 'check' : 'close'}
              size={wp('4%')}
              color={passwordValidation.length ? '#7a9b57' : '#ed3e3e'}
            />
            <Text style={styles.passwordHintText}>At least 8 characters</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons
              name={passwordValidation.uppercase ? 'check' : 'close'}
              size={wp('4%')}
              color={passwordValidation.uppercase ? '#7a9b57' : '#ed3e3e'}
            />
            <Text style={styles.passwordHintText}>Contains uppercase letter</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons
              name={passwordValidation.lowercase ? 'check' : 'close'}
              size={wp('4%')}
              color={passwordValidation.lowercase ? '#7a9b57' : '#ed3e3e'}
            />
            <Text style={styles.passwordHintText}>Contains lowercase letter</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons
              name={passwordValidation.number ? 'check' : 'close'}
              size={wp('4%')}
              color={passwordValidation.number ? '#7a9b57' : '#ed3e3e'}
            />
            <Text style={styles.passwordHintText}>Contains number</Text>
          </View>
          <View style={styles.passwordHintItem}>
            <MaterialCommunityIcons
              name={passwordValidation.specialChar ? 'check' : 'close'}
              size={wp('4%')}
              color={passwordValidation.specialChar ? '#7a9b57' : '#ed3e3e'}
            />
            <Text style={styles.passwordHintText}>Contains special character</Text>
          </View>
        </Animated.View>

        {/* Confirm Password Input with Icon */}
        <Animated.View 
          entering={FadeInDown.delay(800)}
          style={[
            styles.passwordContainer,
            confirmPasswordFocused && styles.focusedInput,
            { marginBottom: hp('2%') }
          ]}
        >
          <MaterialCommunityIcons name="lock-check-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            onFocus={() => setConfirmPasswordFocused(true)}
            onBlur={() => setConfirmPasswordFocused(false)}
            selectionColor={"#bdd299"}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <MaterialCommunityIcons
              name={showConfirmPassword ? 'eye' : 'eye-off'}
              size={wp('5%')}
              color="#455e14"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </Animated.View>

        {/* Signup Button */}
        <Animated.View 
          entering={FadeInDown.delay(900)}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.button,
              !isFormValid && styles.disabledButton
            ]}
            onPress={handleSignup}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: wp('8%'),
    paddingTop: wp('15%'),
  },
  backButton: {
    marginBottom: hp('2%'),
    padding: wp('2%'),
    alignSelf: 'flex-start',
  },
  title: {
    color: '#455e14',
    fontSize: wp('8%'),
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('1%'),
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    fontSize: wp('3.8%'),
    marginBottom: hp('3%'),
    letterSpacing: -0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#455e14',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    height: hp('7%'),
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 10,
    padding: wp('2%'),
    height: hp('6%'),
  },
  passwordInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingLeft: wp('1%') 
  },
  eyeIcon: {
    marginLeft: wp('2%'),
  },
  button: {
    backgroundColor: '#83951c',
    padding: hp('2%'),
    borderRadius: wp('3%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  disabledButton: {
    backgroundColor: '#83951c80',
    elevation: 0,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    letterSpacing: 0.5,
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: hp('2%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
  },
  errorText: {
    color: '#f66',
    textAlign: 'center',
    marginBottom: hp('2%'),
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
    backgroundColor: '#fff3f3',
    padding: wp('2%'),
    borderRadius: wp('2%'),
  },
  focusedInput: {
    borderColor: '#83951c',
    borderWidth: 2,
    backgroundColor: '#f9fbf6',
  },
  passwordHintContainer: {
    marginVertical: hp('2%'),
    backgroundColor: '#f9fbf6',
    padding: wp('4%'),
    borderRadius: wp('3%'),
  },
  passwordHintTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.5%'),
    color: '#455e14',
    marginBottom: hp('1%'),
  },
  passwordHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: hp('0.5%'),
  },
  passwordHintText: {
    marginLeft: wp('2%'),
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.2%'),
  },
});
