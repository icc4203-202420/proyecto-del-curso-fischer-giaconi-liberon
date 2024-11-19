import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { API_URL } from '@env';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function UserDetial({ route, navigation }) {
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [sharedEvents, setSharedEvents] = useState([]);
  const [event, setEvent] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [friendship, setFriendship] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState([]);
  const [newFriendship, setNewFriendship] = useState(false);

  const getCurrentUser = async () => {
    const auxUser = await SecureStore.getItemAsync('user');
    const currentUser = JSON.parse(auxUser);
    setCurrentUser(currentUser);
    return currentUser;
  };

  const handleSearch = (text) => {
    setSearchText(text);
    const filtered = sharedEvents.filter(event =>
      event.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredEvents(filtered);
  };

  useEffect(() => {
    getCurrentUser();
    const fetchUser = async () => {
      try {
        const tempUser = await getCurrentUser();
        const response = await axios.get(`${API_URL}/api/v1/users/${route.params.userId}`, {
          params: { current_user: tempUser.id },
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
  }, [newFriendship]);

  const setQueryEvent = (event) => {
    setSelectedEvent([event]);
    setSearchText('');
    setFilteredEvents([]);
  };

  const removeSelectedEvent = () => {
    setSelectedEvent([]);
  };

  const handleFriendship = async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const current_user = JSON.parse(await SecureStore.getItemAsync('user'));
      await axios.post(`${API_URL}/api/v1/users/${current_user.id}/friendships`, {
        friendship: {
          friend_id: user.id,
          bar_id: selectedEvent[0].bar_id,
          event_id: selectedEvent[0].event_id,
        },
      }, { headers: { Authorization: `Bearer ${token}` } });

      await axios.post(`${API_URL}/api/v1/users/${user.id}/friendships`, {
        friendship: {
          friend_id: current_user.id,
          bar_id: selectedEvent[0].bar_id,
          event_id: selectedEvent[0].event_id,
        },
      }, { headers: { Authorization: `Bearer ${token}` } });

      setNewFriendship(true);
    } catch (error) {
      console.error('Error creando la amistad:', error);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>{user.first_name} {user.last_name}</Text>
        <Text style={styles.infoText}>ID: {user.id}</Text>
        <Text style={styles.infoText}>Handle: {user.handle}</Text>
        <Text style={styles.infoText}>Email: {user.email}</Text>

        {!friendship && (
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar eventos en común"
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
                    <Text style={styles.dropdownText}>{event.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.taggedUsersContainer}>
              {selectedEvent.map((event) => (
                <View key={event.id} style={styles.taggedUser}>
                  <Text style={styles.taggedUserText}>{event.name}</Text>
                  <TouchableOpacity onPress={removeSelectedEvent}>
                    <MaterialCommunityIcons name="close" size={18} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.friendButton} onPress={handleFriendship}>
                <Text style={styles.buttonText}>Añadir amigo</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {event && (
          <Text style={styles.eventText}>Primer evento como amigos: {event.name}</Text>
        )}

        {/* Botón para regresar */}
        <View style={styles.goBackButtonContainer}>
          <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.goBack()}>
            <Text style={styles.buttonText}>Volver</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#f7f3e9',
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center', // Centrado horizontal
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7f3e9',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4d3a2a',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4d3a2a',
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
    color: '#5d3a29',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#c0874f',
    borderWidth: 1,
    borderRadius: 10,
    marginVertical: 10,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '90%', // Ajustado para que ocupe más espacio
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#c0874f',
    backgroundColor: '#fff',
    marginTop: 10,
    width: '90%', // Asegurando que el dropdown sea más pequeño
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#4d3a2a',
  },
  taggedUsersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 15,
  },
  taggedUser: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#c0874f',
    padding: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  taggedUserText: {
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 5,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  friendButton: {
    backgroundColor: '#c0874f',
    padding: 15,
    borderRadius: 30,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventText: {
    marginTop: 20,
    fontSize: 18,
    color: '#4d3a2a',
    textAlign: 'center',
  },
  goBackButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  goBackButton: {
    backgroundColor: '#4d3a2a',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
});
