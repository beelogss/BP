import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Checkbox from 'expo-checkbox';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [isChecked, setChecked] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = () => {
    if (validateEmail(email) && password) {
      console.log("Login with: ", email, password);
      navigation.navigate('MHome');
    } else {
      if (!email) setEmailError(true);
      if (!password) setPasswordError(true);
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
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Email</Text>
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

        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputContainer, passwordError && styles.errorInput, passwordFocused && styles.focusedInput]}>
          <MaterialCommunityIcons name="key-outline" size={24} color="#455e14" style={styles.icon} />
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
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
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
              style={{ borderColor: '#455e14', width: 17, height: 17, marginBottom: 3, marginLeft: 3 }}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </View>
          <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPass')}>
            Forgot Password?
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, (!email || !password || emailError) && styles.disabledButton]}
          onPress={handleLogin}
          disabled={!email || !password || emailError}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.googleButton} onPress={() => console.log("Google Login")}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <Text style={styles.switchText}>
          Don't have an account?{" "}
          <Text
            style={{ fontFamily: 'Poppins-Black', fontSize: 14, color: '#455e14' }}
            onPress={() => navigation.navigate('EmailInput')}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: width * 0.08,
    backgroundColor: 'white'
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: height * 0.08,
    marginBottom: height * 0.04
  },
  image: {
    width: width * 0.4,
    height: width * 0.4,
    resizeMode: 'contain'
  },
  formContainer: {
    paddingBottom: 15
  },
  label: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    marginBottom: 2,
    fontSize: 14
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    height: 48
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    fontSize: 14,
    paddingLeft: 5
  },
  icon: {
    marginRight: 5,
  },
  eyeIcon: {
    marginLeft: 8,
    color: '#455e14'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    alignItems: 'center'
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  rememberMeText: {
    marginLeft: 4,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
  forgotPasswordText: {
    fontFamily: 'Poppins-Regular',
    color: '#455e14',
    textDecorationLine: 'underline',
    fontSize: 13,
    marginRight: 3
  },
  button: {
    backgroundColor: '#83951c',
    padding: 12,
    borderRadius: 5,
    marginTop: 16
  },
  disabledButton: {
    backgroundColor: '#83951c80', // Lightened when disabled
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    letterSpacing: 1.5
  },
  googleButton: {
    backgroundColor: '#db4437',
    padding: 12,
    borderRadius: 5,
    marginTop: 16
  },
  switchText: {
    textAlign: 'center',
    color: '#7a9b57',
    marginTop: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 13
  },
  errorInput: {
    borderColor: '#f66',
  },
  focusedInput: {
    borderWidth: 1.5, // Thicker border when focused
  },
});
