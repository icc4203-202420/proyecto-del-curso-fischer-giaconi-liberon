import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>BrewBuddies</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="View Beers"
          onPress={() => navigation.navigate('Beer')}
          color="#A020F0"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%', 
    marginTop: 20, 
  },
});

export default Home;
