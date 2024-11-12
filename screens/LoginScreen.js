import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, ToastAndroid, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Checkbox from 'expo-checkbox';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { UserContext } from '../context/UserContext';  // Import UserContext
import AsyncStorage from '@react-native-async-storage/async-storage';  // Import AsyncStorage

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isChecked, setChecked] = useState(false);
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
  
    try {
      const response = await fetch('http://192.168.1.9:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: emailToUse, password: passwordToUse }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        ToastAndroid.show('Logged in successfully!', ToastAndroid.LONG);
        setUser(data.user);  // Store user data in context
  
        // Store credentials in AsyncStorage
        await AsyncStorage.setItem('email', emailToUse);
        await AsyncStorage.setItem('password', passwordToUse);
  
        navigation.navigate('Hometabs');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log in');
    }
  };

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={require('../assets/images/small-logo.png')}
          />
          <Text style={styles.bottleText}>Bottle{" "}
            <Text style={{color: '#83951c', fontFamily: 'Poppins-Black', fontSize: hp('4%'),textAlign: 'center',}}>Points
            </Text>
            </Text>
        </View>

        <View style={styles.formContainer}>
        <Text style={styles.title}>Login to your account</Text>
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
              selectionColor={"#bdd299"}       
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputContainer, passwordError && styles.errorInput, passwordFocused && styles.focusedInput]}>
            <MaterialCommunityIcons name="key-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(!text);
              }}
              secureTextEntry={!showPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              selectionColor={"#bdd299"}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={wp('5%')}
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            <View style={styles.rememberMeContainer}>
              <Checkbox
                value={isChecked}
                onValueChange={setChecked}
                color={isChecked ? "#455e14" : undefined}
                style={{ borderColor: '#455e14', width: wp('4%'), height: hp('2%'), marginBottom: 3, marginLeft: 3 }}
              />
              <TouchableOpacity  onPress={() => setChecked(! isChecked)}>
              <Text style={styles.rememberMeText}>Remember Me</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPass')}>
              Forgot Password?
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, (!email || !password || emailError) && styles.disabledButton]}
            onPress={() => handleLogin()}
            disabled={!email || !password || emailError}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          
        </View >
        <Text style={styles.switchText}>
            Don't have an account?{" "}
            <Text
              style={{ fontFamily: 'Poppins-Black', fontSize: wp('3.5%'), color: '#455e14' }}
              onPress={() => navigation.navigate('EmailInput')}
            >
              Sign up
            </Text>
          </Text>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'whitesmoke',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: hp('10%'),
  },
  image: {
    width: wp('35%'),
    height: wp('35%'),
    resizeMode: 'contain'
  },
  bottleText: {
    color: '#455e14', 
    fontFamily: 'Poppins-Black', 
    fontSize: hp('4%'),
    textAlign: 'center',
    bottom: hp('2%'),
  },
  title: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    fontSize: wp('5%'),
    textAlign: 'center',
    bottom: hp('1%'),
  },
  formContainer: {
    padding: hp('2%'),
    width: wp('90%'),
    justifyContent: 'center',
    alignSelf: 'center',
    bottom: hp('3%'),
  },
  label: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('.2%'),
    fontSize: wp('3.5%')
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 10,
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('2%'),
    marginBottom: wp('3.2%'),
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
    marginRight: wp('1%'),
  },
  eyeIcon: {
    marginLeft: wp('1.5%'),
    color: '#455e14'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: wp('3.7%'),
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rememberMeText: {
    marginLeft: wp('1%'),
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%'),
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    textDecorationLine: 'underline',
    fontSize: wp('3%'),
    marginRight: wp('1.5%')
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
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%'),
    bottom: hp('3%'),
  },
  errorInput: {
    borderColor: '#f66',
  },
  focusedInput: {
    borderWidth: 1.5,
  },
});