import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, Button } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import { API_URL } from '@env';
import * as SecureStore from 'expo-secure-store';

const Attendance = ({ isCheckedIn }) => {
    const [attendances, setAttendances] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [error, setError] = useState('');
    const route = useRoute();
    const { event_id } = route.params;
    const bar_id = route.params.bar_id;

    useEffect(() => {
        setCurrentUser(SecureStore.getItem('user') ? JSON.parse(SecureStore.getItem('user')) : null);
        
        const fetchAttendances = async () => {
            const token = await SecureStore.getItemAsync('token');

            try {
                const response = await axios.get(
                    `${API_URL}/api/v1/bars/${bar_id}/events/${event_id}/attendances`,
                    {
                        headers: {
                            Authorization: "Bearer " + token,
                        },
                    }
                );

                if (Array.isArray(response.data)) {
                    setAttendances(response.data);
                }
            } catch (error) {
                console.error("Error fetching attendances:", error);
                setError('No se pudo obtener la lista de asistencias. Por favor, inténtalo de nuevo.');
            }
        };

        if (event_id) {
            fetchAttendances();
        }
    }, [bar_id, event_id, isCheckedIn]);

    // Función para manejar solicitud de amistad
    const handleAddFriend = async (user_id) => {
        const token = await SecureStore.getItemAsync('token');
        const current_user = await SecureStore.getItemAsync('user') ? JSON.parse(await SecureStore.getItemAsync('user')) : null;

        try {
            await axios.post(
                `${API_URL}/api/v1/users/${user_id}/friendships`, {
                    friendship: {
                        friend_id: current_user.id,
                        bar_id: bar_id,
                        event_id: event_id,
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            await axios.post(
                `${API_URL}/api/v1/users/${current_user.id}/friendships`, {
                    friendship: {
                        friend_id: user_id,
                        bar_id: bar_id,
                        event_id: event_id,
                    },
                },
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );
            Alert.alert('Éxito', 'Solicitud de amistad enviada.');
        } catch (error) {
            console.error('Error al enviar solicitud de amistad:', error);
            Alert.alert('Error', 'Error al enviar solicitud de amistad.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Asistencias para el Evento</Text>
            
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {attendances.length > 0 ? (
                <FlatList
                    data={attendances}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>
                                {item.first_name} {item.last_name} ({item.handle})
                            </Text>
                            <Text style={styles.cardBody}>
                                Registrado: {item.checked_in ? 'Sí' : 'No'}
                            </Text>
                            {currentUser && currentUser.id !== parseInt(item.user_id) && (
                                <Button
                                    title="Agregar Amigo"
                                    color="#C0874F"
                                    onPress={() => handleAddFriend(item.user_id)}
                                />
                            )}
                        </View>
                    )}
                    keyExtractor={(item) => item.user_id.toString()}
                />
            ) : (
                <ActivityIndicator size="large" color="#C0874F" style={styles.loadingIndicator} />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3A2B2A',
        padding: 16,
    },
    title: {
        fontSize: 24,
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 16,
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#593D30',
        borderRadius: 15,
        padding: 16,
        marginVertical: 8,
        borderWidth: 2,
        borderColor: '#C0874F',
    },
    cardTitle: {
        fontSize: 18,
        color: '#C0874F',
        fontWeight: 'bold',
    },
    cardBody: {
        color: '#FFF',
        marginVertical: 8,
    },
    loadingIndicator: {
        marginTop: 16,
    },
});

export default Attendance;
