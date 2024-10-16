import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    handle: '',
    address_attributes: {
      line1: '',
      line2: '',
      city: '',
      country_id: ''
    }
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAddressChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      address_attributes: {
        ...prevData.address_attributes,
        [name]: value
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${API_URL}/api/v1/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user: formData })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.status.message);
        setErrorMessage('');
        Alert.alert('Success', data.status.message);
        
        navigation.navigate('Home');
      } else {
        const errorMsg = data.status?.message || 'An error occurred.';
        setErrorMessage(errorMsg);
        setSuccessMessage('');
        Alert.alert('Error', errorMsg);
      }

    } catch (error) {
      const errorMsg = 'An error occurred. Please try again later.';
      setErrorMessage(errorMsg);
      setSuccessMessage('');
      Alert.alert('Error', errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      {successMessage ? <Text style={styles.success}>{successMessage}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="First Name"
        onChangeText={text => handleChange('first_name', text)}
        value={formData.first_name}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        onChangeText={text => handleChange('last_name', text)}
        value={formData.last_name}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={text => handleChange('email', text)}
        value={formData.email}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={text => handleChange('password', text)}
        value={formData.password}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        onChangeText={text => handleChange('password_confirmation', text)}
        value={formData.password_confirmation}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.input}
        placeholder="Handle"
        onChangeText={text => handleChange('handle', text)}
        value={formData.handle}
      />

      <TextInput
        style={styles.input}
        placeholder="Address Line 1"
        onChangeText={text => handleAddressChange('line1', text)}
        value={formData.address_attributes.line1}
      />
      <TextInput
        style={styles.input}
        placeholder="Address Line 2"
        onChangeText={text => handleAddressChange('line2', text)}
        value={formData.address_attributes.line2}
      />
      <TextInput
        style={styles.input}
        placeholder="City"
        onChangeText={text => handleAddressChange('city', text)}
        value={formData.address_attributes.city}
      />
      <TextInput
        style={styles.input}
        placeholder="Country ID (optional)"
        onChangeText={text => handleAddressChange('country_id', text)}
        value={formData.address_attributes.country_id}
        keyboardType="numeric"
      />

      <Button title="Sign Up" onPress={handleSubmit} color="#c0874f" />
      <Text style={styles.loginText} onPress={() => navigation.navigate('LogIn')}>
        Already have an account? Log In
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f6e0c7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#7b4b1e',
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    backgroundColor: '#fff8e1',
  },
  backButton: {
    backgroundColor: '#c0874f',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
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
  loginText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#7b4b1e',
    textDecorationLine: 'underline',
  },
});

export default SignUp;
