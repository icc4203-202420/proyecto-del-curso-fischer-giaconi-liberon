import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '@env';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UserDetial({ route }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sharedEvents, setSharedEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [friendship, setFriendship] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState([]);

  const getCurrentUser = async () => {
    const auxUser = await SecureStore.getItemAsync('user');
    const currentUser = JSON.parse(auxUser);
    setCurrentUser(currentUser);
    return currentUser;
  }

  const handleSearch = (text) => {
        setSearchText(text);
        const filtered = sharedEvents.filter(event => 
            event.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredEvents(filtered);
    };

  useEffect(() => {
    getCurrentUser();
    // Obtener los detalles del usuario desde AsyncStorage
    const fetchUser = async () => {
      try {
        const tempUser = await getCurrentUser();
        const response = await axios.get(`${API_URL}/api/v1/users/${route.params.userId}`,
            {
                params: {
                    current_user: tempUser.id,
                  }
            });
        if (response.data.friendship) {
            setFriendship(response.data.friendship);
            setEvent(response.data.event);
        } else {
            setSharedEvents(response.data.events);
        }
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [friendship]);

    const setQueryEvent = (event) => {
        setSelectedEvent([event]);
        setSearchText('');
        setFilteredEvents([]);
    }

    const removeSelectedEvent = (event) => {
        setSelectedEvent([]);
    };

    const handleFriendship = async () => {
        try {
            const token = await SecureStore.getItemAsync('token');
            const response = await axios.post(`${API_URL}/api/v1/users/${user.id}/friendships`,
                {
                    friendship: {
                        friend_id: currentUser.id,
                        event_id: selectedEvent[0].id
                    }
                },
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            )
            setFriendship(response.data);
        } catch (error) {
            console.error('Error creando la amistad:', error);
        }
    }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user.first_name} {user.last_name}</Text>
      <Text style={styles.infoText}>ID: {user.id}</Text>
      <Text style={styles.infoText}>handle: {user.handle}</Text>
      <Text style={styles.infoText}>Email: {user.email}</Text>

      {!friendship && (
        <>
            <TextInput
                style={styles.searchInput}
                placeholder="Buscar eventos en comun"
                value={searchText}
                onChangeText={handleSearch}
            />
            {filteredEvents.length > 0 && (
                <View style={styles.dropdown}>
                    {filteredEvents.map((event) => (
                        <TouchableOpacity
                            key={event.id}
                            style={styles.dropdownItem}
                            onPress={() => setQueryEvent(event)}
                        >
                            <Text>{event.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            <View style={styles.taggedUsersContainer}>
                {selectedEvent.map((event) => (
                    <View key={event.id} style={styles.taggedUser}>
                        <Text>{event.name}</Text>
                        <TouchableOpacity onPress={() => removeSelectedEvent(event.id)}>
                            <MaterialCommunityIcons name="close" size={16} color="red" />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.logoutButton} onPress={handleFriendship}>
                <Text style={styles.buttonText}>Añadir amigo</Text>
              </TouchableOpacity>
            </View>
        </>
      )}
    
      
      
      

      
      {event && (
        <Text>Primer evento como amigos: {event.name}</Text>
      )}
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
