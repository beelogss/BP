import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AlertPro from "react-native-alert-pro";
export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('johndoe@example.com');
  const [studentNumber, setStudentNumber] = useState('123456789');

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Profile Updated', 'Your profile has been updated successfully.');
  };

  // const handleLogout = () => {
  //   Alert.alert('Logged Out', 'You have been logged out.');
  //   navigation.navigate('Login');
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Name:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        ) : (
          <Text style={styles.text}>{name}</Text>
        )}
      </View>
      
      <View style={styles.infoSection}>
        <Text style={styles.label}>Email:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        ) : (
          <Text style={styles.text}>{email}</Text>
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.label}>Student Number:</Text>
        {isEditing ? (
          <TextInput 
            style={styles.input}
            value={studentNumber}
            onChangeText={(text) => setStudentNumber(text)}
          />
        ) : (
          <Text style={styles.text}>{studentNumber}</Text>
        )}
      </View>

      {isEditing ? (
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
          <Text style={styles.buttonText}>Edit Profile</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={() => this.AlertPro.open()}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <AlertPro
          ref={ref => {
            this.AlertPro = ref;
          }}
          onConfirm={() => {
            this.AlertPro.close();
            navigation.navigate('Login');;
          }}
          onCancel={() => this.AlertPro.close()}
          title="Confirmation"
          message="Are you sure you want to logout?"
          textCancel="Cancel"
          textConfirm="Yes"
          customStyles={{
            mask: {
              backgroundColor: "transparent"
            },
            container: {
              borderWidth: 1,
              borderColor: "#455e14",
              shadowColor: "#000000",
              shadowOpacity: 0.1,
              shadowRadius: 10
            },
            buttonCancel: {
              backgroundColor: "#f66"
            },
            buttonConfirm: {
            backgroundColor: "#83951c"
            }
          }}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#455e14',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#455e14',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#83951c',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#d9534f',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
