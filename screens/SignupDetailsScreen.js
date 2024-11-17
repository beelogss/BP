import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; // Using MaterialCommunityIcons for icons
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

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
      const response = await fetch('http://192.168.1.12:3000/signup', {
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.formContainer}>
      <TouchableOpacity>
        <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} 
          onPress={() => navigation.navigate('Login')}
        />
       </TouchableOpacity>
        <Text style={styles.title}>Sign up</Text>
        <Text style={styles.instructions}>Create account to continue</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

         {/* Student Number Input with Icon */}
         <View style={[styles.inputContainer, studentNumberFocused && styles.focusedInput]}>
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
        </View>

        {/* Name Input with Icon */}
        <View style={[styles.inputContainer, nameFocused && styles.focusedInput]}>
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
        </View>

        {/* Password Input with Icon */}
        <View style={[styles.passwordContainer, passwordFocused && styles.focusedInput]}>
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
              name={showPassword ? 'eye-off' : 'eye'}
              size={wp('5%')}
              color="#455e14"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Password Validation Hints */}
        <View style={styles.passwordHintContainer}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: wp('3.2%'), color: '#455e14' }}>Password must contain:</Text>
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
        </View>

        {/* Confirm Password Input with Icon */}
        <View style={[styles.passwordContainer, confirmPasswordFocused && styles.focusedInput]}>
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
              name={showConfirmPassword ? 'eye-off' : 'eye'}
              size={wp('5%')}
              color="#455e14"
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Signup Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? '#83951c' : '#83951c80' }]}
          onPress={handleSignup}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    marginTop:  wp('1.5%'),
    fontFamily: 'Poppins-Bold',
  },
  instructions: {
    fontFamily: 'Poppins-Regular',
    color: '#7a9b57',
    textAlign: 'left',
    fontSize: wp('3.5%'),
    marginBottom: wp('4%'),
    letterSpacing: -.6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 10,
    padding: wp('2%'),
    marginBottom: wp('3%'),
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
    padding: wp('3%'),
    borderRadius: 10,
    marginTop: hp('1.3%'),
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('4%'),
    letterSpacing: .1,
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: hp('2%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('4%'),
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
    marginTop: wp('1%'),
    marginBottom: wp('1%'),
  },
  passwordHintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp('1%'),
  },
  passwordHintText: {
    marginLeft: wp('1.5%'),
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%'),
  },
});
