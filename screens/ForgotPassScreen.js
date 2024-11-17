// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
// import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons'; // Importing MaterialCommunityIcons
// import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

// export default function ForgotPasswordScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [emailFocused, setEmailFocused] = useState(false);
//   const [emailError, setEmailError] = useState(false);

//   // Email validation function
//   const validateEmail = (email) => {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   };


//   const handleForgotPassword = async () => {
//     if (!email || !validateEmail(email)) {
//       setEmailError(true)
//       Alert.alert('Error', 'Please enter a valid email address');
//       return;
//     }

//     try {
//       setIsLoading(true);
//       // Placeholder for future backend implementation
//       Alert.alert('Success', 'A password reset link has been sent to your email');
//       navigation.navigate('ResetPass' , { email });
//     } catch (error) {
//       console.error('Error:', error);
//       Alert.alert('Error', 'An error occurred while requesting password reset');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Disable button if email is invalid or empty
//   const isFormValid = email && validateEmail(email);

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       style={styles.container}
//     >
//       <View style={styles.formContainer}>
//       <TouchableOpacity>
//         <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} 
//           onPress={() => navigation.navigate('Login')}
//         />
//        </TouchableOpacity>
//         <Text style={styles.title}>Forgot Password</Text>
//         <Text style={styles.instructions}>
//           Please enter your email to reset the password
//         </Text>
//         <Text style={styles.label}>Email</Text>

//         {/* Email Input with Icon */}
//         <View style={[styles.inputContainer, emailError && styles.errorInput, emailFocused && styles.focusedInput]}>
//           <MaterialCommunityIcons name="email-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
//           <TextInput
//             style={styles.input}
//             placeholder="Enter your email"
//             value={email}
//             onChangeText={(text) => {
//               setEmail(text);
//               setEmailError(!validateEmail(text));
//             }}
//             keyboardType="email-address"
//             onFocus={() => setEmailFocused(true)}
//               onBlur={() => setEmailFocused(false)}
//           />
//         </View>

//         {/* Submit Button */}
//         <TouchableOpacity
//           style={[styles.button, { backgroundColor: isFormValid ? '#83951c' : '#83951c80' }]}
//           onPress={handleForgotPassword}
//           disabled={!isFormValid || isLoading}
//         >
//           <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send Code'}</Text>
//         </TouchableOpacity>

//         {/* Back to Login */}
//         <Text style={styles.switchText}>
//           Remember your password?{' '}
//           <Text
//             style={{ fontFamily: 'Poppins-Black', fontSize: wp('3.5%'), color: '#455e14' }}
//             onPress={() => navigation.navigate('Login')}
//           >
//             Login
//           </Text>
//         </Text>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: wp('8%'),
//     backgroundColor: '#fff',
//     paddingTop: wp('20%'),
//   },
//   formContainer: {
//     paddingBottom: hp('2%'),
//   },
//   backIcon: {
//     marginBottom: wp('3.5%'),
//   },
//   title: {
//     color: '#455e14',
//     fontSize: wp('7%'),
//     textAlign: 'left',
//     marginBottom: wp('.5%'),
//     marginTop:  wp('2.5%'),
//     fontFamily: 'Poppins-Bold',
//   },
//   instructions: {
//     fontFamily: 'Poppins-Regular',
//     color: '#7a9b57',
//     textAlign: 'left',
//     marginBottom: wp('4%'),
//     fontSize: wp('3.5%'),
//     letterSpacing: -.6,
//   },
//   label: {
//     color: '#455e14',
//     fontFamily: 'Poppins-Bold',
//     fontSize: wp('3.5%')
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#455e14',
//     padding: wp('2%'),
//     borderRadius: 10,
//     marginBottom: wp('3.7%'),
//     height: hp('6%'),
//   },
//   input: {
//     flex: 1,
//     fontFamily: 'Poppins-Regular',
//     color: '#455e14',
//     fontSize: wp('3.5%'),
//   },
//   icon: {
//     marginRight: wp('2%'),
//   },
//   button: {
//     padding: wp('3%'),
//     borderRadius: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     textAlign: 'center',
//     fontFamily: 'Poppins-Bold',
//     fontSize: wp('4%'),
//     letterSpacing: .1,
//   },
//   switchText: {
//     textAlign: 'center',
//     color: '#7a9b57',
//     marginTop: wp('4%'),
//     fontFamily: 'Poppins-Regular',
//     fontSize: wp('3%')
//   },
//   errorInput: {
//     borderColor: '#f66',
//   },
//   focusedInput: {
//     borderWidth: 1.5,
//   },
// });
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email || !validateEmail(email)) {
      setEmailError(true);
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://192.168.1.12:3000/sendVerificationCode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, purpose: 'reset' }), // Include purpose field
      });
      const data = await response.json();
      setIsLoading(false);

      if (data.success) {
        Alert.alert('Success', 'A verification code has been sent to your email');
        navigation.navigate('ResetPass', { email });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      setIsLoading(false);
      Alert.alert('Error', 'An error occurred while requesting password reset');
    }
  };

  const isFormValid = email && validateEmail(email);

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
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.instructions}>
          Please enter your email to reset the password
        </Text>
        <Text style={styles.label}>Email</Text>

        <View style={[styles.inputContainer, emailError && styles.errorInput, emailFocused && styles.focusedInput]}>
          <MaterialCommunityIcons name="email-outline" size={wp('5%')} color="#455e14" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setEmailError(!validateEmail(text));
            }}
            keyboardType="email-address"
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? '#83951c' : '#83951c80' }]}
          onPress={handleForgotPassword}
          disabled={!isFormValid || isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'Sending...' : 'Send Code'}</Text>
        </TouchableOpacity>

        <Text style={styles.switchText}>
          Remember your password?{' '}
          <Text
            style={{ fontFamily: 'Poppins-Black', fontSize: wp('3.5%'), color: '#455e14' }}
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
    paddingHorizontal: wp('8%'),
    backgroundColor: 'whitesmoke',
    paddingTop: wp('20%'),
  },
  formContainer: {
    paddingBottom: hp('2%'),
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
  },
  icon: {
    marginRight: wp('2%'),
  },
  button: {
    padding: wp('3%'),
    borderRadius: 10,
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
    marginTop: wp('4%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3%')
  },
  errorInput: {
    borderColor: '#f66',
  },
  focusedInput: {
    borderWidth: 1.5,
  },
});