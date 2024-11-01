import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity, FlatList, Image, TextInput, Button, Modal, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [bar, setBar] = useState(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
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
            } catch (error) {
                console.error('Error fetching events:', error);
                Alert.alert('Error', 'No se pudieron cargar los eventos.');
            }
        };

        fetchEvents();
    }, [bar_id]);

    const handleImageUpload = async (eventId) => {
        if (!selectedImage) {
            Alert.alert('Error', 'Por favor, selecciona una imagen antes de cargarla.');
            return;
        }

        const formData = new FormData();
        formData.append('event_picture[image]', {
            uri: selectedImage,
            type: 'image/jpeg',
            name: 'event_picture.jpg',
        });
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[description]', description);

        try {
            await axios.post(`${API_URL}/api/v1/event_pictures`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Imagen cargada exitosamente');
            setOpenUploadModal(false);
            setSelectedImage(null);
            setDescription('');
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'No se pudo cargar la imagen.');
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header with Back Button and Title */}
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
                    <View style={styles.eventCard}>
                        <Text style={styles.eventName}>{item.name}</Text>
                        <Text style={styles.eventDate}>{new Date(item.date).toLocaleString()}</Text>
                        <Button title="Subir Imagen" onPress={() => setOpenUploadModal(true)} />
                    </View>
                )}
            />

            {/* Modal for image upload */}
            <Modal
                visible={openUploadModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setOpenUploadModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Descripción"
                        value={description}
                        onChangeText={setDescription}
                    />
                    <Button title="Seleccionar Imagen" onPress={pickImage} />
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    )}
                    <Button title="Cargar Imagen" onPress={() => handleImageUpload(events[0].id)} />
                    <Button title="Cerrar" onPress={() => setOpenUploadModal(false)} />
                </View>
            </Modal>
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
});

export default Events;
