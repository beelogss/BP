import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ProgressBarAndroid } from 'react-native';

export default function HomeScreen({ navigation }) {
  const userName = 'John Doe'; // Replace with actual user's name
  const points = 120;
  const co2Reduction = 18;
  const bottleGoal = 100;
  const recycledBottles = 60;
  const progress = recycledBottles / bottleGoal;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {userName}</Text>
        <TouchableOpacity style={styles.rewardsButton} onPress={() => navigation.navigate('Rewards')}>
          <Text style={styles.rewardsButtonText}>Redeem Rewards</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Points</Text>
          <Text style={styles.infoValue}>{points}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>CO2 Reduced</Text>
          <Text style={styles.infoValue}>{co2Reduction} kg</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Recycled Bottles: {recycledBottles}/{bottleGoal}</Text>
        <ProgressBarAndroid styleAttr="Horizontal" indeterminate={false} progress={progress} color="#83951c" />
      </View>

      {/* <Image style={styles.image} source={require('../assets/images/cards.png')} />
      <Text style={styles.description}>
        Help protect the environment by recycling your bottles! Track your recycling efforts and contribute to a cleaner planet.
      </Text> */}

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RecyclingInfo')}>
        <Text style={styles.buttonText}>Learn More About Recycling</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Track')}>
        <Text style={styles.buttonText}>Track Your Recycling</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#e5eeda',
    paddingVertical: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#455e14',
    fontFamily: 'Poppins-Bold',
  },
  rewardsButton: {
    backgroundColor: '#7a9b57',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  rewardsButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#bdd299',
    padding: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 10,
  },
  infoTitle: {
    fontSize: 16,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
  },
  infoValue: {
    fontSize: 20,
    color: '#455e14',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  progressContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#455e14',
    fontFamily: 'Poppins-Regular',
  },
  button: {
    backgroundColor: '#83951c',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
});
