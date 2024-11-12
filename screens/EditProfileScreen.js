import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, BackHandler, Platform, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext); // Use user data from context
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log('Image Picker Result:', result); // Log the entire result object

    if (!result.canceled) {
      console.log('Image URI:', result.assets[0].uri); // Debugging log
      setAvatar(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const filename = `profile_images/${uri.substring(uri.lastIndexOf('/') + 1)}`;
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setUploading(true);

    const task = storage().ref(filename).putFile(uploadUri);

    try {
      await task;
      const url = await storage().ref(filename).getDownloadURL();
      setUploading(false);
      return url;
    } catch (e) {
      console.error(e);
      setUploading(false);
      return null;
    }
  };

  const handleSave = async () => {
    let avatarUrl = avatar;
    if (avatar && avatar.startsWith('file://')) {
      avatarUrl = await uploadImage(avatar);
    }

    try {
      // Update user info in the database
      const response = await fetch('http://192.168.1.9:3000/updateProfile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, name, avatar: avatarUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setUser({ ...user, name, avatar: avatarUrl }); // Update user context
        Alert.alert('Success', 'Profile updated successfully');
        navigation.goBack();
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Pressable delayLongPress={200} android_ripple={{ color: '#f9f9f9', borderless: true, radius: 50}}>
        <AntDesign name="arrowleft" size={wp('10%')} color="#83951c" style={styles.backIcon} onPress={() => navigation.navigate('Profile')} />
      </Pressable>
      <View style={styles.boxContainer}>
      <View style={styles.avatarContainer}>
        <Image
          source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editIconContainer} onPress={pickImage}>
        <MaterialCommunityIcons name="pencil-outline" size={wp('6%')} color="#455e14" />
        </TouchableOpacity>
      </View>
      <Text style={styles.changeAvatarText}>Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Saving...' : 'Save Changes'}</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('7%'),
    backgroundColor: 'whitesmoke',
    
  },
  backIcon: {
    marginBottom: wp('3.5%'),
  },
  avatar: {
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('20%'),
    marginBottom: 20,
    alignSelf: 'center',
    marginTop: hp('5%'),
  },
  avatarContainer: {
    position: 'relative',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: hp('3%'),
    right: wp('20%'),
    backgroundColor: '#bdd299',
    borderRadius: wp('2.5%'),
    padding: wp('1%'),
  },
  changeAvatarText: {
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
    marginBottom: hp('.2%'),
    fontSize: wp('3.5%')
  },
  input: {
    width: '100%',
    padding: hp('1%'),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#455e14',
    borderRadius: 10,
    paddingVertical: hp('0.7%'),
    paddingHorizontal: wp('2%'),
    marginBottom: wp('3.2%'),
    height: hp('6%'),
    fontFamily: 'Poppins-Regular',
    paddingLeft: wp('4%'),
    color: '#455e14',
    fontSize: wp('3.5%'),
  },
  button: {
    backgroundColor: '#83951c',
    padding: hp('1.5%'),
    borderRadius: hp('2%'),
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  boxContainer: {
    borderWidth: 1,
    borderRadius: wp('2%'),
    padding: wp('5%'),
    backgroundColor: 'white',
  }
});