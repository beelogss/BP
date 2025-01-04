import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ToastAndroid, Alert, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Checkbox from 'expo-checkbox';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UserContext } from '../context/UserContext';  // Import UserContext
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const { setUser } = useContext(UserContext);  // Use setUser from context

  useEffect(() => {
    // Retrieve stored credentials on component mount
    const loadCredentials = async () => {
      try {
        const rememberMe = await AsyncStorage.getItem('rememberMe');
        if (rememberMe === 'true') {
          const storedEmail = await AsyncStorage.getItem('email');
          const storedPassword = await AsyncStorage.getItem('password');
          if (storedEmail && storedPassword) {
            setEmail(storedEmail);
            setPassword(storedPassword);
            setChecked(true);
            handleLogin(storedEmail, storedPassword);
          }
        } else {
          setChecked(false);
        }
      } catch (error) {
        console.error('Failed to load credentials', error);
      }
    };
  
    loadCredentials();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (emailParam, passwordParam) => {
    const emailToUse = emailParam || email;
    const passwordToUse = passwordParam || password;
  
    if (!validateEmail(emailToUse) || !passwordToUse) {
      if (!emailToUse) setEmailError(true);
      if (!passwordToUse) setPasswordError(true);
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch('https://079d4493-7284-45e2-8f07-032acf84a6e7-00-okeb4h5jwg8d.pike.replit.dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToUse, password: passwordToUse }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        ToastAndroid.show('Logged in successfully!', ToastAndroid.LONG);
        setUser(data.user);
  
        // Only store credentials if Remember Me is checked
        if (isChecked) {
          await AsyncStorage.setItem('rememberMe', 'true');
          await AsyncStorage.setItem('email', emailToUse);
          await AsyncStorage.setItem('password', passwordToUse);
        } else {
          // Clear stored credentials if Remember Me is unchecked
          await AsyncStorage.multiRemove(['rememberMe', 'email', 'password']);
        }
  
        navigation.reset({
          index: 0,
          routes: [{ name: 'Hometabs' }],
        });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Failed to log in. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRememberMe = async (value) => {
    setChecked(value);
    if (!value) {
      // Clear stored credentials when unchecking Remember Me
      try {
        await AsyncStorage.multiRemove(['rememberMe', 'email', 'password']);
      } catch (error) {
        console.error('Error clearing stored credentials:', error);
      }
    }
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <Animated.View 
          entering={FadeIn}
          style={styles.imageContainer}
        >
          <Image
            style={styles.image}
            source={require('../assets/images/small-logo.png')}
            resizeMode="contain"
          />
          <Text style={styles.bottleText}>
            Bottle <Text style={styles.pointsText}>Points</Text>
          </Text>
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(200)}
          style={styles.formContainer}
        >
          <Text style={styles.title}>Login to your account</Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputContainer, 
              emailError && styles.errorInput, 
              emailFocused && styles.focusedInput
            ]}>
              <MaterialCommunityIcons 
                name="email-outline" 
                size={wp('5%')} 
                color={emailError ? '#f66' : '#455e14'} 
                style={styles.icon} 
              />
              <TextInput
                style={[styles.input, emailError && styles.errorText]}
                placeholder="Enter Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setEmailError(!validateEmail(text));
                }}
                keyboardType="email-address"
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                selectionColor="#bdd299"
                autoCapitalize="none"
              />
            </View>
            {emailError && (
              <Text style={styles.errorMessage}>Please enter a valid email</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.inputContainer, 
              passwordError && styles.errorInput, 
              passwordFocused && styles.focusedInput
            ]}>
              <MaterialCommunityIcons 
                name="key-outline" 
                size={wp('5%')} 
                color={passwordError ? '#f66' : '#455e14'} 
                style={styles.icon} 
              />
              <TextInput
                style={[styles.input, passwordError && styles.errorText]}
                placeholder="Enter Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(!text);
                }}
                secureTextEntry={!showPassword}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                selectionColor="#bdd299"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIconContainer}
              >
                <MaterialCommunityIcons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={wp('5%')}
                  color="#455e14"
                />
              </TouchableOpacity>
            </View>
            {passwordError && (
              <Text style={styles.errorMessage}>Password is required</Text>
            )}
          </View>

          <View style={styles.row}>
            <TouchableOpacity 
              style={styles.rememberMeContainer}
              onPress={() => handleRememberMe(!isChecked)}
            >
              <Checkbox
                value={isChecked}
                onValueChange={handleRememberMe}
                color={isChecked ? "#455e14" : undefined}
                style={styles.checkbox}
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => navigation.navigate('ForgotPass')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              (!email || !password || emailError) && styles.disabledButton
            ]}
            onPress={() => handleLogin()}
            disabled={!email || !password || emailError || loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text 
          entering={FadeInDown.delay(400)}
          style={styles.switchText}
        >
          Don't have an account?{" "}
          <Text
            style={styles.signupText}
            onPress={() => navigation.navigate('EmailInput')}
          >
            Sign up
          </Text>
        </Animated.Text>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: wp('35%'),
    height: wp('35%'),
  },
  bottleText: {
    color: '#455e14',
    fontFamily: 'Poppins-Black',
    fontSize: hp('4%'),
    marginTop: -hp('2%'),
  },
  pointsText: {
    color: '#83951c',
    fontFamily: 'Poppins-Black',
    fontSize: hp('4%'),
  },
  formContainer: {
    padding: wp('5%'),
    width: wp('90%'),
    alignSelf: 'center',
  },
  title: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('5%'),
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: hp('2%'),
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
    borderRadius: wp('3%'),
    paddingHorizontal: wp('3%'),
    height: hp('6%'),
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: wp('3.5%'),
    paddingHorizontal: wp('2%'),
  },
  icon: {
    marginRight: wp('2%'),
  },
  eyeIconContainer: {
    padding: wp('2%'),
  },
  errorInput: {
    borderColor: '#f66',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#f66',
  },
  errorMessage: {
    color: '#f66',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%'),
    marginTop: hp('0.5%'),
    marginLeft: wp('1%'),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderColor: '#455e14',
    width: wp('4%'),
    height: wp('4%'),
    marginRight: wp('2%'),
  },
  rememberMeText: {
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%'),
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Medium',
    color: '#455e14',
    fontSize: wp('3%'),
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#83951c',
    padding: hp('1.8%'),
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
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.5%'),
    marginTop: hp('3%'),
  },
  signupText: {
    fontFamily: 'Poppins-Black',
    fontSize: wp('3.5%'),
    color: '#455e14',
  },
});