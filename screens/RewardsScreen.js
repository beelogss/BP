import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const rewards = [
  { id: '1', name: 'Discount Voucher', points: 100 },
  { id: '2', name: 'Free Item', points: 200 },
  { id: '3', name: 'Gift Card', points: 500 },
];

export default function RewardsScreen() {
  const handleRedeem = (item) => {
    alert(`Redeemed: ${item.name} for ${item.points} points!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redeem Your Rewards</Text>
      <FlatList
        data={rewards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.rewardItem}>
            <Text style={styles.rewardText}>{item.name} - {item.points} Points</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleRedeem(item)}>
              <Text style={styles.buttonText}>Redeem</Text>
            </TouchableOpacity>
          </View>
        )}
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
  rewardItem: {
    backgroundColor: '#bdd299',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rewardText: {
    fontSize: 16,
    color: '#455e14',
  },
  button: {
    backgroundColor: '#83951c',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
