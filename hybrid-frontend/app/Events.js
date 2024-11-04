import React, { useState, useEffect } from 'react';
import { View, Dimensions, StyleSheet, Text, TouchableOpacity, FlatList, Image, TextInput, Button, Modal, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Video } from 'expo-av';

const Events = () => {
    const [events, setEvents] = useState([]);
    const [bar, setBar] = useState(null);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [description, setDescription] = useState('');
    const [availableUsers, setAvailableUsers] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [taggedUsers, setTaggedUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const route = useRoute();
    const navigation = useNavigation();
    const { bar_id } = route.params;
    const [selectedEventId, setSelectedEventId] = useState(null);
    const [videoUri, setVideoUri] = useState(null);
    

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
                if (response.data.events.length > 0) {
                    fetchEventPictures(response.data.events[0].id);
                };
            } catch (error) {
                console.error('Error fetching events:', error);
                Alert.alert('Error', 'No se pudieron cargar los eventos.');
            }
        };

        fetchEvents();
    }, [bar_id]);

    const fetchAvailableUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/users`);
            setAvailableUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    useEffect(() => {
        fetchAvailableUsers();
    }, []);

    const fetchEventPictures = async (eventId) => {
        try {
            const response = await axios.get(`${API_URL}/api/v1/event_pictures?event_id=${eventId}`);
            // AGREGAR FUNCIONALIDAD PARA RENDERIZAR LAS IMÁGENES
        } catch (error) {
            console.error('Error fetching event pictures:', error);
        }
    };

    const handleSearch = (text) => {
        setSearchText(text);
        const filtered = availableUsers.filter(user => 
            user.handle.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const addTaggedUser = (user) => {
        if (!taggedUsers.some(taggedUser => taggedUser.id === user.id)) {
            setTaggedUsers([...taggedUsers, user]);
        }
        setSearchText('');
        setFilteredUsers([]);
    };

    const removeTaggedUser = (userId) => {
        setTaggedUsers(taggedUsers.filter(user => user.id !== userId));
    };

    const handleImageUpload = async (eventId) => {
        if (!selectedImage) {
            Alert.alert('Error', 'Por favor, selecciona una imagen antes de cargarla.');
            return;
        }
    
        const currentUser = JSON.parse(await AsyncStorage.getItem('user'));
        const formData = new FormData();
    
        // Asegúrate de que el URI esté correctamente formateado
        formData.append('event_picture[image]', {
            uri: selectedImage,
            name: 'image.jpg', // Asegúrate de usar un nombre de archivo correcto
            type: 'image/jpeg', // El tipo de contenido que estás subiendo
        });
        formData.append('event_picture[event_id]', eventId);
        formData.append('event_picture[user_id]', currentUser.id);
        formData.append('event_picture[description]', description);
    
        // Adjuntar usuarios etiquetados
        taggedUsers.forEach((user) => {
            formData.append('event_picture[tagged_users][]', user.id);
        });
    
        try {
            const response = await axios.post(`${API_URL}/api/v1/event_pictures`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Alert.alert('Imagen cargada exitosamente', `Imagen ID: ${response.data.id}`);
            setOpenUploadModal(false);
            setSelectedImage(null);
            setDescription('');
            setTaggedUsers([]);
        } catch (error) {
            console.error('Error uploading image:', error.response.data);
            Alert.alert('Error', 'No se pudo cargar la imagen. Intenta nuevamente.');
        }
    };

    const generateVideo = async (eventId) => {
        try {
            // Start the video generation
            await axios.post(`${API_URL}/api/v1/events/${eventId}/generate_video`);
            Alert.alert('Video is being generated, please wait a moment...');
    
            // Short delay to give time for the video to be processed on the server
            setTimeout(async () => {
                // Check if the video file now exists
                try {
                    const videoURL = `${API_URL}/videos/event_${eventId}.mp4`;
                    const response = await axios.head(videoURL);
                    
                    if (response.status === 200) {
                        // Video exists, update state to display it
                        setVideoUri(videoURL);
                        setSelectedEventId(eventId);
                        Alert.alert('Video generated successfully!');
                    } else {
                        Alert.alert('Video generation in progress, please try again shortly.');
                    }
                } catch (error) {
                    console.error('Error checking video existence:', error);
                    Alert.alert('Error', 'The video is still processing. Please try again in a moment.');
                }
            }, 3000); // Adjust this delay as needed
        } catch (error) {
            console.error('Error generating video:', error);
            Alert.alert('Error', 'Could not generate the video. Please try again.');
        }
    };

    const handleVideoPress = (eventId) => {
        setSelectedEventId(eventId);
        setVideoUri(`${API_URL}/videos/event_${eventId}.mp4`); // Actualiza la URI del video cuando presionas
    };

    const checkVideoExistence = async (eventId) => {
        try {
            const response = await axios.head(`${API_URL}/videos/event_${eventId}.mp4`);
            if (response.status === 200) {
                // Video exists, set the URI
                setVideoUri((prev) => ({ ...prev, [eventId]: `${API_URL}/videos/event_${eventId}.mp4` }));
                console.log('YESSSSSSSSSSS')
            } else {
                // Video does not exist, handle accordingly (if needed)
                setVideoUri((prev) => ({ ...prev, [eventId]: null }));
            }
        } catch (error) {
            console.log('Video not found:', error);
            setVideoUri((prev) => ({ ...prev, [eventId]: null })); // Set to null if error occurs
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

                        <Button title="Upload Image" onPress={() => setOpenUploadModal(true)} color="#c0874f" />
                        <Button title="Generate Video" onPress={() => generateVideo(item.id)} color="#c0874f" />

                        {videoUri && selectedEventId === item.id && (
                            <View style={styles.videoContainer}>
                                <Text style={styles.videoTitle}>Event Video</Text>
                                <Video
                                    source={{ uri: videoUri }}
                                    style={styles.video}
                                    useNativeControls
                                    resizeMode="contain"
                                    isLooping
                                    shouldPlay={true}  // This prop makes the video autoplay
                                    onError={(error) => {
                                        console.error("Error loading video:", error);
                                        Alert.alert('Error loading video. Please try again.');
                                    }}
                                />
                            </View>
                        )}
                    </View>
                )}
            />

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
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar usuario para etiquetar"
                        value={searchText}
                        onChangeText={handleSearch}
                    />
                    {filteredUsers.length > 0 && (
                        <View style={styles.dropdown}>
                            {filteredUsers.map((user) => (
                                <TouchableOpacity
                                    key={user.id}
                                    style={styles.dropdownItem}
                                    onPress={() => addTaggedUser(user)}
                                >
                                    <Text>{user.handle}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                    <View style={styles.taggedUsersContainer}>
                        {taggedUsers.map((user) => (
                            <View key={user.id} style={styles.taggedUser}>
                                <Text>{user.handle}</Text>
                                <TouchableOpacity onPress={() => removeTaggedUser(user.id)}>
                                    <MaterialCommunityIcons name="close" size={16} color="red" />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                    <Button title="Seleccionar Imagen" onPress={pickImage} color="#c0874f" />
                    {selectedImage && (
                        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                    )}
                    <Button title="Cargar Imagen" onPress={() => handleImageUpload(selectedEventId)} color="#c0874f" />
                    <Button title="Cerrar" onPress={() => setOpenUploadModal(false)} color="#c0874f" />
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffe5b4',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    },
    backButtonText: {
        color: '#6e4c3e',
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6e4c3e',
    },
    eventCard: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
        elevation: 3,
    },
    eventName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6e4c3e',
    },
    eventDate: {
        color: '#5d3a29',
        marginBottom: 10,
    },
    videoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6e4c3e',
        marginBottom: 10,
    },
    video: {
        width: '100%',
        height: 200,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        justifyContent: 'center',
    },
    descriptionInput: {
        borderColor: '#c0874f',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    searchInput: {
        borderColor: '#c0874f',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    dropdown: {
        backgroundColor: '#ffffff',
        borderRadius: 5,
        maxHeight: 150,
        overflow: 'hidden',
        marginBottom: 10,
    },
    dropdownItem: {
        padding: 10,
    },
    taggedUsersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    taggedUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginBottom: 10,
    },
});

export default Events;
