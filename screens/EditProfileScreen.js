import React, { useState, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Alert, Platform, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { UserContext } from '../context/UserContext';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MaterialCommunityIcons, AntDesign, Feather } from '@expo/vector-icons';
import { useBackHandler } from '../hooks/useBackHandler';
import { headerStyles } from './shared/HeaderStyle';

export default function EditProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [name, setName] = useState(user.name);
  const [avatar, setAvatar] = useState(user.avatar);
  const [uploading, setUploading] = useState(false);

  // Use the custom back handler hook
  useBackHandler(navigation);

  const pickImage = async () => {
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

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setUploading(true);

    try {
      let avatarUrl = avatar;
      
      // Only upload if it's a new image (file URI)
      if (avatar && avatar.startsWith('file://')) {
        const formData = new FormData();
        formData.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
        
        console.log('Uploading image...');
        const imageResponse = await fetch(
          'https://079d4493-7284-45e2-8f07-032acf84a6e7-00-okeb4h5jwg8d.pike.replit.dev/api/users/avatar',
          {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (!imageResponse.ok) {
          throw new Error(`Image upload failed: ${imageResponse.status}`);
        }

        const imageData = await imageResponse.json();
        if (!imageData.success) {
          throw new Error(imageData.message || 'Failed to upload image');
        }
        
        avatarUrl = imageData.avatarUrl;
        console.log('Image uploaded successfully:', avatarUrl);
      }

      console.log('Updating profile...');
      const updateResponse = await fetch(
        'https://079d4493-7284-45e2-8f07-032acf84a6e7-00-okeb4h5jwg8d.pike.replit.dev/api/users/update-profile',
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email: user.email, 
            name, 
            avatar: avatarUrl 
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`Profile update failed: ${updateResponse.status}`);
      }

      const updateData = await updateResponse.json();
      if (!updateData.success) {
        throw new Error(updateData.message || 'Failed to update profile');
      }

      setUser({ ...user, name, avatar: avatarUrl });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        'Failed to update profile. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={headerStyles.headerContainer}>
        <Pressable 
          style={headerStyles.backButton} 
          onPress={() => navigation.goBack()}
          android_ripple={{ color: '#e5eeda', borderless: true, radius: 28 }}
        >
          <AntDesign name="arrowleft" size={wp('7%')} color="#83951c" />
        </Pressable>
        <Text style={headerStyles.header}>Edit Profile</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image
                source={avatar ? { uri: avatar } : require('../assets/images/default-profile.png')}
                style={styles.avatar}
              />
              <Pressable 
                style={styles.editIconContainer} 
                onPress={pickImage}
                android_ripple={{ color: '#e5eeda', borderless: true, radius: 28 }}
              >
                <MaterialCommunityIcons name="camera" size={wp('6.5%')} color="white" />
              </Pressable>
            </View>
            <Text style={styles.changePhotoText}>Change Profile Photo</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Feather name="user" size={wp('5%')} color="#83951c" />
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor="#a3a3a3"
                value={name}
                onChangeText={setName}
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={wp('5%')} color="#83951c" />
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={user.email}
                editable={false}
              />
            </View>
          </View>

          {/* Save Button */}
          <Pressable 
            style={[styles.saveButton, uploading && styles.savingButton]}
            onPress={handleSave}
            disabled={uploading}
            android_ripple={{ color: '#6b7b17' }}
          >
            {uploading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: wp('5%'),
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: wp('4%'),
    padding: wp('5%'),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: hp('1%'),
  },
  avatar: {
    width: wp('35%'),
    height: wp('35%'),
    borderRadius: wp('17.5%'),
    borderWidth: 3,
    borderColor: '#e5eeda',
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: wp('6%'),
    padding: wp('3%'),
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  changePhotoText: {
    color: '#83951c',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.8%'),
    marginTop: hp('1%'),
  },
  formSection: {
    marginBottom: hp('3%'),
  },
  label: {
    color: '#455e14',
    fontFamily: 'Poppins-Medium',
    fontSize: wp('3.8%'),
    marginBottom: hp('1%'),
    marginLeft: wp('1%'),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f8f2',
    borderRadius: wp('3%'),
    paddingHorizontal: wp('4%'),
    marginBottom: hp('2%'),
    borderWidth: 1,
    borderColor: '#e5eeda',
  },
  input: {
    flex: 1,
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('3%'),
    fontFamily: 'Poppins-Regular',
    fontSize: wp('3.8%'),
    color: '#455e14',
  },
  disabledInput: {
    color: '#a3a3a3',
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#83951c',
    borderRadius: wp('3%'),
    paddingVertical: hp('1.8%'),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  savingButton: {
    backgroundColor: '#a3a3a3',
  },
  saveButtonText: {
    color: '#ffffff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: wp('4%'),
  }
});