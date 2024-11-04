import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '@env';
import axios from 'axios';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [bar, setBar] = useState(null);
    const route = useRoute();
    const navigation = useNavigation();
    const { bar_id } = route.params;

    useEffect(() => {
        const fetchEvents = async () => {
            if (!bar_id) {
                Alert.alert('Error', 'No se encontró el ID del bar.');
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/v1/bars/${bar_id}/events`);
                setEvents(response.data.events);
                setBar(response.data.bar);
                // if (response.data.events.length > 0) {
                //     fetchEventPictures(response.data.events[0].id);
                // };
            } catch (error) {
                console.error('Error fetching events:', error);
                Alert.alert('Error', 'No se pudieron cargar los eventos.');
            }
        };

        fetchEvents();
    }, [bar_id]);

    const fetchEventPictures = async (eventId) => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/event_pictures?event_id=${eventId}`);
            // AGREGAR FUNCIONALIDAD PARA RENDERIZAR LAS IMÁGENES
        } catch (error) {
            console.error('Error fetching event pictures:', error);
        }
    };

    const handleEventPress = ( event_id ) => {
        navigation.navigate("EventTabs", { event_id });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>
                {bar && <Text style={styles.title}>{bar.name}</Text>}
            </View>

            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleEventPress(item.id)}
                    >
                        <View style={styles.eventCard}>
                            <Text style={styles.eventName}>{item.name}</Text>
                            <Text style={styles.eventDate}>{new Date(item.date).toLocaleString()}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#ffe5b4',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        backgroundColor: '#c0874f',
    },
    backButton: {
        padding: 10,
        backgroundColor: '#fff2e5',
        borderRadius: 5,
    },
    backButtonText: {
        color: '#c0874f',
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    eventCard: {
        backgroundColor: '#fff2e5',
        padding: 16,
        marginBottom: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    eventName: {
        fontSize: 20,
        color: '#5d3a29',
        fontWeight: 'bold',
    },
    eventDate: {
        color: '#5d3a29',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    descriptionInput: {
        width: '80%',
        borderColor: '#c0874f',
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
        backgroundColor: '#fff',
        color: '#5d3a29',
    },
    imagePreview: {
        width: '80%',
        height: 200,
        marginVertical: 16,
    },
    tagTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    userTag: {
        padding: 10,
        borderColor: '#c0874f',
        borderWidth: 1,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    userTagSelected: {
        backgroundColor: '#c0874f',
    },
});

export default Events;
