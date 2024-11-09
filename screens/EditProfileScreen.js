import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, BackHandler, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../context/UserContext'; // Import UserContext
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useFocusEffect } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';

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
      <TouchableOpacity onPress={pickImage}>
        <Image
          source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')}
          style={styles.avatar}
        />
        <Text style={styles.changeAvatarText}>Change Avatar</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={uploading}>
        <Text style={styles.buttonText}>{uploading ? 'Saving...' : 'Save'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  avatar: {
    width: wp('40%'),
    height: wp('40%'),
    borderRadius: wp('20%'),
    marginBottom: 20,
  },
  changeAvatarText: {
    color: '#83951c',
    fontSize: wp('4%'),
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#83951c',
    padding: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: wp('4%'),
  },
});