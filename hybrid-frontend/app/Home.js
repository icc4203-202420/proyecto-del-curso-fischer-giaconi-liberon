import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Home = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>BrewBuddies</Text>
      <Text style={styles.descriptionText}>
        Discover the best bars, beers, and events!
      </Text>

      <Icon name="beer" size={80} color="#c0874f" style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffe5b4',
    padding: 20,
  },
  logo: {
    width: '80%',
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6e4c3e',
  },
  descriptionText: {
    fontSize: 18,
    marginBottom: 30,
    textAlign: 'center',
    color: '#5d3a29',
  },
  buttonContainer: {
    width: '80%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#c0874f',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginTop: 40,
  },
});

export default Home;
