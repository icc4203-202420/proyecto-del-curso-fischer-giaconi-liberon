import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfile({ navigation }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener los detalles del usuario desde AsyncStorage
    const fetchUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          // Si no hay usuario almacenado, redirigir al login
          navigation.replace('LogIn');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    // Limpiar el token y la información del usuario
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    console.log("Usuario ha cerrado sesión.");
    // Redirigir al usuario a la pantalla de LogIn
    navigation.replace('LogIn');
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil del Usuario</Text>
      <Text style={styles.infoText}>ID: {user.id}</Text>
      <Text style={styles.infoText}>handle: {user.handle}</Text>
      <Text style={styles.infoText}>Email: {user.email}</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f3e9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#4d3a2a',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#5d3a29',
  },
  buttonContainer: {
    marginTop: 20,
  },
  logoutButton: {
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
});
