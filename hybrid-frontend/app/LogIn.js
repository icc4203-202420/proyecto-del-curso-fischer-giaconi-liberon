import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

const LogIn = ({ onLogin = () => {} }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigation = useNavigation(); 

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: formData })
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.status.token;
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(data.status.data.user));
        if (token) {
          onLogin(token); 
          setSuccessMessage('Login successful!');
          setErrorMessage('');
          Alert.alert('Success', 'Login successful!');
          navigation.navigate('Home'); 
        } else {
          setErrorMessage('Unable to retrieve token. Please try again.');
        }
      } else {
        const errorMsg = data.status?.message || 'An error occurred.';
        setErrorMessage(errorMsg);
        setSuccessMessage('');
        Alert.alert('Error', errorMsg);
      }

    } catch (error) {
      console.error('Fetch error:', error); 
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleChange('email', value)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleChange('password', value)}
        secureTextEntry
      />
      <Button title="Log In" onPress={handleSubmit} color="#c0874f" />
      <Text style={styles.signupText} onPress={() => navigation.navigate('SignUp')}>
        Don't have an account? Sign Up
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffe5b4',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#8b5e34',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c0874f',
    padding: 12,
    marginVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fff8e1', 
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginBottom: 10,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#8b5e34', 
    textDecorationLine: 'underline',
  },
});

export default LogIn;
